'use client'

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Loader2, User, CreditCard } from "lucide-react"
import { useSession } from "next-auth/react"
import React, { useState, useEffect } from 'react'
import { updateName } from "@/app/actions/account"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"

import { redirect } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { useDebounceCallback } from "usehooks-ts"
import axios, { AxiosError } from "axios"
import { ApiResponse } from "@/types/ApiResponse"

export enum SubscriptionTier {
    FREE = 'Free',
    PRO = 'Pro',
    LIFETIME = 'Lifetime'
}

interface SubscriptionData {
    tier: SubscriptionTier
    endDate: string | null
}

export default function ProfileSettings() {
    const { data: session, status } = useSession()
    const [uniqueName, setUniqueName] = useState(session?.user?.name);

    const [email, setEmail] = useState(session?.user?.email)
    const [isEditing, setIsEditing] = useState(false)
    const [loading, setLoading] = useState(false)
    const [subscription, setSubscription] = useState<SubscriptionData | null>(null)
    const { toast } = useToast();
    //the message which will apear just below unique name field
    const [uniqueNameMessage, setUniqueNameMessage] = useState('');
    const [uniqueNameCheckingLoader, setUniqueNameCheckingLoader] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const debounced = useDebounceCallback(setUniqueName, 300);

    useEffect(() => {
        async function checkingUniqueNameAvailabilityFromBackend() {
            if (uniqueName) {
                setUniqueNameCheckingLoader(true);
                setUniqueNameMessage("");
                try {
                    const response = await axios.get(`/api/unique-name-check?name=${uniqueName}`);
                    console.log(response);
                    setUniqueNameMessage(response.data.message);
                }
                catch (err) {
                    const axiosError = err as AxiosError<ApiResponse>;
                    setUniqueNameMessage(axiosError.response?.data.message ?? "Error checking unique name");

                } finally {
                    setUniqueNameCheckingLoader(false);
                }
            }

        }
        checkingUniqueNameAvailabilityFromBackend();

    }, [uniqueName]);

    useEffect(() => {
        const getUserData = async () => {
            if (!session) return

            try {
                const data = await fetch('/api/user').then((res) => res.json())
                if (session?.user?.id !== data.user._id) return;
                console.log(data);
                setUniqueName(data.user.name)
                setEmail(data?.user?.email)
                setSubscription({
                    tier: data.user.subscriptionTier,
                    endDate: data.user.subscriptionEndDate
                })

            } catch (error) {
                console.error(error)
            }
        }

        getUserData()
    }, [session])

    const handleSaveName = async () => {
        setLoading(true)
        const updateSuccessful = await updateName(session?.user?.id as string, uniqueName as string)
        if (updateSuccessful) {

            toast({
                title: "Name Updation Successful",
            })
        } else {
            setUniqueName(session?.user.name);
            toast({
                title: "Name Updation Unsuccessful",
                description: "Make sure you follow the instructions to give yourself a new name",
                variant: "destructive"
            })
        }
        setIsEditing(false)
        setLoading(false)
    }
    const invalidDate = new Date(0);
    const getRemainingDays = () => {
        if (!subscription?.endDate) return null
        const endDate = new Date(subscription.endDate)
        if (endDate === null || endDate.getTime() === invalidDate.getTime()) {
            return null;
        }
        const now = new Date();
        const diffTime = endDate.getTime() - now.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays > 0 ? diffDays : 0
    }

    return (
        <Card className="mb-12 p-4">
            <h2 className="text-lg font-semibold mb-4 flex items-center">
                <User className="mr-3 text-blue-600" /> Profile Settings
            </h2>
            <div className="space-y-4">
                <div className="flex flex-col space-y-2">
                    <Label>Unique Name</Label>
                    <Input
                        disabled={!isEditing || loading}
                        type="text"
                        className="mt-1"
                        value={uniqueName ?? ''}
                        onChange={(e: any) => {
                            debounced(e.target.value);
                        }}
                    />
                    <p> {uniqueNameCheckingLoader && <Loader2 className="animate-spin text-[#000421]" />}
                        {uniqueName && isEditing && session?.user.name !== uniqueName && <span className={`text-sm ${uniqueNameMessage === "This unique name is available" ? 'text-[#000421]' : 'text-red-500'}`}>{uniqueNameMessage}</span>}</p>

                    <div className="flex space-x-2">
                        <Button
                            variant="outline"
                            onClick={() => setIsEditing((prev) => !prev)}
                            disabled={loading}
                        >
                            {isEditing ? 'Cancel' : 'Edit'}
                        </Button>
                        {isEditing && (
                            <Button onClick={handleSaveName} disabled={loading}>
                                {loading ? (
                                    <Loader2 className="animate-spin mr-2" size={16} />
                                ) : (
                                    'Save'
                                )}
                            </Button>
                        )}
                    </div>
                </div>
                <div className="flex flex-col space-y-2">
                    <Label>Email</Label>
                    <Input
                        type="email"
                        className="mt-1"
                        value={email ?? ''}
                        disabled
                    />
                    {email === null && email == "" && <p>If you don't see your email you might have logged in by Github</p>}
                </div>
                <div className="flex flex-col space-y-2">
                    <Label>Subscription</Label>
                    <div className="flex items-center space-x-2">
                        <CreditCard className="text-blue-600" />
                        <span className="font-medium">{session?.user.subscriptionTier}</span>
                        {session?.user.subscriptionTier !== "Free" && getRemainingDays() !== null && (
                            <span className="text-sm text-gray-500">
                                ({getRemainingDays()} days remaining)
                            </span>
                        )}
                    </div>
                    {session?.user.subscriptionTier === "Free" && (
                        <div className="flex space-x-2 mt-2">
                            <Button onClick={() => redirect('/#pricing')} disabled={loading}>
                                Upgrade to Pro
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </Card>
    )
}