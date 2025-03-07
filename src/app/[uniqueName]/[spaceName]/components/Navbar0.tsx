'use client'
import React from "react";
import Link from "next/link";

import Image from "next/image";
import { Button } from "@/components/ui/button";

import { Gem } from "lucide-react";
import { MaxWidthWrapper } from "@/components/ui/MaxWidthWrapper";


export default function Navbar0() {


    return (
        <MaxWidthWrapper>
            <nav className="fixed bg-transparent backdrop-filter backdrop-blur-lg inset-x-0 top-0 z-50 w-full h-16  flex items-center justify-between px-4">
                <div className="flex  justify-center text-center gap-3">
                    <div className="flex justify-center gap-4 items-center h-16">
                        <div className="relative inline-flex items-center">
                            <Link href="/" className="flex-shrink-0">
                                <Image src="/genuinely-logo.png" className="ml-[-35px]" width={175} height={200} alt='genuinely' />
                            </Link>
                        </div>
                    </div>
                </div>

            </nav>
        </MaxWidthWrapper>

    );
}