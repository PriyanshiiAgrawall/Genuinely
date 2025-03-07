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
import { Description } from '@radix-ui/react-toast'
import { useToast } from '@/hooks/use-toast'
import { Switch } from '@/components/ui/switch'
import { Tooltip, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { TooltipContent } from '@radix-ui/react-tooltip'
import { isAccepting, isAcceptingT, toggleAcceptance } from '@/app/actions/account'


export default function Testimonials({
    query,
    spaceId,
    uniqueLink,
}: {
    query: string
    spaceId: string
    uniqueLink: string
}) {
    const { data: session, status, update } = useSession()
    const router = useRouter()
    const { toast } = useToast();
    const [testimonials, setTestimonials] = useState<any[]>([])
    const [total, setTotal] = useState(0)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(false)
    const [page, setPage] = useState(1)
    const limit = 9
    const [isAcceptingTestimonials, setIsAcceptingTestimonials] = useState(true);
    const [subTier, setSubTier] = useState<any>(null)
    const [canCollect, setCanCollect] = useState(true)
    const [toggle, setToggle] = useState(true)

    // Redirect to sign-in if no session
    useEffect(() => {
        if (!session && status !== 'loading') {
            router.push('/sign-in')
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
            // toast({
            //     title: "Testimonial Alert",
            //     description: "Refresh the page if you dont see your testimonials",
            // })
            const res = await fetch(`/api/testimonial?spaceId=${spaceId}&query=${query}&page=${page}&limit=${limit}`)
            if (!res.ok) throw new Error('Failed to fetch')

            const data = await res.json()
            console.log("Fetched Data:", JSON.stringify(data, null, 2)); // Debugging
            if (data?.testimonials?.length > 0) {
                setTestimonials(data.testimonials); // Set testimonials only if data is received
                setTotal(data.totalTestimonials || 0);
            }
            else {
                setTestimonials([])
                setTotal(0)

            }

        } catch (err) {
            console.error('Error fetching testimonials:', err)
            setError(true)
        } finally {
            setLoading(false)
        }
    }

    // Fetch data on mount & when page changes
    useEffect(() => {
        if (status === "authenticated" && session?.user?.id) {
            fetchTestimonials();
        }
    }, [status, session?.user?.id, page]);



    useEffect(() => {
        async function data() {
            const accept = await isAcceptingT(spaceId);
            console.log(accept);
            setIsAcceptingTestimonials(accept);
        }

        data();
    }, [session, toggle])
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
    async function handleSwitchToggle() {
        setLoading(true);
        try {
            setToggle((prev) => !prev);

            const newValue = !isAcceptingTestimonials; // Toggle the value locally
            setIsAcceptingTestimonials(newValue); // Update state immediately

            await toggleAcceptance(spaceId); // Call API

            toast({
                title: `You are ${newValue ? "" : "not"} accepting testimonials right now`,
                variant: `${newValue ? "default" : "destructive"}`
            });

        } catch (err) {
            throw err;

        }
        finally {
            setLoading(false);
        }

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

                    <div className="flex justify-between items-center w-full p-4">
                        {/* Reload Button on the left */}
                        <Button
                            onClick={handleRefresh}
                            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md active:translate-y-1"
                        >
                            <RotateCw className="inline w-5 h-5 mr-2" /> Search
                        </Button>

                        {/* Switch with Tooltip on the right */}
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger>
                                    <div className="flex items-center gap-2">
                                        <span>Accepting Testimonials</span>
                                        <div>
                                            <Switch checked={isAcceptingTestimonials} onCheckedChange={handleSwitchToggle} disabled={loading} />
                                        </div>
                                    </div>
                                </TooltipTrigger>
                                {!isAcceptingTestimonials && (
                                    <TooltipContent>
                                        Hey, you are not accepting testimonials right now. OK?
                                    </TooltipContent>
                                )}
                            </Tooltip>
                        </TooltipProvider>

                    </div>

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
                    ) : (!loading && !error && <EmptyState uniqueLink={uniqueLink} />

                    )


                    }
                </div>
            )}
        </div>
    )
}
