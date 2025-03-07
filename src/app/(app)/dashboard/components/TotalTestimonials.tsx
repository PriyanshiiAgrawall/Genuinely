"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquareHeart } from "lucide-react";
import { getTotalTestimonials } from "@/app/actions/testimonials";

export default function TotalTestimonials() {
    const { data: session, status } = useSession();

    const router = useRouter();
    const [totalTestimonials, setTotalTestimonials] = useState<number>(0);

    useEffect(() => {
        if (status === "loading") return;
        if (!session) router.push("/sign-in");

        const fetchData = async () => {
            const total = await getTotalTestimonials();
            setTotalTestimonials(total);
        };
        if (session) fetchData();
    }, [session, status, router]);

    if (status === "loading") return <p>Loading...</p>;

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Testimonials Received</CardTitle>
                <MessageSquareHeart className="h-4 w-4" />
            </CardHeader>
            <CardContent>
                <div className="text-4xl font-bold">{totalTestimonials}</div>
            </CardContent>
        </Card>
    );
}
