"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Box } from "lucide-react";
import { getTotalSpaces } from "@/app/actions/spaces";


export default function TotalSpaces() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [totalSpaces, setTotalSpaces] = useState<number>(0);

    useEffect(() => {
        if (status === "loading") return;
        if (!session) router.push("/login");

        const fetchData = async () => {
            const total = await getTotalSpaces();
            setTotalSpaces(total);
        };
        if (session) {
            fetchData();
        }
    }, [session, status, router]);

    if (status === "loading") return <p>Loading...</p>;

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Spaces</CardTitle>
                <Box className="h-4 w-4" />
            </CardHeader>
            <CardContent>
                <div className="text-4xl font-bold">{totalSpaces}</div>
            </CardContent>
        </Card>
    );
}
