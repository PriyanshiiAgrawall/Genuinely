import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { MaxWidthWrapper } from '@/components/ui/MaxWidthWrapper';

export function NotAccepting({ uniqueName, spaceName, testimonialCardData }: { uniqueName: string, spaceName: string, testimonialCardData: any }) {

    return (
        <MaxWidthWrapper className="bg-gradient-to-r from-blue-500 to-purple-500 min-h-screen flex flex-col">
            {/* Header */}
            <div className="fixed top-0 left-0 w-full p-6 z-10">
                <div className="relative inline-flex items-center">
                    <Link href="/" className="flex-shrink-0">
                        <Image src="/genuinely-logo.png" width={200} height={200} alt="Genuinely" />
                    </Link>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex flex-grow items-center justify-center px-4">
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
                            className="w-28 h-28 mx-auto text-green-500"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </motion.div>

                    <motion.h1
                        className="text-4xl font-bold mt-8 mb-4 text-gray-900"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                    >
                        Sorry, this project is not accepting feedbacks right now
                    </motion.h1>

                    <motion.p
                        className="text-gray-700 mb-10 leading-relaxed tracking-tight"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.7 }}
                    >
                        We appreciate your patience. <br /> If this is a mistake, please contact the project head or email
                        at <a href="mailto:support@genuinely.com" className="text-blue-600 underline">support@genuinely.com</a>.
                    </motion.p>

                    <motion.button
                        className="rounded-3xl bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold py-2 px-6 hover:shadow-lg transition duration-300 ease-in-out transform outline-dashed"
                        whileHover={{ scale: 1.08 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => window.open(testimonialCardData.projectUrl, '_blank')}
                    >
                        Visit {testimonialCardData.projectTitle}
                    </motion.button>
                </motion.div>
            </div>
        </MaxWidthWrapper>
    );
}
