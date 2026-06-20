'use client'

import { useState } from 'react'
import { CheckCircle2, Loader2 } from 'lucide-react'

type FormStatus = 'idle' | 'submitting' | 'success' | 'error'

export function EditableContactLeadForm() {
  const [status, setStatus] = useState<FormStatus>('idle')
  const [message, setMessage] = useState('')

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setStatus('submitting')
    setMessage('')
    const form = event.currentTarget
    const formData = new FormData(form)

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(Object.fromEntries(formData.entries())),
      })
      const data = await response.json().catch(() => ({}))
      if (!response.ok) throw new Error(data?.message || 'Unable to send your message.')
      setStatus('success')
      setMessage(data?.message || 'Thanks. Your message has been received.')
      form.reset()
    } catch (error) {
      setStatus('error')
      setMessage(error instanceof Error ? error.message : 'Unable to send your message.')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-6 bg-white">
      <div className="grid gap-3 md:grid-cols-2">
        <Field name="name" label="Full name" placeholder="Your name" required />
        <Field name="email" type="email" label="Email address" placeholder="you@example.com" required />
      </div>
      <div className="mt-3 grid gap-3 md:grid-cols-2">
        <Field name="phone" label="Phone number" placeholder="Optional" />
        <Field name="subject" label="Subject" placeholder="How can we help?" />
      </div>
      <label className="mt-3 grid gap-2 text-sm font-extrabold text-[#26313f]">
        Message
        <textarea name="message" required rows={5} placeholder="Tell us what you need help with..." className="border border-[#d7dce3] bg-white px-4 py-3 text-sm font-semibold text-[#26313f] outline-none transition placeholder:text-[#8a94a3] focus:border-[#4382DF] focus:ring-2 focus:ring-[#4382DF]/15" />
      </label>
      <input name="company" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />
      {message ? (
        <div className={`mt-4 flex items-start gap-3 border px-4 py-3 text-sm font-bold ${status === 'success' ? 'border-emerald-200 bg-emerald-50 text-emerald-900' : 'border-red-200 bg-red-50 text-red-800'}`}>
          {status === 'success' ? <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" /> : null}
          <span>{message}</span>
        </div>
      ) : null}
      <button type="submit" disabled={status === 'submitting'} className="mt-5 inline-flex h-12 w-full items-center justify-center gap-2 bg-[#d94a27] px-6 text-sm font-extrabold uppercase tracking-wide text-white transition hover:-translate-y-0.5 hover:bg-[#bd3e20] disabled:cursor-not-allowed disabled:opacity-70">
        {status === 'submitting' ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
        Send message
      </button>
    </form>
  )
}

function Field({ name, label, type = 'text', placeholder, required = false }: { name: string; label: string; type?: string; placeholder?: string; required?: boolean }) {
  return (
    <label className="grid gap-2 text-sm font-extrabold text-[#26313f]">
      {label}
      <input name={name} type={type} required={required} placeholder={placeholder} className="h-11 border border-[#d7dce3] bg-white px-4 text-sm font-semibold text-[#26313f] outline-none transition placeholder:text-[#8a94a3] focus:border-[#4382DF] focus:ring-2 focus:ring-[#4382DF]/15" />
    </label>
  )
}
