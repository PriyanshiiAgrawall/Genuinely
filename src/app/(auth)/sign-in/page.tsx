"use client"

import { signIn } from "next-auth/react";
import { useState } from "react";


export default function SignInPage() {
    const [uniqueName, setUniqueName] = useState('');
    const [UniqueNameMessage, setUniqueNameMessage] = useState('');
    function googleSignUpHandler() {
        signIn("google", { callbackUrl: "/dashboard" });
    }
    function githubSignUpHandler() {
        signIn("github");
    }
    return (
        <div className="flex items-center justify-center min-h-screen">
            <button onClick={googleSignUpHandler}>
                signin with Google
            </button>
            <button onClick={githubSignUpHandler}>
                signin with github
            </button>
        </div>
    );
}