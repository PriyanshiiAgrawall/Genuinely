


import PaddleCheckout from '@/lib/payments/PaddleCheckout';
import { useSession } from 'next-auth/react';
import { redirect, useRouter } from 'next/navigation';
import { useEffect } from 'react';





export default async function CheckoutPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    useEffect(() => {
        if (status === "loading") {
            return;
        }
        if (!session) {
            redirect('/');

        }
    }, [session, status])

    const userId = session?.user?.id;
    const email = session?.user?.email;
    return (
        <PaddleCheckout userId={userId as string} email={email as string} />
    )
}