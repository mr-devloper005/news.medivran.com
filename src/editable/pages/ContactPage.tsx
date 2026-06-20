'use client'

import { FileText, Mail, Megaphone } from 'lucide-react'
import { pagesContent } from '@/editable/content/pages.content'
import { EditableContactLeadForm } from '@/editable/components/EditableContactLeadForm'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'

const desks = [
  { icon: FileText, title: 'Editorial desk', body: 'Send story ideas, corrections, source material, and publication questions.' },
  { icon: Megaphone, title: 'Media partnerships', body: 'Discuss distribution, syndication, newsroom collaborations, and campaigns.' },
  { icon: Mail, title: 'General support', body: 'Reach the team for account, publishing, or site-related help.' },
]

export default function ContactPage() {
  return (
    <EditableSiteShell>
      <main className="bg-white text-[#26313f]">
        <section className="pr-wave text-white">
          <div className="pr-container flex min-h-[300px] items-center py-12">
            <div className="max-w-2xl">
              <p className="text-sm font-bold uppercase tracking-wide text-[#AACCD6]">{pagesContent.contact.eyebrow}</p>
              <h1 className="mt-3 text-4xl font-extrabold leading-tight tracking-[-0.035em] sm:text-5xl">Contact</h1>
              <p className="mt-5 max-w-xl text-base font-semibold leading-8 text-white/85">{pagesContent.contact.description}</p>
            </div>
          </div>
        </section>

        <section className="pr-container py-12 lg:py-14">
          <div className="mx-auto grid max-w-5xl gap-8 lg:grid-cols-[310px_minmax(0,1fr)]">
          <aside className="self-start border border-[#d7dce3] bg-[#f7f9fc] p-5">
            <div className="pr-section-rule">
              <h2 className="text-2xl font-extrabold text-[#26313f]">Contact Options</h2>
            </div>
            <div className="mt-5 grid gap-3">
            {desks.map((desk, index) => (
              <div key={desk.title} className="border border-[#d7dce3] bg-white p-4">
                <div className="flex items-center justify-between"><desk.icon className="h-5 w-5 text-[#12366f]" /><span className="text-xs font-extrabold text-[#8a94a3]">0{index + 1}</span></div>
                <h3 className="mt-4 text-base font-extrabold text-[#26313f]">{desk.title}</h3>
                <p className="mt-2 text-sm leading-6 text-[#667085]">{desk.body}</p>
              </div>
            ))}
            </div>
          </aside>

          <div className="border border-[#d7dce3] bg-white p-5 shadow-[0_2px_10px_rgba(16,24,40,.08)] sm:p-7">
            <div className="border-b border-[#d7dce3] pb-5">
              <p className="text-xs font-extrabold uppercase tracking-wide text-[#12366f]">Send a message</p>
              <h2 className="mt-1 text-3xl font-extrabold tracking-[-0.035em] text-[#26313f]">{pagesContent.contact.formTitle}</h2>
            </div>
            <EditableContactLeadForm />
          </div>
          </div>
        </section>
      </main>
    </EditableSiteShell>
  )
}
