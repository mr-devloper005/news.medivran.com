import Link from 'next/link'
import { Eye, Megaphone, Search, ShieldCheck, Sparkles, Star, Wand2, ZoomIn } from 'lucide-react'
import type { SitePost } from '@/lib/site-connector'
import type { HomeTimeSection } from '@/lib/task-data'
import type { TaskKey } from '@/lib/site-config'
import { SITE_CONFIG } from '@/lib/site-config'
import { getEditableExcerpt, getEditablePostImage, postHref } from '@/editable/cards/PostCards'

type HomeSectionProps = {
  primaryTask: TaskKey
  primaryRoute: string
  posts: SitePost[]
  timeSections: HomeTimeSection[]
}

const reasons = [
  { icon: Megaphone, color: '#5f9af4', title: 'True Multichannel Amplification', text: 'Extend your story across multiple channels with clear release pages, searchable archives, and audience-friendly summaries.' },
  { icon: ZoomIn, color: '#0aa39a', title: 'Unmatched Discoverability', text: 'Organize releases with categories, summaries, and detail pages that make every update easier to find and read.' },
  { icon: Sparkles, color: '#b565f2', title: 'Innovation in One Platform', text: 'Create a consistent public presence for announcements, updates, resources, and featured industry stories.' },
  { icon: Eye, color: '#2c5bc6', title: 'Maximum Visibility', text: 'Give important updates a polished home with strong hierarchy, clear navigation, and direct paths to explore more.' },
  { icon: ShieldCheck, color: '#ef5ca8', title: 'Most Trusted Source', text: 'Present information with a stable editorial layout built for scanning, reading, and sharing.' },
  { icon: Star, color: '#ff5b2e', title: 'Premium Service and Guidance', text: 'Use focused content blocks, topic sections, and resource areas to support visitors at every step.' },
]

const sectors = ['News in Focus', 'Auto & Transportation', 'Consumer Products & Retail', 'Energy', 'Entertainment', 'Financial Services & Investing', 'General Business', 'Health', 'People & Culture', 'Policy & Public Interest', 'Sports']

function formattedDate(post?: SitePost) {
  return post?.publishedAt ? new Date(post.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).toUpperCase() : 'JUN 19, 2026'
}

export function EditableHomeHero(_props: HomeSectionProps) {
  return (
    <section>
      <div className="pr-wave text-white">
        <div className="pr-container flex min-h-[360px] items-center py-14">
          <div className="max-w-2xl">
          <h1 className="text-4xl font-extrabold leading-tight lg:text-5xl">
            Unmatched Visibility.<br />Powerful Results.
          </h1>
          <p className="mt-6 max-w-xl text-lg font-semibold leading-8">
            Share your story through a focused distribution experience that amplifies updates across every channel visitors use to discover what matters.
          </p>
          <div className="mt-8 flex flex-wrap gap-7">
            <Link href="/create" className="bg-[#d94a27] px-7 py-4 font-extrabold text-white transition hover:bg-[#bd3e20]">Create Post</Link>
            <Link href="/contact" className="border border-[#4382DF] px-7 py-4 font-extrabold text-white transition hover:bg-white hover:text-[#12366f]">Contact</Link>
          </div>
          </div>
        </div>
      </div>
      <div className="bg-[#eef0f2] py-6 text-center text-[#002f6c]">
        <p className="pr-container text-base">Big News! A refined publishing experience is ready for your latest updates. <Link href="/search" className="ml-2 bg-white px-3 py-2 text-xs font-bold">Explore</Link></p>
      </div>
    </section>
  )
}

export function EditableStoryRail(_props: HomeSectionProps) {
  return (
    <section className="pr-container py-16">
      <div className="pr-section-rule">
        <h2 className="pr-section-title">What Sets {SITE_CONFIG.name.replace(/\./g, ' ')} Apart</h2>
      </div>
      <p className="mt-3 text-lg text-[#26313f]">Top reasons to work with a focused public updates platform</p>
      <div className="mt-8 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {reasons.map(({ icon: Icon, color, title, text }) => (
          <article key={title} className="pr-card p-8 transition hover:-translate-y-1 hover:shadow-lg">
            <span className="inline-flex h-12 w-12 items-center justify-center rounded-full text-white" style={{ backgroundColor: color }}>
              <Icon className="h-6 w-6" />
            </span>
            <h3 className="mt-8 text-xl font-extrabold text-[#1f2937]">{title}</h3>
            <p className="mt-4 text-base leading-7 text-[#101827]">{text}</p>
            <Link href="/about" className="pr-link mt-4 inline-block">Learn More</Link>
          </article>
        ))}
      </div>
    </section>
  )
}

export function EditableMagazineSplit({ primaryTask, primaryRoute, posts }: HomeSectionProps) {
  const solutions = posts.slice(0, 3)
  return (
    <section className="pr-container py-12">
      <div className="pr-section-rule">
        <h2 className="pr-section-title">Featured Solutions</h2>
      </div>
      <p className="mt-3 text-lg text-[#26313f]">Explore tools that help you plan smarter, create faster, and amplify your story further.</p>
      <div className="mt-6 grid gap-8 md:grid-cols-3">
        {(solutions.length ? solutions : [null, null, null]).map((post, index) => (
          <Link key={post?.id || `solution-${index}`} href={post ? postHref(primaryTask, post, primaryRoute) : primaryRoute} className="group block">
            <div className={`flex aspect-[1.05] items-center justify-center rounded-lg ${index === 1 ? 'bg-[#12366f]' : 'bg-[#eaf2fb]'}`}>
              {post ? <img src={getEditablePostImage(post)} alt={post.title} className="h-full w-full rounded-lg object-cover transition group-hover:scale-[1.02]" /> : <Wand2 className={`h-24 w-24 ${index === 1 ? 'text-white' : 'text-[#12366f]'}`} />}
            </div>
            <h3 className="mt-5 text-xl font-medium leading-7 text-[#101827] group-hover:text-[#12366f]">{post?.title || ['Instantly Turn One Story into Multiple Campaign Assets', 'Plan Smarter and Build Better Campaigns', 'Make Every Press Release More Engaging and Effective'][index]}</h3>
            <p className="mt-3 text-sm leading-6 text-[#101827]">{post ? getEditableExcerpt(post, 160) : 'Build polished campaign moments with a clear, useful publishing experience for readers.'} <span className="pr-link">Learn more.</span></p>
          </Link>
        ))}
      </div>
      <Link href={primaryRoute} className="mt-8 block border border-[#9aa0a6] py-2 text-center text-[#26313f] hover:bg-[#e8f2fb]">Explore our platform</Link>
    </section>
  )
}

export function EditableTimeCollections({ primaryTask, primaryRoute, posts }: HomeSectionProps) {
  const lead = posts[3] || posts[0]
  const side = posts.slice(4, 8)
  if (!lead) return null
  return (
    <section className="pr-container py-16">
      <div className="pr-section-rule">
        <h2 className="pr-section-title">Featured Stories</h2>
      </div>
      <p className="mt-3 text-lg text-[#26313f]">Highlights from the latest press releases</p>
      <div className="mt-6 grid gap-8 lg:grid-cols-[1fr_1fr]">
        <Link href={postHref(primaryTask, lead, primaryRoute)} className="group block">
          <div className="border border-[#d7d7d7] p-7">
            <img src={getEditablePostImage(lead)} alt={lead.title} className="aspect-[16/9] w-full object-cover" />
          </div>
          <p className="mt-7 text-sm uppercase text-[#26313f]">{formattedDate(lead)}, 07:04 ET</p>
          <h3 className="mt-2 text-xl font-extrabold uppercase text-[#26313f] group-hover:text-[#12366f]">{lead.title}</h3>
          <p className="mt-4 line-clamp-4 text-base leading-6 text-[#101827]">{getEditableExcerpt(lead, 230)}</p>
        </Link>
        <div className="grid gap-6">
          {side.map((post) => (
            <Link key={post.id || post.slug} href={postHref(primaryTask, post, primaryRoute)} className="group grid gap-6 sm:grid-cols-[165px_1fr]">
              <img src={getEditablePostImage(post)} alt={post.title} className="aspect-[16/9] w-full border border-[#d7d7d7] object-cover p-1" />
              <div>
                <p className="text-sm uppercase text-[#26313f]">{formattedDate(post)}, 09:00 ET</p>
                <h3 className="mt-2 text-lg font-extrabold leading-6 text-[#26313f] group-hover:text-[#12366f]">{post.title}</h3>
                <p className="mt-4 line-clamp-2 text-sm leading-6 text-[#4b5563]">{getEditableExcerpt(post, 120)}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
      <Link href={primaryRoute} className="mt-9 block border border-[#9aa0a6] py-2 text-center text-[#26313f] hover:bg-[#e8f2fb]">Browse All News Stories</Link>
    </section>
  )
}

export function EditableHomeCta({ primaryRoute = '/search', primaryTask = 'article', posts = [] }: Partial<HomeSectionProps>) {
  const topics = ['World Cup', 'Summer Travel', "America's 250th Anniversary"]
  const topicPosts = posts.slice(8, 17)

  return (
    <section className="pr-container grid gap-10 py-16 lg:grid-cols-[1fr_260px]">
      <div>
        <div className="pr-section-rule">
          <h2 className="pr-section-title">Trending Topics</h2>
        </div>
        <p className="mt-3 text-lg text-[#26313f]">Track the topics taking shape and powering conversations around the world.</p>
        <div className="mt-6 grid gap-8 md:grid-cols-3">
          {topics.map((topic, index) => (
            <div key={topic}>
              <div className="relative flex h-36 items-center justify-center overflow-hidden bg-[#12366f] text-white">
                {topicPosts[index] ? <img src={getEditablePostImage(topicPosts[index])} alt="" className="absolute inset-0 h-full w-full object-cover opacity-35" /> : null}
                <h3 className="relative text-lg font-extrabold">{topic}</h3>
              </div>
              <div className="mt-4 grid gap-3 text-sm leading-6">
                {topicPosts.slice(index * 3, index * 3 + 3).map((post) => (
                  <Link key={post.id || post.slug} href={postHref(primaryTask as TaskKey, post, primaryRoute)} className="hover:text-[#12366f]">
                    <span className="block text-[#26313f]">11:00 ET</span>
                    {post.title}
                  </Link>
                ))}
              </div>
              <Link href={primaryRoute} className="pr-link mt-4 inline-block">View All {topic} News</Link>
            </div>
          ))}
        </div>
        <Link href={primaryRoute} className="mt-8 block border border-[#9aa0a6] py-2 text-center text-[#26313f] hover:bg-[#e8f2fb]">View All Trending Topics</Link>
      </div>
      <aside>
        <div className="pr-section-rule">
          <h2 className="pr-section-title">Browse News</h2>
        </div>
        <p className="mt-3 text-lg leading-7 text-[#26313f]">Find news by industry or search for the topics that matter most to you</p>
        <div className="mt-6 grid text-sm">
          {sectors.map((sector) => (
            <Link key={sector} href={`${primaryRoute}?category=${sector.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`} className="border-b border-[#9aa0a6] py-2 hover:text-[#12366f]">{sector}</Link>
          ))}
        </div>
        <Link href={primaryRoute} className="mt-8 block border border-[#9aa0a6] py-2 text-center text-[#26313f] hover:bg-[#e8f2fb]">Browse All Sectors & Topics</Link>
        <form action="/search" className="mt-8 flex border border-[#9aa0a6]">
          <input name="q" placeholder="Search news" className="min-w-0 flex-1 px-3 py-2 outline-none" />
          <button className="px-3"><Search className="h-4 w-4" /></button>
        </form>
      </aside>
    </section>
  )
}
