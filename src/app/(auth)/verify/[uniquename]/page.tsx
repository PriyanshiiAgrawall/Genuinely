"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Toast } from "@/components/ui/toast"
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSlot,
} from "@/components/ui/input-otp"
import { useParams, useRouter, useSearchParams } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import axios, { AxiosError } from "axios"
import { ApiResponse } from "@/types/ApiResponse"
import { useState } from "react"

export const otpSchemaZod = z.object({
    otp: z.string().min(6, {
        message: "Your one-time password must be 6 characters.",
    })
})


export default function VerifyOtpPage() {
    const router = useRouter();
    const params = useParams<{ uniquename: string }>();
    console.log(params);
    const searchParams = useSearchParams();
    const { toast } = useToast();
    const id = searchParams.get("id");
    const [value, setValue] = useState<string>("");
    const form = useForm<z.infer<typeof otpSchemaZod>>({
        resolver: zodResolver(otpSchemaZod),
        defaultValues: {
            otp: "",
        },
    })


    async function onSubmit(data: z.infer<typeof otpSchemaZod>) {
        toast({
            title: "You submitted the following values:",
            description: (
                <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
                    <code className="text-white">{data.otp}</code>
                </pre>
            ),
        })
        try {
            const payload = {
                name: params.uniquename,
                otp: data.otp,
                id: id,
            }
            console.log(payload);
            const response = await axios.post("/api/verify-otp", payload);
            console.log(response);

            toast({
                title: "Verification Successfull",
                description: (
                    <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
                        <p className="text-white">{response.data.message}</p>
                    </pre>
                ),
            })
            router.replace("/sign-in");

        } catch (err) {
            console.error("Error in Verifying Otp", err);
            const axiosError = err as AxiosError<ApiResponse>;
            let errorMessage = axiosError.response?.data.message;
            toast({
                title: "Otp Verification Failed",
                description: errorMessage,
                variant: "destructive",
            })

        }

    }
    return (
        <div className="flex justify-center items-center min-h-screen bg-[#000421] overflow-hidden">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="w-full max-w-xl space-y-8 bg-[#F9FAFB] p-10 rounded-2xl shadow-2xl">
                    <FormField
                        control={form.control}
                        name="otp"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-2xl font-semibold text-[#000421]">One-Time Password</FormLabel>
                                <FormControl>
                                    <InputOTP maxLength={6} {...field} className="flex justify-center gap-4">
                                        <InputOTPGroup>
                                            {[...Array(6)].map((_, index) => (
                                                <InputOTPSlot

                                                    onInput={(e: React.FormEvent<HTMLInputElement>) => {
                                                        const inputElement = e.target as HTMLInputElement;
                                                        if (!/^n?o?$/.test(inputElement.value.toLowerCase())) {
                                                            inputElement.value = "";
                                                        }
                                                    }}
                                                    key={index}
                                                    index={index}

                                                    className="h-12 w-12 text-xl  border-[#000421] text-[#000421] bg-white shadow-md 
                                                    focus:border-blue-500 focus:ring-2 focus:ring-blue-300 transition-all duration-300"
                                                />
                                            ))}
                                        </InputOTPGroup>
                                    </InputOTP>
                                </FormControl>
                                <FormDescription>
                                    Please enter the one-time password sent to your email.
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <Button type="submit">Submit</Button>
                </form>
            </Form>
        </div>
    )


}