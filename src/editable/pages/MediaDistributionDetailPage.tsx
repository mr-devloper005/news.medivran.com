import { redirect } from 'next/navigation'
export const revalidate = 3
export async function generateStaticParams() { return [] }
export async function generateMetadata({ params: _params }: { params: Promise<{ slug: string }> }) {
  return { title: 'Search' }
}
export default async function MediaDistributionDetailPage({
  params: _params,
}: {
  params: Promise<{ slug: string }>
}) {
  redirect('/search')
}
