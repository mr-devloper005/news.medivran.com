'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Menu, Search, X } from 'lucide-react'
import { SITE_CONFIG } from '@/lib/site-config'
import { useEditableLocalAuthSession } from '@/editable/components/EditableLocalAuthForms'

export function EditableNavbar() {
  const [open, setOpen] = useState(false)
  const { session, logout } = useEditableLocalAuthSession()
  const mainLinks = [
    ['Home', '/'],
    ['About', '/about'],
    ['Contact', '/contact'],
    ['Search', '/search'],
  ]

  return (
    <header className="w-full bg-white text-[#061d3e]">
      <div className="bg-[#12366f] text-white">
        <div className="pr-container flex min-h-[58px] items-center justify-between gap-4 text-sm font-bold">
          <Link href="/" className="hover:text-[#AACCD6]">{SITE_CONFIG.name}</Link>
          <button type="button" onClick={() => setOpen((value) => !value)} className="inline-flex h-10 w-10 items-center justify-center md:hidden" aria-label="Toggle navigation">
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
          <div className="ml-auto flex items-stretch self-stretch">
            {session ? <button type="button" onClick={logout} className="px-5 hover:bg-[#0b2857]">Logout</button> : <Link href="/login" className="flex items-center px-5 hover:bg-[#0b2857]">Login</Link>}
            <Link href={session ? '/create' : '/signup'} className="flex items-center bg-[#d94a27] px-6 text-white hover:bg-[#c13f20]">{session ? 'Create Post' : 'Sign Up'}</Link>
          </div>
        </div>
      </div>

      <div className="border-b border-[#d2d6dc] bg-white">
        <div className="pr-container flex min-h-[90px] items-center gap-10">
          <Link href="/" className="text-3xl font-extrabold tracking-[-0.04em] text-[#12366f]">
            {SITE_CONFIG.name.replace(/\./g, ' ')}
          </Link>
          <nav className="hidden items-center gap-9 text-base font-semibold md:flex">
            {mainLinks.map(([label, href]) => <Link key={label} href={href} className="hover:text-[#4382DF]">{label}</Link>)}
          </nav>
          <Link href="/search" className="ml-auto hidden h-10 w-10 items-center justify-center hover:text-[#4382DF] md:inline-flex" aria-label="Search"><Search className="h-6 w-6" /></Link>
        </div>
      </div>

      {open ? (
        <div className="border-b border-[#d2d6dc] bg-white px-4 py-4 md:hidden">
          <div className="grid gap-1">
            {mainLinks.map(([label, href]) => (
              <Link key={`${label}-${href}`} href={href} onClick={() => setOpen(false)} className="px-3 py-3 text-sm font-bold hover:bg-[#e8f2fb]">{label}</Link>
            ))}
            {session ? <button type="button" onClick={() => { logout(); setOpen(false) }} className="px-3 py-3 text-left text-sm font-bold hover:bg-[#e8f2fb]">Logout</button> : <Link href="/login" onClick={() => setOpen(false)} className="px-3 py-3 text-sm font-bold hover:bg-[#e8f2fb]">Login</Link>}
            <Link href={session ? '/create' : '/signup'} onClick={() => setOpen(false)} className="bg-[#d94a27] px-3 py-3 text-sm font-bold text-white">{session ? 'Create Post' : 'Sign Up'}</Link>
          </div>
        </div>
      ) : null}
    </header>
  )
}
