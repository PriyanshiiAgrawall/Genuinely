'use client';
import { useState } from 'react';
import { Loader2, Trash } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { signOut, useSession } from 'next-auth/react';

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Card } from '@/components/ui/card';
import { deleteUser } from '@/app/actions/account';

export default function DeleteAccount() {
    const { data: session } = useSession();
    const [loading, setLoading] = useState(false);

    const handleDeleteAccount = async () => {
        setLoading(true);
        await deleteUser(session?.user?.id as string);
        await signOut()
        setLoading(false);
    };

    return (
        <Card className="mb-12 p-4">
            <h2 className="text-lg font-semibold mb-4 flex items-center">
                <Trash className="mr-3 text-red-600" /> Danger Zone
            </h2>
            <div className="space-y-4">

                <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <Button variant="destructive">Delete Account</Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                                This action cannot be undone. This will permanently delete your
                                account and remove your data from our servers.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={handleDeleteAccount}>Continue</AlertDialogAction>
                            {loading ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : null}
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>

            </div>
        </Card>
    );
}