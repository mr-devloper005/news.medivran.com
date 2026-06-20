import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, Filter, Search } from 'lucide-react'
import { buildPageMetadata } from '@/lib/seo'
import { fetchSiteFeed } from '@/lib/site-connector'
import { buildPostUrl, getPostTaskKey } from '@/lib/task-data'
import { getMockPostsForTask } from '@/lib/mock-posts'
import { SITE_CONFIG, type TaskKey } from '@/lib/site-config'
import type { SitePost } from '@/lib/site-connector'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { pagesContent } from '@/editable/content/pages.content'

export const revalidate = 3

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata({
    path: '/search',
    title: pagesContent.search.metadata.title,
    description: pagesContent.search.metadata.description,
  })
}

const stripHtml = (value: string) => value.replace(/<[^>]*>/g, ' ')
const compactText = (value: unknown) => typeof value === 'string' ? stripHtml(value).replace(/\s+/g, ' ').trim().toLowerCase() : ''
const getContent = (post: SitePost) => post.content && typeof post.content === 'object' ? post.content as Record<string, unknown> : {}
const getImage = (post: SitePost) => {
  const content = getContent(post)
  const media = Array.isArray(post.media) ? post.media.find((item) => typeof item?.url === 'string')?.url : ''
  const images = Array.isArray(content.images) ? content.images.find((item) => typeof item === 'string') as string | undefined : ''
  return media || compactRaw(content.featuredImage) || compactRaw(content.image) || compactRaw(content.thumbnail) || images || ''
}
const compactRaw = (value: unknown) => typeof value === 'string' ? value.trim() : ''
const summaryOf = (post: SitePost) => post.summary || compactRaw(getContent(post).description) || compactRaw(getContent(post).excerpt) || ''

const matches = (post: SitePost, query: string, category: string, task: string) => {
  const content = getContent(post)
  const typeText = compactText(content.type)
  if (typeText === 'comment') return false
  const derivedTask = getPostTaskKey(post) || typeText
  if (task && derivedTask !== task) return false
  const categoryText = compactText(content.category)
  const tagsText = compactText(Array.isArray(post.tags) ? post.tags.join(' ') : '')
  if (category && !(categoryText || tagsText).includes(category)) return false
  if (!query) return true
  return [post.title, post.summary, content.description, content.body, content.excerpt, content.category, Array.isArray(post.tags) ? post.tags.join(' ') : '']
    .some((value) => compactText(value).includes(query))
}

function SearchResultCard({ post, index }: { post: SitePost; index: number }) {
  const task = getPostTaskKey(post) as TaskKey | null
  const href = task ? buildPostUrl(task, post.slug) : `/article/${post.slug}`
  const image = getImage(post)
  const summary = summaryOf(post)
  const taskLabel = SITE_CONFIG.tasks.find((item) => item.key === task)?.label || 'Post'
  const strong = index % 5 === 0

  return (
    <Link href={href} className={`group flex h-full flex-col overflow-hidden border border-[#d7dce3] bg-white transition duration-300 hover:-translate-y-1 hover:border-[#4382df] hover:shadow-[0_10px_24px_rgba(18,54,111,.12)] ${strong ? 'lg:col-span-2' : ''}`}>
      {image ? (
        <div className={`relative overflow-hidden bg-[#e8f2fb] ${strong ? 'aspect-[16/7]' : 'aspect-[16/9]'}`}>
          <img src={image} alt="" className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
          <span className="absolute left-4 top-4 bg-white px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-[0.14em] text-[#12366f] shadow-sm">{taskLabel}</span>
        </div>
      ) : null}
      <div className="flex flex-1 flex-col p-5 sm:p-6">
        {!image ? <span className="w-fit bg-[#e8f2fb] px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-[0.14em] text-[#12366f]">{taskLabel}</span> : null}
        <h2 className="mt-4 line-clamp-3 text-xl font-extrabold leading-7 text-[#26313f] group-hover:text-[#12366f] sm:text-2xl">{post.title}</h2>
        {summary ? <p className="mt-3 line-clamp-3 text-sm leading-6 text-[#4b5563]">{summary}</p> : null}
        <span className="pr-link mt-5 inline-flex items-center gap-2">Open result <ArrowRight className="h-4 w-4" /></span>
      </div>
    </Link>
  )
}

export default async function SearchPage({ searchParams }: { searchParams?: Promise<{ q?: string; category?: string; task?: string; master?: string }> }) {
  const resolved = (await searchParams) || {}
  const query = (resolved.q || '').trim()
  const normalized = query.toLowerCase()
  const category = (resolved.category || '').trim().toLowerCase()
  const task = (resolved.task || '').trim().toLowerCase()
  const useMaster = resolved.master !== '0'
  const feed = await fetchSiteFeed(useMaster ? 1000 : 300, useMaster ? { fresh: true, category: category || undefined, task: task || undefined } : undefined)
  const posts = feed?.posts?.length ? feed.posts : useMaster ? [] : SITE_CONFIG.tasks.filter((item) => item.enabled).flatMap((item) => getMockPostsForTask(item.key))
  const results = posts.filter((post) => matches(post, normalized, category, task)).slice(0, normalized ? 80 : 36)
  const enabledTasks = SITE_CONFIG.tasks.filter((item) => item.enabled)

  return (
    <EditableSiteShell>
      <main className="min-h-screen bg-white text-[#26313f]">
        <section className="pr-wave text-white">
          <div className="pr-container grid gap-8 py-12 lg:grid-cols-[minmax(0,1fr)_400px] lg:items-center lg:py-14">
            <div>
              <div className="max-w-2xl">
                <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-[#aacbd6]">{pagesContent.search.hero.badge}</p>
                <h1 className="mt-4 text-4xl font-extrabold leading-tight sm:text-5xl">{pagesContent.search.hero.title}</h1>
                <p className="mt-4 max-w-xl text-base leading-7 text-white/80">{pagesContent.search.hero.description}</p>
              </div>
            </div>
            <form action="/search" className="bg-white p-5 text-[#26313f] shadow-[0_8px_24px_rgba(0,0,0,.18)] sm:p-6">
              <input type="hidden" name="master" value="1" />
              <label className="flex items-center gap-3 border border-[#b8c3d1] bg-white px-4 py-3">
                <Search className="h-5 w-5 text-[#12366f]" />
                <input name="q" defaultValue={query} placeholder={pagesContent.search.hero.placeholder} className="min-w-0 flex-1 bg-transparent text-base font-semibold outline-none placeholder:text-[#738092]" />
              </label>
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                <label className="flex items-center gap-2 border border-[#b8c3d1] bg-white px-4 py-3">
                  <Filter className="h-4 w-4 text-[#12366f]" />
                  <input name="category" defaultValue={category} placeholder="Category" className="min-w-0 flex-1 bg-transparent text-sm font-semibold outline-none placeholder:text-[#738092]" />
                </label>
                <select name="task" defaultValue={task} className="border border-[#b8c3d1] bg-white px-4 py-3 text-sm font-semibold outline-none">
                  <option value="">All content types</option>
                  {enabledTasks.map((item) => <option key={item.key} value={item.key}>{item.label}</option>)}
                </select>
              </div>
              <button className="mt-3 inline-flex h-12 w-full items-center justify-center bg-[#d94a27] px-6 text-xs font-extrabold uppercase tracking-[0.14em] text-white transition hover:bg-[#c23d1d]" type="submit">Search</button>
            </form>
          </div>
        </section>

        <section className="pr-container py-10 lg:py-12">
          <div className="mx-auto max-w-5xl">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-[#4382df]">{results.length} results</p>
              <h2 className="editorial-brand mt-2 text-4xl font-black tracking-[-0.04em]">{query ? `Results for “${query}”` : pagesContent.search.resultsTitle}</h2>
            </div>
            <Link href="/search" className="inline-flex items-center gap-2 border border-[#9eb0c6] px-4 py-2.5 text-xs font-extrabold uppercase tracking-[0.12em] text-[#12366f] transition hover:bg-[#e8f2fb]">Clear filters <ArrowRight className="h-4 w-4" /></Link>
          </div>

          {results.length ? (
            <div className="mt-7 grid gap-5 md:grid-cols-2">
              {results.map((post, index) => <SearchResultCard key={post.id || post.slug} post={post} index={index} />)}
            </div>
          ) : (
            <div className="mt-7 border border-dashed border-[#9eb0c6] bg-[#f7f9fc] p-8 text-center sm:p-10">
              <p className="text-xl font-extrabold text-[#26313f]">No matching posts found.</p>
              <p className="mt-2 text-sm leading-6 text-[#4b5563]">Try a different keyword, task type, or category.</p>
            </div>
          )}
          </div>
        </section>
      </main>
    </EditableSiteShell>
  )
}
