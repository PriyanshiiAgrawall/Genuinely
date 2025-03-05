'use client'

import React, { useCallback, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation';
import { Gem } from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"

import { z } from 'zod';
import { useToast } from '@/hooks/use-toast';
import { useSession } from 'next-auth/react';
import { canCreateSpace } from '@/lib/featureAccess';
import { getTotalSpaces } from '@/app/actions/spaces';
import axios from 'axios';
import { useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from "@/components/ui/label"
import { generateUniqueLink } from '@/lib/generateUniqueLink';
import { Input } from '@/components/ui/input';
// Regular expression to allow only alphabets,numbers and hyphen, no underscores, no numbers
const validNameRegex = /^[a-zA-Z-]+$/;

const createSpaceSchema = z.object({
    name: z
        .string()
        .max(50, 'Name must be less than 50 characters')
        .min(3, 'Name must be at least 3 characters')
        .regex(validNameRegex, 'Name can only contain letters and hyphens, no numbers or special characters')
        .refine((name) => {
            const nameLowerCase = name.toLowerCase();
            return !reservedKeywords.includes(nameLowerCase);
        }, {
            message: 'This name is reserved and cannot be used.',
        })
});

const reservedKeywords = [
    'admin', 'genuinely', 'genuine', 'dashboard', 'profile', 'settings', 'sign-in', 'signup', 'api', 'space', 'spaces', 'user', 'users',
    'system', 'help', 'support', 'about', 'terms', 'privacy', 'home', 'localhost', 'test', 'signin', 'feedback', 'testimonial', 'testimonials', 'pricing'
];
//props destructuring
export function AddSpace({ addSpace, subscriptionTier }: { subscriptionTier: any, addSpace: (newSpace: any) => void }) {
    const [name, setName] = useState('');
    const [errors, setErrors] = useState<any>({});
    const [loading, setLoading] = useState(false);
    const [spaceCount, setSpaceCount] = useState(0);
    const { data: session, status } = useSession();
    const router = useRouter();

    const { toast } = useToast();
    const can = useMemo(() => canCreateSpace(subscriptionTier, spaceCount), [subscriptionTier, spaceCount]);


    useEffect(() => {
        if (status === "loading") return;
        if (!session) return router.push("/sign-in");
        getTotalSpaces().then(setSpaceCount).catch(() => toast({
            title: "Error",
            description: "Failed to fetch the total space count.",
            variant: "destructive",
        })
        )
    }, [session, status, router]);

    const userName = session?.user.name;

    const handleCreateSpace = useCallback(async (name: string) => {
        try {
            setLoading(true);
            createSpaceSchema.parse({ name });
            name.toLowerCase();
            console.log(name)

            const { data } = await axios.post('/api/space', { name });
            addSpace(data.space);
            router.push(`/dashboard/spaces/${userName}/${name}/${data.space._id}`);
        } catch (error) {
            if (error instanceof z.ZodError) {
                setErrors(error.format());
            }
            else if (axios.isAxiosError(error)) {
                toast({
                    title: "Error",
                    description: error.response?.data?.message || "An unexpected error occurred",
                    variant: "destructive",
                })
            }
        } finally {
            setLoading(false);
        }
    }, [addSpace, router, userName]);

    return (
        <div>
            <Dialog>
                <DialogTrigger asChild>
                    <Button disabled={!can}>
                        Create New Space
                        {(session?.user?.subscriptionTier === "Free" || spaceCount >= 1) && <Gem className="ml-2 h-4 w-4" />}
                    </Button>

                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px] max-w-xs">
                    <DialogHeader>
                        <DialogTitle>Create Space</DialogTitle>
                        <DialogDescription>
                            <span className="text-blue-500">
                                {generateUniqueLink(name, userName as string)}
                            </span>
                        </DialogDescription>
                    </DialogHeader>
                    <div>
                        <Label htmlFor="name" className="text-right">
                            Space Name
                        </Label>

                        <Input
                            id="name"
                            placeholder="eg. my-new-space"
                            className="col-span-3"
                            value={name}
                            disabled={loading || !can}
                            onChange={(e) => setName(e.target.value.replace(/\s+/g, '-'))}
                        />
                        {errors?.name && (
                            <span className="text-red-500 text-sm mt-1">{errors.name._errors[0]}</span>
                        )}
                    </div>
                    <DialogFooter>
                        <Button
                            onClick={() => handleCreateSpace(name.replace(/\s+/g, '-'))}
                            disabled={!can || loading}
                        >
                            Create New Space
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
