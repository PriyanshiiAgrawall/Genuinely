"use client"



import Image from 'next/image';
import Link from 'next/link';



import { useParams, useSearchParams } from 'next/navigation';

import TestimonialCarousel from '../../dashboard/spaces/[uniquename]/[spacename]/[spaceid]/components/TestimonialCarousel';
import TestimonialCard from '../../dashboard/spaces/[uniquename]/[spacename]/[spaceid]/components/TestimonialCard';
import { getSpaceOwner } from '@/app/actions/spaces';
import { getLovedTestimonials } from '@/app/actions/loveBooks';
import { useEffect, useState } from 'react';
import { getSubTier } from '@/app/actions/account';





const EmbedPage = () => {
    const params = useParams();
    const searchParams = useSearchParams();

    const spaceId = params.spaceId;
    const theme = searchParams.get("theme") || "light";
    const layout = searchParams.get("layout") || "carousel";
    const limit = parseInt(searchParams.get("limit") || '10', 10);
    const [loading, setLoading] = useState(false);
    let [subscriptionTier, setSubscriptionTier] = useState("Free")

    const [lovedTestimonials, setLovedTestimonials] = useState([]);

    useEffect(() => {

        async function getData() {
            setLoading(true);
            try {

                console.log(spaceId);

                const spaceOwner = await getSpaceOwner(spaceId as string);
                if (!spaceOwner) {
                    throw new Error('Space not found');
                }
                const tier = await getSubTier(spaceOwner);
                if (!tier) {
                    throw new Error('Subscription tier not found not found');
                }
                setSubscriptionTier(tier);
                const testimonials = await getLovedTestimonials(spaceId as string, limit);
                if (!testimonials) {
                    throw new Error('Loved Testimonials not found');
                }

                setLovedTestimonials(testimonials as any);
                console.log("Tier", tier);
                console.log(testimonials);
                console.log(spaceOwner)


            }
            catch (err) {
                throw err;
            }
            finally {
                setLoading(false);
            }


        }


        getData();

    }, [spaceId])






    return (
        <>
            {loading ? (
                <div className="w-full h-full flex items-center justify-center text-center p-4" style={{ backgroundColor: 'transparent' }}>
                    Loading testimonials...
                </div>
            ) : (
                <div className="w-full min-h-screen bg-red-400 px-8" style={{ backgroundColor: 'transparent' }}>
                    {layout === 'carousel' ? (
                        <TestimonialCarousel testimonials={lovedTestimonials} theme={theme} />
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {lovedTestimonials.map((testimonial, index) => (
                                <TestimonialCard
                                    key={index}
                                    location="embed"
                                    testimonial={testimonial}
                                    theme={theme}
                                />
                            ))}
                        </div>
                    )}
                    {subscriptionTier === 'Free' && (
                        <div className="w-full gap-4 text-black font-bold text-2xl flex justify-center py-4">
                            <Link
                                className="bg-stone-400 px-2 rounded-md"
                                href="#"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                {/* <Image src="/genuinely-logo.png" width={200} height={200} alt="Genuinely" /> */}
                            </Link>
                        </div>
                    )}
                </div>
            )}
        </>
    );
}

export default EmbedPage;