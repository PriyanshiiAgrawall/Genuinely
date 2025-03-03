"use client"


import { useToast } from '@/hooks/use-toast';
import PaddleCheckout from '@/lib/payments/PaddleCheckout';

import { useSession } from 'next-auth/react';
import { redirect, useRouter } from 'next/navigation';
import { useEffect } from 'react';





export default function CheckoutPage() {
    const { data: session, status } = useSession();
    const { toast } = useToast();
    const router = useRouter();
    useEffect(() => {
        if (status === "loading") {
            toast({
                title: "loading",
                description: "We are checking if you are signed in payments are only possible when signed in"
            })
            return;
        }
        if (!session) {
            toast({
                title: "loading",
                description: "We are checking if you are signed in payments are only possible when signed in"
            })
            console.log("Redirection from checkout page")
            redirect('/sign-in');
        }
    }, [session, status])
    if (status === "loading") {

        return <p>loading</p>
    }
    const userId = session?.user?.id;
    const email = session?.user?.email;
    return (

        <PaddleCheckout userId={userId as string} email={email as string} />
    )
}