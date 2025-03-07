'use client'
import { motion } from 'framer-motion'
import { ExternalLink } from 'lucide-react'
import { signIn } from 'next-auth/react'
import Link from 'next/link'


import React from 'react'

export default function Header() {
    return (
        <section className="relative overflow-hidden pt-52 pb-16 sm:pb-24 hero-background">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="text-center"
                >
                    <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight mb-6">
                        <span className="gradient-text">Turn
                            <span > Customer Feedback</span></span>
                        <br />
                        Into
                        <span className='text-[#dbb04c]'> Genuine Social Proof </span>With Genuinely
                    </h1>
                    <p className="mt-3 max-w-md mx-auto text-base text-gray-300 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
                        Effortlessly gather, highlight, and display genuine client testimonials to build trust and drive more conversions.
                    </p>
                    <div className="mt-10 max-w-md mx-auto sm:flex sm:justify-center md:mt-12">
                        <div className="rounded-md shadow">
                            <Link
                                href="/sign-in"
                                className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md 
                                hover:bg-primary/90 md:py-4 md:text-lg md:px-10 bg-[#dbb04c]
                             
                                hover:bg-yellow-500"

                            >
                                Get Started
                            </Link>
                        </div>
                        <div className="mt-3 rounded-md shadow sm:mt-0 sm:ml-3">
                            <Link
                                href="#"
                                onClick={async (e) => {
                                    e.preventDefault();
                                    await signIn("credentials", {
                                        email: "priyanshi666",
                                        password: "12345678",
                                        redirect: true,
                                        callbackUrl: "/dashboard",
                                    });
                                }}
                                className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-gray-900 bg-white hover:bg-gray-50 md:py-4 md:text-lg md:px-10"

                            >

                                Dummy Login Tour
                                <ExternalLink className="w-5 h-5 ml-2" />
                            </Link>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    )
}
