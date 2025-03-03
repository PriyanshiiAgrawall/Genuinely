import { Check, Gem } from 'lucide-react'
import { Button, buttonVariants } from '@/components/ui/button'
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { PlanProps } from './PricingSection'
import Link from 'next/link'




interface PricingCardProps extends PlanProps {
    isAnnual: boolean
}

export function PricingCard({
    title,
    monthlyPrice,//if someone purchases pro on plan monthly basis
    annualPrice,//if someone purchases pro plan 1 time in a year
    oneTimePrice,//for lifetime access
    features,
    buttonText,
    isPro,
    isAnnual,
    monthlyPriceId,
    annualPriceId,
    oneTimePriceId
}: PricingCardProps) {

    const getCheckoutLink = () => {
        //if user chooses free account
        if (buttonText === 'Get Started') {
            return '/sign-in'
        }
        //if user chooses lifetime access
        if (oneTimePrice !== undefined) {
            return `/checkout?priceId=${oneTimePriceId}`
        }
        //if person taking a pro plan -> annual or monthly
        return `/checkout?priceId=${isAnnual ? annualPriceId : monthlyPriceId}`
    }


    const price = oneTimePrice !== undefined
        ? oneTimePrice
        : isAnnual
            ? annualPrice
            : monthlyPrice

    const priceId = oneTimePrice !== undefined
        ? oneTimePriceId
        : isAnnual
            ? annualPriceId
            : monthlyPriceId

    return (
        <Card className={`w-full ${isPro ? 'border-indigo-500' : ''}`}>
            <CardHeader>
                <CardTitle>{title}</CardTitle>
                <CardDescription>
                    {oneTimePrice !== undefined ? (
                        <span className="text-3xl font-bold">${oneTimePrice}</span>
                    ) : (
                        <>
                            <span className="text-3xl font-bold">${price}</span>
                            <span className="text-gray-500">/{isAnnual ? 'year' : 'month'}</span>
                        </>
                    )}
                </CardDescription>
            </CardHeader>
            <CardContent>
                <ul className="space-y-2">
                    {features.map((feature, index) => (
                        <li key={index} className="flex items-center">
                            <Check className="h-5 w-5 text-green-500 mr-2" />
                            {feature.tooltip ? (
                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <span className="text-sm">{feature.text}</span>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <p>{feature.tooltip}</p>
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            ) : (
                                <span className="text-sm text-[#dbb04c]">{feature.text}</span>
                            )}
                        </li>
                    ))}
                </ul>
            </CardContent>
            <CardFooter>
                <Link
                    href={getCheckoutLink()}
                    className={buttonVariants({
                        variant: 'default',
                        size: 'lg',
                        className: 'w-full'
                    })}
                >
                    {buttonText}
                </Link>
            </CardFooter>
        </Card>
    )
}