"use client"

import { useEffect, useState } from "react";
import axios, { AxiosError } from "axios";
import { useDebounceCallback } from 'usehooks-ts'
import { useToast } from "@/hooks/use-toast";
//this is imported in 2 ways from react router and from react navigation
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod"
import { uniqueNameZod } from "@/app/api/unique-name-check/route";
import { ApiResponse } from "@/types/ApiResponse";
import { signIn, signOut } from "next-auth/react";
import { useSession } from "next-auth/react";
import {
    Form,
    FormControl,
    FormDescription,
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
import Navbar0 from "@/app/[uniqueName]/[spaceName]/components/Navbar0";

export const signUpSchemaZod = z.object({
    name: uniqueNameZod,
    email: z.string().email("Invalid Email Format"),
    password: z.string().min(6, "Password must be atleast 6 characters"),
})
export default function SignUpPage() {

    const [uniqueName, setUniqueName] = useState('');
    //the message which will apear just below unique name field
    const [uniqueNameMessage, setUniqueNameMessage] = useState('');
    const [uniqueNameCheckingLoader, setUniqueNameCheckingLoader] = useState(false);
    //for react hook form
    const [isSubmitting, setIsSubmitting] = useState(false);
    const debounced = useDebounceCallback(setUniqueName, 300);
    const { toast } = useToast();
    const router = useRouter();

    const form = useForm<z.infer<typeof signUpSchemaZod>>({
        resolver: zodResolver(signUpSchemaZod),
        defaultValues: {
            name: "",
            email: "",
            password: "",
        }
    })

    useEffect(() => {
        async function checkingUniqueNameAvailabilityFromBackend() {
            if (uniqueName) {
                setUniqueNameCheckingLoader(true);
                setUniqueNameMessage("");
                try {
                    const response = await axios.get(`/api/unique-name-check?name=${uniqueName}`);

                    setUniqueNameMessage(response.data.message);

                }
                catch (err) {
                    const axiosError = err as AxiosError<ApiResponse>;
                    setUniqueNameMessage(axiosError.response?.data.message ?? "Error checking unique name");

                } finally {
                    setUniqueNameCheckingLoader(false);
                }
            }

        }
        checkingUniqueNameAvailabilityFromBackend();

    }, [uniqueName]);

    async function onSubmit(data: z.infer<typeof signUpSchemaZod>) {
        setIsSubmitting(true);
        try {
            const response = await axios.post<ApiResponse>(`/api/signup`, data);

            toast({
                title: 'Success',
                description: response.data.message
            })
            const id = response.data.id;
            router.replace(`/verify/${uniqueName}?id=${id}`);
        }
        catch (err) {
            console.error("Error in Sign up of user", err);
            const axiosError = err as AxiosError<ApiResponse>;
            let errorMessage = axiosError.response?.data.message;
            toast({
                title: "Signup Failed",
                description: errorMessage,
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
        <div>
            <Navbar0 />
            <div className="flex justify-center items-center min-h-screen bg-[#000421] py-12 overflow-hidden">
                <div className="w-full max-w-xl lg:w-1/2 xl:w-3/5 p-10 space-y-8 bg-[#F9FAFB] rounded-2xl shadow-2xl overflow-y-auto">
                    <div className="text-center">
                        <h1 className="text-4xl font-extrabold tracking-tight text-richblack-900 lg:text-5xl mb-4">
                            Genuinely{` :)`} Genuine Testimonial Universe
                        </h1>
                        <p className="text-lg text-richblack-700 mb-6">Sign up to get your wall of lovely testimonials.</p>
                    </div>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            <FormField
                                name="name"
                                control={form.control}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-richblack-900">Unique Name</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Unique name" {...field}
                                                className="border-richblack-300 focus:border-[#272E3F] focus:ring-[#272E3F]"
                                                onChange={(e: any) => {
                                                    field.onChange(e)
                                                    debounced(e.target.value)
                                                }}
                                            />
                                        </FormControl>
                                        <FormDescription className="text-sm text-blue-500">
                                            {uniqueNameCheckingLoader && <Loader2 className="animate-spin text-[#000421]" />}
                                            {uniqueName && <span className={`text-sm ${uniqueNameMessage === "This unique name is available" ? 'text-[#000421]' : 'text-red-500'}`}>{uniqueNameMessage}</span>}

                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                name="email"
                                control={form.control}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-richblack-900">Email</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Email" {...field}
                                                className="border-richblack-300 focus:border-[#272E3F] focus:ring-[#272E3F]"
                                            />
                                        </FormControl>
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
                                            <Input type="password" placeholder="Password" {...field}
                                                className="border-richblack-300 focus:border-[#272E3F] focus:ring-[#272E3F]"
                                            />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                            <Button type="submit" disabled={isSubmitting} className="w-full bg-[#272E3F] hover:bg-[#1e2433] text-white rounded-lg py-3">
                                {isSubmitting ? (<><Loader2 className="mr-2 h-5 w-5 animate-spin text-[#000421]" /> Please Wait...</>) : ('Signup With Credentials')}
                            </Button>
                        </form>
                    </Form>
                    <hr></hr>
                    <div className="space-y-4">
                        <Button disabled={isSubmitting} onClick={googleSignUpHandler}
                            className="w-full bg-[#272E3F] hover:bg-[#1e2433] text-white rounded-lg py-3">
                            {
                                <>
                                    <FcGoogle className="mr-2 h-5 w-5" /> Signup With Google
                                </>
                            }
                        </Button>
                        <Button disabled={isSubmitting} onClick={githubSignUpHandler}
                            className="w-full bg-[#272E3F] hover:bg-[#1e2433] text-white rounded-lg py-3">
                            {
                                <>
                                    <FaGithub className="mr-2 h-5 w-5" /> Signup With Github
                                </>
                            }
                        </Button>
                        <Button
                            disabled={isSubmitting}
                            onClick={async (e) => {
                                e.preventDefault();
                                await signIn("credentials", {
                                    email: "priyanshi11",
                                    password: "12345678",
                                    redirect: true,
                                    callbackUrl: "/dashboard",
                                });
                            }}

                            className="w-full bg-[#272E3F] hover:bg-[#1e2433] text-white rounded-lg py-3"
                        >
                            Sign In With Dummy Data
                        </Button>
                    </div>
                    <div className="text-center mt-6">
                        <p className="text-richblack-600">
                            Already a member?{' '}
                            <Link href="/sign-in" className="text-blue-600 hover:text-blue-800 font-semibold">
                                Sign in
                            </Link>
                        </p>
                    </div>
                </div>
            </div>  </div>
    );
}