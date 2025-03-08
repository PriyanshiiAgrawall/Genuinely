"use client";
import React from 'react';
import ProfileSettings from './components/ProfileSettings';
import DeleteAccount from './components/DeleteAccount';
import { redirect } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { MoveLeft } from 'lucide-react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { MaxWidthWrapper } from '@/components/ui/MaxWidthWrapper';
import AddAccount from './components/AddAccounts';
import Navbar from '../components/Navbar';


export default function SettingsPage() {

    const { data: session, status } = useSession();
    if (!session) {
        redirect('/sign-in');
    }
    return (
        <MaxWidthWrapper>
            <div className='mb-20'> <Navbar /></div>

            {/* <Button variant='link' className='text-blue-500'>
                <Link href="/dashboard">
                    <MoveLeft className="h-6 w-6 inline" /> Dashboard
                </Link>
            </Button> */}
            <ProfileSettings />
            <AddAccount />
            <DeleteAccount />
        </MaxWidthWrapper>
    );
};

