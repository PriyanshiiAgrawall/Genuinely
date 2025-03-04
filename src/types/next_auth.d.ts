import "next-auth";
import { DefaultSession } from "next-auth";
//redefining already declared module

declare module "next-auth" {
    interface User {
        _id: string,
        isVerified: boolean,
        subscriptionTier: string,
        image?: string,

    }
    interface Session {
        user: {
            id: string,
            isVerified: boolean,
            subscriptionTier: string,
            image?: string,
        } & DefaultSession['user']

    }
}

//another method

declare module "next-auth/jwt" {
    interface JWT {
        id: string,
        isVerified: boolean,
        subscriptionTier: string,
        image?: string,
    }
}