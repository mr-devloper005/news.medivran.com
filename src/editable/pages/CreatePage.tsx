'use client'

import { FormEvent, useMemo, useState } from 'react'
import Link from 'next/link'
import { ArrowRight, CheckCircle2, FileText, ImageIcon, Lock, PlusCircle, Send, Sparkles } from 'lucide-react'
import { SITE_CONFIG, type TaskKey } from '@/lib/site-config'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { useEditableLocalAuthSession } from '@/editable/components/EditableLocalAuthForms'
import { pagesContent } from '@/editable/content/pages.content'

type DraftPost = {
  id: string
  task: TaskKey
  title: string
  category: string
  summary: string
  url: string
  image: string
  body: string
  createdAt: string
}

const STORE_KEY = 'slot4:created-posts'

const taskIcon: Record<string, typeof FileText> = {
  article: FileText,
  listing: Sparkles,
  classified: PlusCircle,
  image: ImageIcon,
  profile: Sparkles,
  pdf: FileText,
  sbm: ArrowRight,
}

const fieldClass = 'border border-[#d7dce3] bg-white px-4 py-3 text-sm font-semibold text-[#26313f] outline-none transition placeholder:text-[#8a94a3] focus:border-[#4382DF] focus:ring-2 focus:ring-[#4382DF]/15'

const saveDraft = (draft: DraftPost) => {
  try {
    const existing = JSON.parse(window.localStorage.getItem(STORE_KEY) || '[]')
    const list = Array.isArray(existing) ? existing : []
    window.localStorage.setItem(STORE_KEY, JSON.stringify([draft, ...list].slice(0, 50)))
  } catch {
    window.localStorage.setItem(STORE_KEY, JSON.stringify([draft]))
  }
}

export default function CreatePage() {
  const { session } = useEditableLocalAuthSession()
  const enabledTasks = useMemo(() => SITE_CONFIG.tasks.filter((task) => task.enabled), [])
  const [task, setTask] = useState<TaskKey>((enabledTasks[0]?.key || 'article') as TaskKey)
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState('')
  const [summary, setSummary] = useState('')
  const [url, setUrl] = useState('')
  const [image, setImage] = useState('')
  const [body, setBody] = useState('')
  const [created, setCreated] = useState<DraftPost | null>(null)

  const activeTask = enabledTasks.find((item) => item.key === task) || enabledTasks[0]

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const draft: DraftPost = {
      id: `draft-${Date.now()}`,
      task,
      title: title.trim(),
      category: category.trim() || 'uncategorized',
      summary: summary.trim(),
      url: url.trim(),
      image: image.trim(),
      body: body.trim(),
      createdAt: new Date().toISOString(),
    }
    saveDraft(draft)
    setCreated(draft)
    setTitle('')
    setCategory('')
    setSummary('')
    setUrl('')
    setImage('')
    setBody('')
  }

  if (!session) {
    return (
      <EditableSiteShell>
        <main className="min-h-screen bg-white text-[#26313f]">
          <section className="pr-wave text-white">
            <div className="pr-container flex min-h-[300px] items-center py-12">
              <div className="max-w-2xl">
                <div className="inline-flex h-14 w-14 items-center justify-center bg-white/10 ring-1 ring-white/20">
                  <Lock className="h-7 w-7" />
                </div>
                <p className="mt-6 text-sm font-bold uppercase tracking-wide text-[#AACCD6]">{pagesContent.create.locked.badge}</p>
                <h1 className="mt-3 text-4xl font-extrabold leading-tight tracking-[-0.035em] sm:text-5xl">{pagesContent.create.locked.title}</h1>
                <p className="mt-5 max-w-xl text-base font-semibold leading-8 text-white/85">{pagesContent.create.locked.description}</p>
                <div className="mt-8 flex flex-wrap gap-4">
                  <Link href="/login" className="inline-flex items-center gap-2 bg-[#d94a27] px-6 py-3 text-sm font-extrabold text-white hover:bg-[#bd3e20]">Login <ArrowRight className="h-4 w-4" /></Link>
                  <Link href="/signup" className="inline-flex items-center gap-2 border border-[#4382DF] px-6 py-3 text-sm font-extrabold text-white hover:bg-white hover:text-[#12366f]">Sign Up</Link>
                </div>
              </div>
            </div>
          </section>
        </main>
      </EditableSiteShell>
    )
  }

  return (
    <EditableSiteShell>
      <main className="min-h-screen bg-white text-[#26313f]">
        <section className="pr-wave text-white">
          <div className="pr-container flex min-h-[320px] items-center py-12">
            <div className="max-w-2xl">
              <p className="text-sm font-bold uppercase tracking-wide text-[#AACCD6]">{pagesContent.create.hero.badge}</p>
              <h1 className="mt-3 text-4xl font-extrabold leading-tight tracking-[-0.035em] sm:text-5xl">{pagesContent.create.hero.title}</h1>
              <p className="mt-5 max-w-xl text-base font-semibold leading-8 text-white/85">{pagesContent.create.hero.description}</p>
            </div>
          </div>
        </section>

        <section className="pr-container py-12 lg:py-16">
          <div className="mx-auto grid max-w-5xl gap-8 lg:grid-cols-[310px_minmax(0,1fr)]">
            <aside className="self-start border border-[#d7dce3] bg-[#f7f9fc] p-5">
              <div className="pr-section-rule">
                <h2 className="text-2xl font-extrabold text-[#26313f]">Post Type</h2>
              </div>
              <p className="mt-3 text-sm leading-6 text-[#667085]">Choose where this draft belongs. The form keeps the same post data fields for every type.</p>
              <div className="mt-5 grid gap-3">
                {enabledTasks.map((item) => {
                  const Icon = taskIcon[item.key] || FileText
                  const active = item.key === task
                  return (
                    <button key={item.key} type="button" onClick={() => setTask(item.key)} className={`border p-4 text-left transition hover:-translate-y-0.5 ${active ? 'border-[#12366f] bg-[#12366f] text-white' : 'border-[#d7dce3] bg-white text-[#26313f]'}`}>
                      <span className="flex items-center gap-3">
                        <Icon className="h-5 w-5" />
                        <span className="text-sm font-extrabold">{item.label}</span>
                      </span>
                      <span className="mt-2 block text-xs font-semibold opacity-70">{item.description}</span>
                    </button>
                  )
                })}
              </div>
            </aside>

            <form onSubmit={submit} className="border border-[#d7dce3] bg-white p-5 shadow-[0_2px_10px_rgba(16,24,40,.08)] sm:p-7">
              <div className="flex flex-wrap items-start justify-between gap-3 border-b border-[#d7dce3] pb-5">
                <div>
                  <p className="text-xs font-extrabold uppercase tracking-wide text-[#12366f]">Create {activeTask?.label || 'post'}</p>
                  <h2 className="mt-1 text-3xl font-extrabold tracking-[-0.035em] text-[#26313f]">{pagesContent.create.formTitle}</h2>
                </div>
                <span className="bg-[#e8f2fb] px-4 py-2 text-xs font-extrabold uppercase tracking-wide text-[#12366f]">{session.name}</span>
              </div>

              <div className="mt-6 grid gap-4">
                <input className={fieldClass} value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Post title" required />
                <div className="grid gap-4 sm:grid-cols-2">
                  <input className={fieldClass} value={category} onChange={(event) => setCategory(event.target.value)} placeholder="Category" />
                  <input className={fieldClass} value={url} onChange={(event) => setUrl(event.target.value)} placeholder="Website or source URL" />
                </div>
                <input className={fieldClass} value={image} onChange={(event) => setImage(event.target.value)} placeholder="Featured image URL" />
                <textarea className={`${fieldClass} min-h-24`} value={summary} onChange={(event) => setSummary(event.target.value)} placeholder="Short summary" required />
                <textarea className={`${fieldClass} min-h-48`} value={body} onChange={(event) => setBody(event.target.value)} placeholder="Main content, details, notes, or description" required />
              </div>

              {created ? (
                <div className="mt-5 border border-emerald-200 bg-emerald-50 p-4 text-emerald-900">
                  <p className="flex items-center gap-2 text-sm font-extrabold"><CheckCircle2 className="h-5 w-5" /> {pagesContent.create.successTitle}</p>
                  <p className="mt-1 text-sm font-semibold opacity-80">{created.title}</p>
                </div>
              ) : null}

              <button type="submit" className="mt-5 inline-flex h-12 w-full items-center justify-center gap-2 bg-[#d94a27] px-6 text-sm font-extrabold uppercase tracking-wide text-white transition hover:-translate-y-0.5 hover:bg-[#bd3e20]">
                <Send className="h-4 w-4" /> {pagesContent.create.submitLabel}
              </button>
            </form>
          </div>
        </section>
      </main>
    </EditableSiteShell>
  )
}
