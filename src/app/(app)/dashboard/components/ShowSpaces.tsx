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


export default function ShowSpaces() {
    const [spaces, setSpaces] = useState([]);
    const router = useRouter;
    const [loading, setLoading] = useState(false);
    const toast = useToast();


    useEffect(() => {
        function settingSpaces(newSpace) {
            setSpaces((prevSpaces) => {
                return [...prevSpaces, newSpace];
            })
        }
        settingSpaces;
    }, [spaces])

}