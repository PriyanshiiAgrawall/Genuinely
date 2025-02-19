"use client"

import { useEffect, useState } from "react";
import axios, { AxiosError } from "axios";
import { useDebounceCallback } from 'usehooks-ts'
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod"
import { uniqueNameZod } from "@/app/api/unique-name-check/route";
import { ApiResponse } from "@/types/ApiResponse";
import { signIn, signOut } from "next-auth/react";
import { useSession } from "next-auth/react";

//this is imported in 2 ways from react router and from react navigation
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

    const forrm = useForm<z.infer<typeof signUpSchemaZod>>({
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
                    console.log(response);
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
            const response = await axios.post<ApiResponse>(`/api/sign-up`, data);
            toast({
                title: 'Success',
                description: response.data.message
            })
            router.replace(`/api/verify/${uniqueName}`);
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


        }

    }

    async function googleSignUpHandler() {
        signIn("google", { callbackUrl: "/dashboard" });

    }
    function signOutHandler() {
        signOut();
    }
    function githubSignUpHandler() {
        signIn("github", { callbackUrl: "/dashboard" });
    }

    return (
        <div className="flex items-center justify-center min-h-screen">
            <button onClick={googleSignUpHandler}>
                signup with Google
            </button>
            <button onClick={githubSignUpHandler}>
                signup with github
            </button>
            <button onClick={signOutHandler}>
                signout
            </button>
        </div>
    );
}