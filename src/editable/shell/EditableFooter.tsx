'use client'

import Link from 'next/link'
import { SITE_CONFIG } from '@/lib/site-config'
import { useEditableLocalAuthSession } from '@/editable/components/EditableLocalAuthForms'

export function EditableFooter() {
  const { session, logout } = useEditableLocalAuthSession()
  const columns = [
    {
      title: 'Pages',
      links: [
        ['Home', '/'],
        ['About', '/about'],
        ['Contact', '/contact'],
        ['Search', '/search'],
      ],
    },
    {
      title: 'Account',
      links: session ? [['Create Post', '/create']] : [['Login', '/login'], ['Sign Up', '/signup']],
    },
  ]

  return (
    <footer className="bg-[#12366f] text-white">
      <section className="bg-[linear-gradient(100deg,#231066_0%,#4382DF_50%,#140045_100%)]">
        <div className="pr-container py-10 text-center">
          <p className="text-2xl uppercase tracking-wide">Receive updates from {SITE_CONFIG.name}</p>
          <h2 className="mt-5 text-3xl font-extrabold uppercase">Straight to your inbox</h2>
          <form action="/signup" className="mx-auto mt-7 grid max-w-3xl overflow-hidden rounded-full bg-white text-[#26313f] md:grid-cols-[1fr_auto]">
            <input name="email" type="email" placeholder="Enter your email" className="min-h-[52px] min-w-0 px-8 text-xl font-bold outline-none" />
            <button className="bg-[#d94a27] px-8 text-2xl font-extrabold text-white">SIGN UP</button>
          </form>
        </div>
      </section>

      <div className="pr-container grid gap-8 py-8 md:grid-cols-2">
        {columns.map((column) => (
          <div key={column.title}>
            <h3 className="text-xl font-bold">{column.title}</h3>
            <div className="mt-7 grid gap-2 text-sm font-semibold">
              {column.links.map(([label, href]) => <Link key={label} href={href} className="hover:text-[#AACCD6]">{label}</Link>)}
              {column.title === 'Account' && session ? <button type="button" onClick={logout} className="text-left hover:text-[#AACCD6]">Logout</button> : null}
            </div>
          </div>
        ))}
      </div>

      <div className="pr-container flex flex-wrap items-center justify-between gap-4 border-t border-white/20 py-4 text-sm">
        <div className="flex flex-wrap gap-4">
          <Link href="/">Home</Link>
          <Link href="/about">About</Link>
          <Link href="/contact">Contact</Link>
          <Link href="/search">Search</Link>
          {session ? <Link href="/create">Create Post</Link> : <Link href="/login">Login</Link>}
        </div>
        <p>Copyright © 2026 {SITE_CONFIG.name}. All rights reserved.</p>
      </div>
    </footer>
  )
}
