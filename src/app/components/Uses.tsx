'use client'

import { motion } from 'framer-motion';

import { Card } from "@/components/ui/card";
import { FaStore, FaBriefcase, FaGraduationCap, FaHotel, FaLaptopCode, FaUserMd } from "react-icons/fa";
import Link from 'next/link';
import { MaxWidthWrapper } from '@/components/ui/MaxWidthWrapper';

const uses = [
    {
        name: 'E-commerce',
        description: 'Boost sales with authentic product reviews. Showcase customer experiences to highlight quality and satisfaction.',
        icon: FaStore,
    },
    {
        name: 'FeedBack Forms',
        description: 'Take reviews from teammates, colleagues, friends, boss etc on your projects',
        icon: FaBriefcase,
    },
    {
        name: 'Education',
        description: 'Attract more enrollments by featuring student and parent testimonials in coaching, course selling etc with hassle free collection',
        icon: FaGraduationCap,
    },
    {
        name: 'Hospitality',
        description: 'Encourage more bookings by displaying guest reviews. Highlight your excellent service and amenities.',
        icon: FaHotel,
    },
    {
        name: 'SaaS',
        description: 'Drive user usage and reliability by showcasing testimonials. Ex- Shocasing your Food delivery, Grocery delivery, MedTech services etc',
        icon: FaLaptopCode,
    },
    {
        name: 'Healthcare',
        description: 'Build trust in your services by sharing patient testimonials. Emphasize quality care and positive outcomes.',
        icon: FaUserMd,
    }
];

const Uses = () => {
    return (
        <section id="use-cases" className="py-20 relative bg-gray-900">
            <MaxWidthWrapper>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="text-center mb-16"
                >
                    <div className="lg:text-center">
                        <h2 className="text-base text-primary font-semibold tracking-wide uppercase text-[#dbb04c]">For you</h2>

                        <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-white sm:text-4xl">
                            Genuinely Use Cases
                        </p>
                        <p className="mt-6 text-xl text-gray-400 max-w-2xl mx-auto">
                            Transform
                            customer feedback into powerful social proof, tailored for your specific industry needs.
                        </p>
                    </div>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {uses.map((useCase, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1, duration: 0.8 }}
                        >
                            <Card className="group overflow-hidden rounded-lg shadow-lg hover:shadow-2xl transition-all duration-300 bg-gray-800 border-gray-700">
                                <div className="p-6">
                                    <div className="flex items-center mb-4">
                                        <div className="bg-[#C3A456] rounded-full p-3 mr-4">
                                            <useCase.icon className="text-2xl text-white" />
                                        </div>
                                        <h3 className="text-2xl font-semibold text-gray-200">{useCase.name}</h3>
                                    </div>
                                    <p className="text-gray-400">
                                        {useCase.description}
                                    </p>
                                </div>
                            </Card>
                        </motion.div>
                    ))}
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8, duration: 0.8 }}
                    className="mt-16 text-center"
                ><Link
                    href="/sign-in"
                    className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-gray-900 bg-[#dbb04c] hover:bg-yellow-400 md:py-4 md:text-lg md:px-10 transition-colors duration-300"
                >
                        Start Today
                    </Link>
                </motion.div>
            </MaxWidthWrapper>
        </section>
    );
};

export default Uses;
