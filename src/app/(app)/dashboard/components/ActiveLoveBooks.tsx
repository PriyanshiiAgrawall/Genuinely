"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookHeart } from "lucide-react";
import { getTotalLoveBooks } from "@/app/actions/loveBooks";

export default function TotalLoveBooks() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [loveBooks, setLoveBooks] = useState<number>(0);

    useEffect(() => {
        if (status === "loading") return;
        if (!session) router.push("/login");

        const fetchData = async () => {
            const total = await getTotalLoveBooks();
            setLoveBooks(total);
        };
        if (session) fetchData();
    }, [session, status, router]);

    if (status === "loading") return <p>Loading...</p>;

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Your Love Books</CardTitle>
                <BookHeart className="h-4 w-4" />
            </CardHeader>
            <CardContent>
                <div className="text-4xl font-bold">{loveBooks}</div>
            </CardContent>
        </Card>
    );
}
