
"use client";
import TotalTestimonials from './components/TotalTestimonials'
import TotalSpaces from './components/TotalSpaces';
import AccountType from './components/AccountType';
import Navbar from './components/Navbar';
import TotalLoveBooks from './components/ActiveLoveBooks';
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton';
import { Suspense, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';


// import { ShowSpaces } from './spaces/components/ShowSpaces';


export default function DashboardPage() {

    const { data: session, status } = useSession();
    const router = useRouter();

    useEffect(() => {
        if (status === "loading") return;
        if (!session) router.push("/login");
    }, [session, status, router]);

    if (status === "loading") return <p>Loading...</p>;

    return (
        <div className='flex flex-col space-y-8'>
            <div className="grid gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
                <Suspense fallback={<CardSkeleton />}>
                    <TotalTestimonials />
                </Suspense>

                <Suspense fallback={<CardSkeleton />}>
                    <TotalSpaces />
                </Suspense>

                <Suspense fallback={<CardSkeleton />}>
                    <TotalLoveBooks />
                </Suspense>

                <Suspense fallback={<CardSkeleton />}>
                    <AccountType />
                </Suspense>
            </div>
            {/* <div className='flex-1'>
                <ShowSpaces subscriptionTier={accountType} />
            </div> */}
        </div>


    )
}

function CardSkeleton() {
    return (
        <Card>
            <CardHeader>
                <Skeleton className="h-8 w-[250px]" />
            </CardHeader>
            <CardContent>
                <Skeleton className="h-18 w-full" />
            </CardContent>
        </Card>
    )
}
