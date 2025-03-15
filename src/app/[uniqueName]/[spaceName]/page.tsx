'use client'

import { findTestimonialCard } from "@/app/actions/testimonials";
import { TestimonialSubmitForm } from "./components/TestimonialSubmitForm";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { NotAccepting } from "./components/NotAccepting";
import { isAccepting } from "@/app/actions/account";
import NoCardExists from "./components/NoCardExists";


export function SubmissionPage() {
    const pathname = usePathname();
    const parts = pathname.split("/").filter(Boolean);
    const uniqueName = parts[0];
    const spaceName = parts[1];
    const [isAcceptingTestimonials, setIsAcceptingTestimonials] = useState(true);
    // State should hold a single object, not an array
    const [testimonialCard, setTestimonialCard] = useState<any>(null);

    useEffect(() => {
        async function dataFetching() {
            try {
                const testimonialCard = await findTestimonialCard(uniqueName, spaceName);
                setTestimonialCard(testimonialCard);
            } catch (error) {
                console.error("Error fetching testimonial card:", error);
            }
        }

        if (uniqueName && spaceName) {
            dataFetching();
        }
    }, [uniqueName, spaceName]);

    useEffect(() => {
        async function dataFetching() {
            try {
                const accepting = await isAccepting(uniqueName, spaceName);
                setIsAcceptingTestimonials(accepting);

            } catch (error) {
                console.error("Error fetching accepting status", error);
            }
        }

        if (uniqueName && spaceName) {
            dataFetching();
        }
    }, [uniqueName, spaceName]);

    // Handle loading state
    if (!testimonialCard) {
        return <NoCardExists uniqueName={uniqueName} spaceName={spaceName} />;
    }

    // Convert _id & spaceId to string if they exist
    const testimonialCardDataObj = {
        ...testimonialCard,
        _id: testimonialCard._id?.toString(),
        spaceId: testimonialCard.spaceId?.toString()
    };

    return (isAcceptingTestimonials ? (
        <div className="">
            <TestimonialSubmitForm testimonialCardData={testimonialCardDataObj} />



        </div>



    ) : <NotAccepting uniqueName={uniqueName} spaceName={spaceName} testimonialCardData={testimonialCardDataObj} />)
}

export default SubmissionPage;
