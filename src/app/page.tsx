'use client'
import { motion } from 'framer-motion'
import { ExternalLink } from 'lucide-react'
import { useState } from 'react'
import { MaxWidthWrapper } from '@/components/ui/MaxWidthWrapper'
import { Switch } from '@/components/ui/switch'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Pencil, Share2, Inbox, BarChart } from 'lucide-react'
import { PricingCard } from '@/lib/payments/PricingCard'
import { Button } from '@/components/ui/button'
import { HelpCircle } from 'lucide-react'
import Link from 'next/link'

import Navbar1 from './components/Navbar1'
import { FaGithub } from "react-icons/fa";
import Header from './components/Header'
import Steps from './components/Steps'
import Uses from './components/Uses'

interface Feature {
  text: string
  included: boolean
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
      monthlyPriceId: 'pri_01jnb6g6z80fh4jkgnr4vgnkhs',
      annualPriceId: 'pri_01jnbzs38ez7bm2pkahjg6gvf5',
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
      oneTimePriceId: 'pri_01jnb6mnt2cmgv1z8fmtkta1rn',
    },
  ]

  return (

    <div className='bg-[#272E3F]'>
      <Navbar1 />
      <br></br>
      <Header />
      <Steps />
      <Uses />
      <section id="pricing" className="py-20 hero-background">
        <MaxWidthWrapper>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h2 className="text-base text-primary font-semibold tracking-wide uppercase text-[#dbb04c]">Pricing</h2>
            <p className="mt-2 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
              Simple, Transparent Pricing
            </p>
            <p className="mt-4 text-xl text-gray-400 max-w-2xl mx-auto">
              Choose the plan that's right for you.
            </p>
          </motion.div>

          {/* Toggle Switch */}
          <div className="flex justify-center items-center space-x-4 mb-8">
            <span className={`text-sm ${!isAnnual ? 'text-gray-200' : 'text-gray-400'}`}>Monthly</span>
            <Switch checked={isAnnual} onCheckedChange={setIsAnnual} className="data-[state=checked]:bg-[#dbb04c] data-[state=unchecked]:bg-gray-500" />
            <span className={`text-sm ${isAnnual ? 'text-gray-200' : 'text-gray-400'}`}>Annually (2 months free)</span>
          </div>

          {/* Pricing Cards */}
          <div className="mb-16 grid gap-8 items-start grid-cols-1 md:grid-cols-3">
            {plans.map((plan, index) => (
              <PricingCard key={index} {...plan} isAnnual={isAnnual} />
            ))}
          </div>

          {/* FAQs Section */}
          <div className="max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-center mb-6 text-gray-200">About This Project</h3>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger className='text-[#dbb04c]'> What does Genuinely offer?</AccordionTrigger>
                <AccordionContent className='text-gray-300'>
                  Real Customer Testimonials  <span className='text-primary'> support@genuinely</span> and we will help you with that.
                </AccordionContent >
              </AccordionItem>
              <AccordionItem value="item-2">
                <AccordionTrigger className='text-[#dbb04c]'>Is there a long-term contract?</AccordionTrigger>
                <AccordionContent className='text-gray-300'>
                  We offer monthly and annual plans, as well as a lifetime access option. If you need a custom plan, please send an email to <span className='text-primary'>support@genuinely</span>.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-3">
                <AccordionTrigger className='text-[#dbb04c]'>Do you offer a free trial?</AccordionTrigger>
                <AccordionContent className='text-gray-300'>
                  We don't offer a free trial, but you can start with our free plan and upgrade to Pro or Lifetime at any time.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-4" className='text-[#dbb04c]'>
                <AccordionTrigger>What happens if my subscription expires?</AccordionTrigger>
                <AccordionContent className='text-gray-300'>
                  If your subscription expires, you will be downgraded to the free plan. You can upgrade to Pro at any time. You will not be able to add more testimonials or spaces until you upgrade. This doesn't apply to the Lifetime plan.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-5" className='text-gray-300'>
                <AccordionTrigger className='text-[#dbb04c]'>What's included in the Lifetime plan?</AccordionTrigger>
                <AccordionContent>
                  The Lifetime plan includes all Pro features with a one-time payment. You'll have access to all current and future features without any recurring fees. It's perfect for those who want long-term access without worrying about monthly or annual payments.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>

          {/* Contact Support */}
          <div className="text-center mt-12">
            <p className="text-gray-200 mb-4">This is a SAAS Project!</p>
            <Button variant="outline">
              <HelpCircle className="mr-2 inline h-4 w-4" />
              <a href="mailto:pri1contact1info@gmail.com" className="text-primary hover:underline">
                Email Support
              </a>
            </Button>
            <Button className="mx-4" variant="outline">
              <FaGithub className="mr-2 inline h-4 w-4" />
              <a href="https://github.com/PriyanshiiAgrawall/Genuinely" className="text-primary hover:underline">
                Github Repository
              </a>
            </Button>
          </div>
        </MaxWidthWrapper>
      </section>
    </div>
  )
}
