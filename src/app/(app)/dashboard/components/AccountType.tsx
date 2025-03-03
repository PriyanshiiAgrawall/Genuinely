"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User } from "lucide-react";
import { useEffect } from "react";


export default function AccountType() {
    const { data: session, status } = useSession();
    const router = useRouter();

    useEffect(() => {
        if (status === "loading") return;
        if (!session) router.push("/sign-in");
    }, [session, status, router]);

    if (status === "loading") return <p>Loading...</p>;
    const accountType = session?.user?.subscriptionTier;

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Account Type</CardTitle>
                <User className="h-4 w-4" />
            </CardHeader>
            <CardContent>
                <div className="text-4xl font-bold">{accountType}</div>
            </CardContent>
        </Card>
    );
}
