import { redirect } from 'next/navigation'

export const revalidate = 3
export const generateMetadata = () => ({ title: 'Search' })

export default async function MediaDistributionPage({
  searchParams: _searchParams,
}: {
  searchParams?: Promise<{ category?: string; page?: string }>
}) {
  redirect('/search')
}
