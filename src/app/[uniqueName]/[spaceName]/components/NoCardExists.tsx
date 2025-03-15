import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { MaxWidthWrapper } from '@/components/ui/MaxWidthWrapper';
import Navbar0 from './Navbar0';

export default function NoCardExists({ uniqueName, spaceName }: { uniqueName: string, spaceName: string }) {
    return (
        <div className='bg-gradient-to-r from-blue-500 to-purple-500 w-full min-h-screen min-w-screen overflow-hidden'>
            <div className="">
                <Navbar0 />
            </div>
            {/* Header */}


            {/* Main Content */}
            <div className="min-h-screen flex items-center justify-center px-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1 }}
                    className="bg-white bg-opacity-80 rounded-3xl shadow-2xl p-8 max-w-lg w-full text-center"
                >
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.3, type: 'spring', stiffness: 120 }}
                    >
                        <svg
                            className="w-28 h-28 mx-auto text-red-500"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >

                            <circle cx="12" cy="12" r="9" strokeWidth="2" stroke="currentColor" fill="none" />
                            <line x1="12" y1="8" x2="12" y2="14" strokeWidth="2" stroke="currentColor" />
                            <circle cx="12" cy="17" r="1.2" fill="currentColor" />
                        </svg>
                    </motion.div>

                    <motion.h1
                        className="text-4xl font-bold mt-8 mb-4 text-gray-900"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                    >
                        Ask owner of {spaceName} space to submit testimonial form for this link to work
                    </motion.h1>

                    <motion.p
                        className="text-gray-700 mb-10 leading-relaxed tracking-tight"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.7 }}
                    >
                        The owner of <span className="font-bold">{spaceName}</span> needs to submit a testimonial form first.
                        <br /> If you believe this is an error, please contact them or email us at
                        <a href="mailto:support@genuinely.com" className="text-blue-600 underline"> support@genuinely.com</a>.
                    </motion.p>

                    <motion.button
                        className="rounded-3xl bg-gradient-to-r from-gray-400 to-gray-500 text-white font-semibold py-2 px-6 cursor-not-allowed opacity-75"
                        whileHover={{ scale: 1 }}
                    >
                        Testimonials Not Available
                    </motion.button>
                </motion.div>
            </div>
        </div>
    );
}
