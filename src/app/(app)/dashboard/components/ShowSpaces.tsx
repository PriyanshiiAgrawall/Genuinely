'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation';
import { ChevronRight, Folder, Loader2, Trash } from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { deleteSpace } from '@/app/actions/spaces';
import { AddSpace } from './AddSpace';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import axios from 'axios';
import useSWR, { mutate } from 'swr';
import { PlusCircledIcon } from '@radix-ui/react-icons';
import { useSession } from 'next-auth/react';

const fetcher = (url: string) => axios.get(url).then((res) => {
    return res.data;
});


export default function ShowSpaces() {
    const [spaces, setSpaces] = useState<any[]>([]);
    const [spaceCount, setSpaceCount] = useState(0);
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const { toast } = useToast();

    const { data: session, status, update } = useSession();

    const { data, isLoading, error, mutate } = useSWR('/api/space', fetcher);

    useEffect(() => {
        if (!session && status !== "loading") router.push("/sign-in");
    }, [session, status, router]);

    useEffect(() => {
        if (data?.spaces) {
            setSpaces(data.spaces);
            setSpaceCount(data.spaces.length)
        }
    }, [data])


    if (status === "loading") {
        return <p>Loading</p>
    }

    if (error) {
        return <div>Error loading spaces</div>;
    }

    const handleSpaceDelete = async (spaceId: string) => {
        try {
            setLoading(true);
            await deleteSpace(spaceId);
            mutate();
            setSpaces(spaces.filter(space => space._id !== spaceId));
            toast({
                title: 'Success',
                description: "Space deleted successfully"
            })
            setSpaceCount((prev) => prev - 1);
            await update();
        } catch (err) {
            toast({
                title: 'Error',
                description: "Failed to delete space. Please try again.",
                variant: "destructive"
            })
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    function addSpace(newSpace: any) {
        setSpaces((prev) => {
            return [...prev, newSpace];
        })
        setSpaceCount((prev) => prev + 1);
    }

    return (
        <div>
            {isLoading ? (
                <div className='flex items-center justify-center h-96'>
                    <div className=" mr-4 animate-spin flex size-8 border-[3px] border-current border-t-transparent text-blue-600 rounded-full dark:text-blue-500" role="status" aria-label="loading">
                    </div>
                    <span className='text-gray-500'> Loading spaces</span>
                </div>

            ) : (
                <>
                    {spaces.length === 0 ? (
                        <div className="flex flex-col items-center justify-center text-center mt-16">
                            <PlusCircledIcon className="w-24 h-24 text-muted-foreground mb-4" />
                            <h2 className="text-2xl font-bold mb-2">No spaces yet</h2>
                            <p className="text-muted-foreground mb-8 max-w-md">
                                Create your first space to start collecting testimonials.
                            </p>

                            <AddSpace addSpace={addSpace} subscriptionTier={session?.user?.subscriptionTier} />

                        </div>
                    ) : (
                        <div className="max-w-4xl mx-auto p-4">
                            <h2 className="text-3xl font-bold text-center">Your Spaces</h2>
                            <p className="text-muted-foreground text-center mb-8">
                                Create multiple spaces to collect testimonials for different use cases.
                            </p>
                            {spaces.length != 0 && <AddSpace addSpace={addSpace} subscriptionTier={session?.user?.subscriptionTier} />}
                            <div className="grid mt-10 grid-cols-1 md:grid-cols-2 gap-4">
                                {spaces.map((space) => (
                                    <Card key={space._id} className="relative bg-gray-300">
                                        <CardHeader className="pb-2">
                                            <div className="absolute right-4 top-4">
                                                <AlertDialog>
                                                    <AlertDialogTrigger asChild>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                                                        >
                                                            <Trash className="h-5 w-5" />
                                                        </Button>
                                                    </AlertDialogTrigger>
                                                    <AlertDialogContent>
                                                        <AlertDialogHeader>
                                                            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                                            <AlertDialogDescription>
                                                                This action cannot be undone. This will permanently delete your
                                                                space and remove all data related to this space.
                                                            </AlertDialogDescription>
                                                        </AlertDialogHeader>
                                                        <AlertDialogFooter>
                                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                            <AlertDialogAction
                                                                disabled={loading}
                                                                onClick={() => handleSpaceDelete(space._id)}
                                                                className="bg-destructive text-white hover:bg-destructive/90"
                                                            >
                                                                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                                                Continue
                                                            </AlertDialogAction>
                                                        </AlertDialogFooter>
                                                    </AlertDialogContent>
                                                </AlertDialog>
                                            </div>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="flex items-center gap-2">
                                                <Folder className="h-6 w-6 text-primary" />
                                                <h3 className="text-xl font-semibold">{space.name}</h3>
                                            </div>
                                            <p className="mt-2 text-sm text-muted-foreground">
                                                {space.testimonials.length} testimonials
                                            </p>
                                        </CardContent>
                                        <CardFooter className="p-0">
                                            <Link
                                                href={`/dashboard/spaces/${session?.user?.name}/${space.name}/${space._id}`}
                                                className="flex w-full items-center justify-between px-6 py-3 text-sm text-muted-foreground transition-colors hover:bg-gray-400 rounded-md"
                                            >
                                                View details
                                                <ChevronRight className="h-4 w-4" />
                                            </Link>
                                        </CardFooter>
                                    </Card>
                                ))}
                            </div>
                        </div>
                    )
                    }
                </>
            )
            }
        </div >
    );

}