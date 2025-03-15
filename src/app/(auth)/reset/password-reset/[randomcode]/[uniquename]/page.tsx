"use client"

import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { usePathname, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod"
import { Eye, EyeOff } from "lucide-react";
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
import { changePasswordSchemaZod } from "@/lib/schemas";
import axios from "axios";
import Navbar1 from "@/app/components/Navbar1";


export default function PasswordResetPage() {
    const pathname = usePathname();
    const parts = pathname.split("/").filter(Boolean);
    const randomcode = parts[parts.length - 1];
    const uniquename = parts[parts.length - 2];
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const { toast } = useToast();
    const router = useRouter();

    const form = useForm<z.infer<typeof changePasswordSchemaZod>>({
        resolver: zodResolver(changePasswordSchemaZod),
        defaultValues: {
            password: "",
            confirmPassword: "",
        }
    })


    async function onSubmit(data: z.infer<typeof changePasswordSchemaZod>) {
        setIsSubmitting(true);
        try {
            const payload = {
                password: data.password,
                confirmPassword: data.confirmPassword,
                uniqueName: uniquename,
                randomcode: randomcode,
                redirect: false,
            }

            const result = await axios.post("/api/password-reset", payload)
            if (result.status !== 200) {
                toast({
                    title: "Password Updation Failed",
                    description: result.data?.message || "Make sure, this link was valid for 30mins",
                    variant: "destructive",
                })
            }
            else {
                toast({
                    title: "Password Changed Successfully"
                })
                router.replace(`/sign-in`);
            }
        }
        catch (err) {
            const errorMessage =
                err.response?.data?.message ||
                "Something went wrong. Please try again later.";
            toast({
                title: "Password Updation Failed",
                description: errorMessage,
                variant: "destructive",
            })


        } finally {
            setIsSubmitting(false);
        }

    }


    return (
        <div><Navbar1 />
            <div className="w-full">

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
                                    name="password"
                                    control={form.control}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-richblack-900">Password</FormLabel>
                                            <FormControl>
                                                <div className="relative">
                                                    <Input
                                                        type={showPassword ? "text" : "password"} placeholder="password" {...field}
                                                        className="border-richblack-300 focus:border-[#272E3F] focus:ring-[#272E3F]"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => setShowPassword(!showPassword)}
                                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-black"
                                                    >
                                                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                                    </button>
                                                </div>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    name="confirmPassword"
                                    control={form.control}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-richblack-900">Confirm Password</FormLabel>
                                            <FormControl>
                                                <div className="relative">
                                                    <Input type={showConfirmPassword ? "text" : "password"} placeholder="Password" {...field}
                                                        className="border-richblack-300 focus:border-[#272E3F] focus:ring-[#272E3F]"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-black"
                                                    >
                                                        {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                                    </button>
                                                </div>
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                                <Button type="submit" disabled={isSubmitting} className="w-full bg-[#272E3F] hover:bg-[#1e2433] text-white rounded-lg py-3">
                                    {isSubmitting ? (<><Loader2 className="mr-2 h-5 w-5 animate-spin text-[#000421]" /> Saving Password...</>) : ('Save Password')}
                                </Button>
                            </form>
                        </Form>

                    </div>
                </div>
            </div>
        </div>
    );
}