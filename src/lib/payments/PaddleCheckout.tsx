import { redirect, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import { initializePaddle, Paddle, Environments } from '@paddle/paddle-js';
import axios from "axios";
import { useSession } from "next-auth/react";
import { useToast } from "@/hooks/use-toast";
export interface CheckoutProps {

    userId: string;
    email: string;

}


export default function PaddleCheckout({ userId, email }: CheckoutProps) {
    const router = useRouter();
    const { toast } = useToast();
    const searchParams = useSearchParams();
    const [paddle, setPaddle] = useState<Paddle>();
    const [loading, setLoading] = useState(false);
    const { data: session, status } = useSession();
    useEffect(() => {
        if (!session) {
            router.push("/sign-in");
        }

    }, [session, status])
    async function updateDb(eventData: any) {
        try {
            const response = await axios.post("/api/update-subscription", {
                userId: userId,
                eventData: eventData,
            });
            if (!response.data) {
                throw new Error('Failed to update database');
            }
            const result = response.data;

        } catch (error) {
            console.error('Error updating database:', error);
            throw error;
        }
    }

    useEffect(() => {
        if (!session?.user) return; // Only initialize Paddle if user exists

        // Check if user already has a lifetime plan
        if (session.user.subscriptionTier === "Lifetime") {
            alert("You already have a Lifetime plan. No further purchases required!");
            router.push("/");
            return;
        }

        initializePaddle({
            environment: "sandbox",
            token: process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN!, eventCallback(event) {
                switch (event.name) {
                    case 'checkout.completed':
                        {
                            updateDb(event.data)
                            toast({
                                title: "Subscription Successful",
                                description: "You might need to sign-in again to see the reflected changes"
                            })
                        }
                        break;
                    case 'checkout.closed':
                        router.push('/');
                        break;
                    case 'checkout.loaded':
                        break;
                    case 'checkout.error':
                        console.error('Checkout error:', event.data);
                        break;
                }
            },
        }).then((paddleInstance) => {
            if (paddleInstance) {
                setPaddle(paddleInstance);
            }
        });
    }, [session]);


    useEffect(() => {
        const transactionId = searchParams.get('_ptxn');
        const priceId = searchParams.get('priceId');

        if (paddle?.Checkout) {
            if (transactionId) {
                paddle.Checkout.open({
                    settings: {
                        allowLogout: true,
                    },
                    transactionId,

                });
            } else if (priceId) {
                paddle.Checkout.open({
                    settings: {
                        allowLogout: false,
                    },
                    items: [{ priceId, quantity: 1 }],
                    customer: {
                        email: email,
                    },
                    customData: {
                        userId: userId,
                    },
                });
            } else {
                router.push('/');
            }
        }

    }, [paddle?.Checkout, searchParams])

    return <div id="paddle-checkout"></div>;
}
