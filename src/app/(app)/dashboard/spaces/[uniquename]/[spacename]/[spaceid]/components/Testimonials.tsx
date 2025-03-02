'use client'

import React, { useEffect, useState, useMemo } from 'react'
import { MultipleSkeletonTestimonialCard } from '@/components/ui/skeletons'
import { EmptyState } from './EmptyState'
import { RotateCw, Terminal } from 'lucide-react'
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from '@/components/ui/pagination'
import { useSession } from 'next-auth/react'
import { canCollectTestimonial } from '@/lib/featureAccess'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import TestimonialCard from './TestimonialCard'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'

export default function Testimonials({
    query,
    spaceId,
    uniqueLink,
}: {
    query: string
    spaceId: string
    uniqueLink: string
}) {
    const { data: session, status } = useSession()
    const router = useRouter()

    const [testimonials, setTestimonials] = useState<any[]>([])
    const [total, setTotal] = useState(0)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(false)
    const [page, setPage] = useState(1)
    const limit = 9

    const [subTier, setSubTier] = useState<any>(null)
    const [canCollect, setCanCollect] = useState(true)

    // Redirect to login if no session
    useEffect(() => {
        if (!session && status !== 'loading') {
            router.push('/login')
        } else if (session) {
            setSubTier(session?.user?.subscriptionTier)
        }
    }, [session, status, router])

    // Fetch testimonials manually
    const fetchTestimonials = async () => {
        if (!session?.user?.id) return
        setLoading(true)
        setError(false)

        try {
            const res = await fetch(`/api/testimonial?spaceId=${spaceId}&query=${query}&page=${page}&limit=${limit}`)
            if (!res.ok) throw new Error('Failed to fetch')

            const data = await res.json()
            console.log("Fetched Data:", JSON.stringify(data, null, 2)); // Debugging

            if (!data || !data.testimonials) {
                setTestimonials([])
                setTotal(0)
                return
            }
            setTestimonials([...data.testimonials]);
            setTotal(data.totalTestimonials || 0);
        } catch (err) {
            console.error('Error fetching testimonials:', err)
            setError(true)
        } finally {
            setLoading(false)
        }
    }

    // Fetch data on mount & when page changes
    useEffect(() => {
        if (session?.user?.id) {
            fetchTestimonials()
        }
    }, [status, session?.user?.id, page])

    // Check if testimonials can be collected
    useEffect(() => {
        if (subTier) {
            setCanCollect(canCollectTestimonial(subTier, testimonials.length))
        }
    }, [subTier, testimonials])

    // Calculate total pages
    const totalPages = useMemo(() => {
        return Math.ceil(total / limit)
    }, [total, limit])

    // Refresh data manually
    const handleRefresh = () => {
        fetchTestimonials()
    }

    // Handle deleting a testimonial
    const handleDelete = (deletedId: string) => {
        setTestimonials((prev) => prev.filter((t) => t._id !== deletedId))
        setTotal((prev) => prev - 1)
    }

    return (
        <div>
            {loading ? (
                <MultipleSkeletonTestimonialCard />
            ) : error ? (
                <div className="text-red-500">Failed to load testimonials. Please try again later.</div>
            ) : (
                <div>
                    {!canCollect && (
                        <Alert className="bg-yellow-50 border-l-4 mb-4 border-yellow-400 text-yellow-700 p-4">
                            <Terminal className="h-4 w-4 mr-2" />
                            <div>
                                <AlertTitle className="font-bold">Heads up!</AlertTitle>
                                <AlertDescription>
                                    You have reached the limit of testimonials for your current subscription tier.
                                    Please upgrade your subscription to collect more testimonials.
                                </AlertDescription>
                            </div>
                        </Alert>
                    )}

                    <Button
                        onClick={handleRefresh}
                        className="mb-4 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md active:translate-y-1"
                    >
                        <RotateCw className="inline w-5 h-5 mr-2" /> Refresh
                    </Button>

                    {testimonials.length > 0 ? (
                        <>
                            <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 mx-auto max-w-7xl">
                                {testimonials.map((testimonial) => (
                                    <div key={testimonial._id} className="break-inside-avoid mb-6">
                                        <TestimonialCard
                                            onDelete={handleDelete}
                                            location="testimonials"
                                            testimonial={testimonial}
                                            onMutate={fetchTestimonials}
                                        />
                                    </div>
                                ))}
                            </div>

                            {totalPages > 1 && (
                                <div className="mt-8">
                                    <Pagination>
                                        <PaginationContent>
                                            <PaginationItem>
                                                <PaginationPrevious
                                                    onClick={() => setPage(Math.max(1, page - 1))}
                                                    className={page === 1 ? 'pointer-events-none opacity-50' : ''}
                                                />
                                            </PaginationItem>
                                            {[...Array(totalPages)].map((_, i) => (
                                                <PaginationItem key={i}>
                                                    <PaginationLink
                                                        onClick={() => setPage(i + 1)}
                                                        isActive={page === i + 1}
                                                    >
                                                        {i + 1}
                                                    </PaginationLink>
                                                </PaginationItem>
                                            ))}
                                            <PaginationItem>
                                                <PaginationNext
                                                    onClick={() => setPage(Math.min(totalPages, page + 1))}
                                                    className={page === totalPages ? 'pointer-events-none opacity-50' : ''}
                                                />
                                            </PaginationItem>
                                        </PaginationContent>
                                    </Pagination>
                                </div>
                            )}
                        </>
                    ) : (
                        !loading && !error && <EmptyState uniqueLink={uniqueLink} />
                    )}
                </div>
            )}
        </div>
    )
}
