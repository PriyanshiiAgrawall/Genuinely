'use client'
import React from "react";
import Link from "next/link";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { signOut, useSession } from "next-auth/react";
import { Gem } from "lucide-react";
import { MaxWidthWrapper } from "@/components/ui/MaxWidthWrapper";


export default function Navbar1() {


    return (
        <MaxWidthWrapper>
            <nav className="fixed border-b border-gray-200 bg-gray-900 backdrop-filter backdrop-blur-lg inset-x-0 top-0 z-50 w-full h-16  flex items-center justify-between px-4">
                <div className="flex  justify-center text-center gap-3">
                    <div className="flex justify-center gap-4 items-center h-16">
                        <div className="relative inline-flex items-center">
                            <Link href="/" className="flex-shrink-0">
                                <Image src="/genuinely-logo.png" className="ml-[-35px]" width={175} height={200} alt='genuinely' />
                            </Link>
                        </div>
                    </div>
                </div>
                <div>
                    <div className="flex gap-4">
                        {(
                            <Link href="/#pricing" className=" md:flex">
                                <Button className="bg-[#dbb04c] hover:bg-yellow-500">
                                    Upgrade to Pro
                                    <Gem className="ml-1" size={18} />
                                </Button>
                            </Link>
                        )}

                        <Link href="/sign-up" target="_blank" className=" md:flex">
                            <Button>
                                SignUp
                            </Button>
                        </Link>
                        <Link href="/sign-in" target="_blank" className=" md:flex">
                            <Button>
                                SignIn
                            </Button>
                        </Link>




                    </div>
                </div>
            </nav>
        </MaxWidthWrapper>

    );
}