'use client'

import { useState } from 'react'
import { MaxWidthWrapper } from '@/components/ui/MaxWidthWrapper'
import { Switch } from '@/components/ui/switch'
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import { PricingCard } from './PricingCard'
import { Button } from '@/components/ui/button'
import { HelpCircle } from 'lucide-react'
import { motion } from 'framer-motion'

interface Feature {
    text: string
    included: boolean //is this feature included in the plan
    tooltip?: string
    commingSoon?: boolean
}

export interface PlanProps {
    title: string
    monthlyPrice?: number
    annualPrice?: number
    oneTimePrice?: number
    features: Feature[]
    buttonText: string
    isPro?: boolean
    monthlyPriceId?: string
    annualPriceId?: string
    oneTimePriceId?: string
}

export default function PricingSection() {
    const [isAnnual, setIsAnnual] = useState(false)
    const plans: PlanProps[] = [
        {
            title: "Free",
            monthlyPrice: 0,
            annualPrice: 0,
            features: [
                { text: "Collect up to 50 testimonials", included: true },
                { text: "1 Space", included: true, tooltip: "A space is a collection of testimonials for a specific product or service" },
                { text: "Public testimonial form", included: true },
                { text: "Love Gallery with our branding", included: true },
            ],
            buttonText: "Get Started",
        },
        {
            title: "Pro",
            monthlyPrice: 9,
            annualPrice: 90,
            features: [
                { text: "Collect unlimited testimonials", included: true },
                { text: "100 Spaces", included: true, tooltip: "A space is a collection of testimonials for a specific product or service" },
                { text: "Public testimonial form", included: true },
                { text: "Love Gallery without our branding", included: true },
            ],
            buttonText: 'Upgrade Now',
            isPro: true,
            monthlyPriceId: 'pro_01jnb6asd9bqtwsa8k6k0tg666',
            annualPriceId: 'pro_01jnbzp37pf7h78vydbkd4mdsf',
        },
        {
            title: "Lifetime",
            oneTimePrice: 199,
            features: [
                { text: "All Pro features", included: true },
                { text: "One-time payment", included: true },
                { text: "Lifetime access", included: true },
                { text: "Future updates included", included: true },
            ],
            buttonText: 'Get Lifetime Access',
            isPro: true,
            oneTimePriceId: 'pro_01jnb6j8fq2ys2byvr03bq2e3m',
        },
    ]

    return (
        <section id="pricing" className="py-20 hero-background">
            <MaxWidthWrapper>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="text-center mb-16"
                >
                    <div className="lg:text-center">
                        <h2 className="text-base text-primary font-semibold tracking-wide uppercase">Pricing</h2>

                        <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-white sm:text-4xl">
                            Simple, Transparent Pricing
                        </p>
                        <p className="mt-6 text-xl text-gray-400 max-w-2xl mx-auto">
                            Choose the plan that&apos;s right for you.
                        </p>
                        <br></br>

                    </div>
                </motion.div>


                <div className="flex justify-center items-center space-x-4 mb-12">
                    <span className={`text-sm ${!isAnnual ? 'text-gray-200' : 'text-gray-400'}`}>Monthly</span>
                    <Switch
                        checked={isAnnual}
                        onCheckedChange={setIsAnnual}
                    />
                    <span className={`text-sm ${isAnnual ? 'text-gray-200' : 'text-gray-400'}`}>Annually (2 months free)</span>
                </div>
                <br></br>
                <br></br>

                <div className="mb-16 grid gap-8 items-start grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                    {plans.map((plan, index) => (
                        <PricingCard key={index} {...plan} isAnnual={isAnnual} />
                    ))}
                </div>

                <div className="max-w-2xl mx-auto">
                    <h3 className="text-2xl font-bold text-center mb-6 text-gray-200">Frequently Asked Questions</h3>
                    <Accordion type="single" collapsible className="w-full">
                        <AccordionItem value="item-1">
                            <AccordionTrigger>Can I upgrade or downgrade my plan at any time?</AccordionTrigger>
                            <AccordionContent>
                                Yes, you can upgrade or downgrade your plan at any time. Please send an email to <span className='text-primary'> support@genuinely</span> and we will help you with that.
                            </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="item-2">
                            <AccordionTrigger>Is there a long-term contract?</AccordionTrigger>
                            <AccordionContent>
                                We offer monthly and annual plans, as well as a lifetime access option. If you need a custom plan, please send an email to <span className='text-primary'>support@genuinely</span>.
                            </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="item-3">
                            <AccordionTrigger>Do you offer a free trial?</AccordionTrigger>
                            <AccordionContent>
                                We don&apos;t offer a free trial, but you can start with our free plan and upgrade to Pro or Lifetime at any time.
                            </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="item-4">
                            <AccordionTrigger>What happens if my subscription expires?</AccordionTrigger>
                            <AccordionContent>
                                If your subscription expires, you will be downgraded to the free plan. You can upgrade to Pro at any time. You will not be able to add more testimonials or spaces until you upgrade. This doesn&apos;t apply to the Lifetime plan.
                            </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="item-5">
                            <AccordionTrigger>What&apos;s included in the Lifetime plan?</AccordionTrigger>
                            <AccordionContent>
                                The Lifetime plan includes all Pro features with a one-time payment. You&apos;ll have access to all current and future features without any recurring fees. It&apos;s perfect for those who want long-term access without worrying about monthly or annual payments.
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                </div>

                <div className="text-center mt-12">
                    <p className="text-gray-200 mb-4">Still have questions?</p>
                    <Button variant="outline">
                        <HelpCircle className="mr-2 inline h-4 w-4" />
                        <a href="mailto:support@genuinely.com" className="text-primary hover:underline">
                            Email Support
                        </a>
                    </Button>
                </div>
            </MaxWidthWrapper>
        </section>
    )
}
