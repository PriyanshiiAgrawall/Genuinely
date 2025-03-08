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
              Choose the plan that&apos;s right for you.
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
            <h3 className="text-2xl font-bold text-center mb-6 text-gray-200">
              About This Project
            </h3>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger className="text-[#dbb04c]">
                  What is Genuinely?
                </AccordionTrigger>
                <AccordionContent className="text-gray-300">
                  Genuinely is a <strong>testimonial collection and management platform</strong> that allows businesses to gather, organize, and display customer testimonials effortlessly. Users can create dedicated spaces for different projects, collect testimonials, and embed them in their websites with multiple customization options.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-2">
                <AccordionTrigger className="text-[#dbb04c]">
                  What features does Genuinely offer?
                </AccordionTrigger>
                <AccordionContent className="text-gray-300">
                  - <strong>User Authentication</strong>: Sign up and log in using <strong>Google, GitHub, or email/password</strong> (secured with OTP verification via Resend).<br />
                  - <strong>Subscription Plans</strong>: Choose between <strong>Free, Pro, and Lifetime</strong> subscription plans powered by Paddle.<br />
                  - <strong>Testimonial Collection</strong>: Businesses can create testimonial spaces, customize forms with project title, logo, prompt text, and more.<br />
                  - <strong>Testimonial Management</strong>: Search, paginate, like, and delete testimonials.<br />
                  - <strong>Embeddable Testimonials</strong>: Generate <strong>unique links and embed codes</strong> with multiple themes (light, dark, grid, carousel).<br />
                  - <strong>Avatar Customization</strong>: Users can upload avatars or generate them using <strong>animal-avatar-generator</strong> and <strong>jdenticon</strong>.<br />
                  - <strong>Security</strong>: Passwords are encrypted using <strong>bcryptjs</strong>.<br />- <strong>AI Integration</strong>: For testimonial suggestion using <strong>Gemini</strong>.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-3">
                <AccordionTrigger className="text-[#dbb04c]">
                  What technologies power Genuinely?
                </AccordionTrigger>
                <AccordionContent className="text-gray-300">
                  - <strong>Frontend & Backend</strong>: <a href="https://nextjs.org/" className="text-primary">Next.js</a> (App Router, Server Actions).<br />
                  - <strong>Styling</strong>: <a href="https://tailwindcss.com/" className="text-primary">Tailwind CSS</a>, <a href="https://ui.shadcn.com/" className="text-primary">shadcn/ui</a>.<br />
                  - <strong>Authentication</strong>: <a href="https://next-auth.js.org/" className="text-primary">NextAuth.js</a> with Google, GitHub, and OTP via <a href="https://resend.com/" className="text-primary">Resend</a>.<br />
                  - <strong>Database</strong>: <a href="https://www.mongodb.com/" className="text-primary">MongoDB</a> with <a href="https://mongoosejs.com/" className="text-primary">Mongoose</a>.<br />
                  - <strong>Storage</strong>: <a href="https://cloudinary.com/" className="text-primary">Cloudinary</a> for file storage.<br />
                  - <strong>AI Assistance</strong>:
                  <a href="https://gemini.google.com/" className="text-primary">Gemini AI</a> for testimonials suggestions.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-4">
                <AccordionTrigger className="text-[#dbb04c]">
                  How does the testimonial embedding work?
                </AccordionTrigger>
                <AccordionContent className="text-gray-300">
                  Each space has a <strong>unique submission link</strong> where users can collect testimonials. Testimonials can be displayed on external websites using an <strong>embed code</strong>, available in <strong>multiple layouts</strong> (light, dark, grid, carousel).
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-5">
                <AccordionTrigger className="text-[#dbb04c]">
                  Can businesses control testimonial collection?
                </AccordionTrigger>
                <AccordionContent className="text-gray-300">
                  Yes, businesses can <strong>toggle their space on or off</strong> to enable or disable testimonial collection at any time.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-6">
                <AccordionTrigger className="text-[#dbb04c]">
                  What makes Genuinely different from other testimonial tools?
                </AccordionTrigger>
                <AccordionContent className="text-gray-300">
                  - <strong>Seamless authentication & security</strong> with NextAuth, Resend, and bcryptjs.<br />
                  - <strong>Comprehensive testimonial management</strong> with search, pagination, liking, and deletion.<br />
                  - <strong>Flexible embeddable testimonials</strong> with multiple themes and layouts.<br />
                  - <strong>Customizable testimonial forms</strong> tailored to each business’s needs.<br />
                  - <strong>Optimized performance</strong> using real-time hooks and debounced API calls.<br /> - <strong>AI Integration</strong> using gemini AI for suggesting testimonials to users according to promt.
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
