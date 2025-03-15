//this page will get user email and send him mail with generated forgot password link

"use client"

import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import Navbar0 from "@/app/[uniqueName]/[spaceName]/components/Navbar0";
import { emailSchemaZod } from "@/lib/schemas";
import resetPassLinkGenerate from "@/lib/resetPassLinkGenerate";
import forgotPasswordEmailSending from "@/helpers/forgotPasswordEmailSending";
import { forgotPasswordEmailSendingServer, resetPasswordLinkTimeSaveToDb } from "@/app/actions/account";
import Navbar from "@/app/(app)/dashboard/components/Navbar";
import Navbar1 from "@/app/components/Navbar1";


export default function GetEmailPage() {
    //for react hook form
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { toast } = useToast();
    const router = useRouter();

    const form = useForm<z.infer<typeof emailSchemaZod>>({
        resolver: zodResolver(emailSchemaZod),
        defaultValues: {
            email: "",
        }
    })


    async function onSubmit(data: z.infer<typeof emailSchemaZod>) {
        setIsSubmitting(true);
        try {
            const { randomcode, randomCodeExpiryDate } = await resetPassLinkGenerate();

            const name = data.email;

            const uniquename = await resetPasswordLinkTimeSaveToDb(randomcode, randomCodeExpiryDate, name);
            if (uniquename === null || !uniquename) {
                toast({
                    title: "Email not registered, Please sign-up",
                    variant: "destructive",

                })
            } else {
                const link = `${process.env.NEXT_PUBLIC_APP_URL}/reset/password-reset/${uniquename}/${randomcode}`;

                const payload = {
                    name: data.email,
                    link: link,

                }
                await forgotPasswordEmailSendingServer(payload);


                toast({
                    title: "Email send",
                    description: "check your email to change your password",
                })
            }
        }
        catch (err) {
            console.error("Error in collecting email for sending password reset link", err);

            toast({
                title: "Email Sending Failed",
                description: err instanceof Error ? err.message : String(err),
                variant: "destructive",
            })


        } finally {
            setIsSubmitting(false);
        }

    }

    return (
        <div>
            <Navbar1 />

            <div className="w-full">
                <Navbar0 />
                <div className="flex justify-center items-center min-h-screen bg-[#000421] py-12 overflow-hidden">
                    <div className="w-full max-w-xl lg:w-1/2 xl:w-3/5 p-10 space-y-8 bg-[#F9FAFB] rounded-2xl shadow-2xl overflow-y-auto">
                        <div className="text-center">
                            <h1 className="text-4xl font-extrabold tracking-tight text-richblack-900 lg:text-5xl mb-4">
                                Genuinely{` :)`} Genuine Testimonial Universe
                            </h1>
                        </div>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                                <FormField
                                    name="email"
                                    control={form.control}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-richblack-900">Email</FormLabel>
                                            <FormControl>
                                                <Input placeholder="email" {...field}
                                                    className="border-richblack-300 focus:border-[#272E3F] focus:ring-[#272E3F]"
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <Button type="submit" disabled={isSubmitting} className="w-full bg-[#272E3F] hover:bg-[#1e2433] text-white rounded-lg py-3">
                                    {isSubmitting ? (<><Loader2 className="mr-2 h-5 w-5 animate-spin text-[#000421]" /> Sending Email...</>) : ('Request Email')}
                                </Button>
                            </form>
                        </Form>
                    </div>
                </div>
            </div>
        </div>
    );
}