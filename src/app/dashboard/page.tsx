
"use client";

import { signOut } from "next-auth/react";


export default function Dashboard() {
    function signOutHandler() {
        signOut();
    }
    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold">Welcome,this is dashboard🚀</h1>
            <button onClick={signOutHandler}>signOut</button>
        </div>
    );
}
