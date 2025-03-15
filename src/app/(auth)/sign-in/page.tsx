"use client"

import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod"
import { signIn } from "next-auth/react";
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
import Link from "next/link";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import { signInSchemaZod } from "@/lib/schemas";
import Navbar1 from "@/app/components/Navbar1";


export default function SignInPage() {
    //for react hook form
    const [showPassword, setShowPassword] = useState(false);

    const [isSubmitting, setIsSubmitting] = useState(false);
    const { toast } = useToast();
    const router = useRouter();

    const form = useForm<z.infer<typeof signInSchemaZod>>({
        resolver: zodResolver(signInSchemaZod),
        defaultValues: {
            email: "",
            password: "",
        }
    })


    async function onSubmit(data: z.infer<typeof signInSchemaZod>) {
        setIsSubmitting(true);
        try {
            const payload = {
                email: data.email,
                password: data.password,
                redirect: false,
            }
            const result = await signIn("credentials", payload);


            if (result?.error) {
                toast({
                    title: "sign-in Failed",
                    description: "Incorrect unique name, email or password",
                    variant: "destructive",
                })
            }
            if (result?.url) {
                router.replace(`/dashboard`);

            }


        }
        catch (err) {
            console.error("Error in Sign in of user", err);

            toast({
                title: "Signup Failed",
                description: err instanceof Error ? err.message : String(err),
                variant: "destructive",
            })


        } finally {
            setIsSubmitting(false);
        }

    }

    async function googleSignUpHandler() {
        setIsSubmitting(true)
        try {
            signIn("google", { callbackUrl: "/dashboard" });
        }
        catch (err) {
            console.error("Google SignUp Failed", err);

            toast({
                title: "Google Signup Failed",
                description: err instanceof Error ? err.message : String(err),
                variant: "destructive",
            })
        } finally {
            setIsSubmitting(false);
        }


    }
    async function githubSignUpHandler() {
        setIsSubmitting(true)
        try {
            signIn("github", { callbackUrl: "/dashboard" });
        }
        catch (err) {
            console.error("Google SignUp Failed", err);

            toast({
                title: "Google Signup Failed",
                description: err instanceof Error ? err.message : String(err),
                variant: "destructive",
            })
        } finally {
            setIsSubmitting(false);
        }

    }
    return (
        <div className="w-full">
            <div className="my-10">  <Navbar1 /></div>


            <div className="flex justify-center items-center min-h-screen bg-[#000421] py-12 overflow-hidden">
                <div className="w-full max-w-xl lg:w-1/2 xl:w-3/5 p-10 space-y-8 bg-[#F9FAFB] rounded-2xl shadow-2xl overflow-y-auto">
                    <div className="text-center">
                        <h1 className="text-4xl font-extrabold tracking-tight text-richblack-900 lg:text-5xl mb-4">
                            Genuinely{` :)`} Genuine Testimonial Universe
                        </h1>
                        <p className="text-lg text-richblack-700 mb-6">Sign in to get your wall of lovely testimonials.</p>
                    </div>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            <FormField
                                name="email"
                                control={form.control}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-richblack-900">Unique Name/Email</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Unique name" {...field}
                                                className="border-richblack-300 focus:border-[#272E3F] focus:ring-[#272E3F]"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                name="password"
                                control={form.control}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-richblack-900">Password</FormLabel>
                                        <FormControl>
                                            <div className="relative">
                                                <Input type={showPassword ? "text" : "password"} placeholder="Password" {...field}
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
                                    </FormItem>
                                )}
                            />
                            <Link href="/reset/get-email" className="text-blue-800 hover:underline text-[13px]">
                                Forgot Password?
                            </Link>

                            <Button type="submit" disabled={isSubmitting} className="w-full bg-[#272E3F] hover:bg-[#1e2433] text-white rounded-lg py-3">
                                {isSubmitting ? (<><Loader2 className="mr-2 h-5 w-5 animate-spin text-[#000421]" /> Please Wait...</>) : ('Signin With Credentials')}
                            </Button>
                        </form>
                    </Form>
                    <hr></hr>
                    <div className="space-y-4">
                        <Button disabled={isSubmitting} onClick={googleSignUpHandler}
                            className="w-full bg-[#272E3F] hover:bg-[#1e2433] text-white rounded-lg py-3">
                            {
                                <>
                                    <FcGoogle className="mr-2 h-5 w-5" /> Signin With Google
                                </>
                            }
                        </Button>
                        <Button disabled={isSubmitting} onClick={githubSignUpHandler}
                            className="w-full bg-[#272E3F] hover:bg-[#1e2433] text-white rounded-lg py-3">
                            {
                                <>
                                    <FaGithub className="mr-2 h-5 w-5" /> Signin With Github
                                </>
                            }
                        </Button>
                        <Button
                            disabled={isSubmitting}
                            onClick={() => onSubmit({ email: "priyanshi11", password: "12345678" })}
                            className="w-full bg-[#272E3F] hover:bg-[#1e2433] text-white rounded-lg py-3"
                        >
                            Take a Tour (Demo Login)
                        </Button>
                    </div>
                    <div className="text-center mt-6">
                        <p className="text-richblack-600">
                            New Here?{' '}
                            <Link href="/sign-up" className="text-blue-600 hover:text-blue-800 font-semibold">
                                Sign up
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}