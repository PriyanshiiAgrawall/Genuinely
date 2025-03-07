import dbConnect from "@/lib/dbConnect";
import User, { OAuthAccountInterface } from "@/models/User";
import { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import GithubProvider from "next-auth/providers/github"
import GoogleProvider from "next-auth/providers/google"
import bcrypt from "bcryptjs";
import { generateUniqueName } from "@/helpers/customUniqueNameGenerator";
import crypto from "crypto";

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            // You can pass any HTML attribute to the <input> tag through the object.
            credentials: {
                email: { label: "Email", type: "text", placeholder: "pri@gmail.com" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials: any, req): Promise<any> {
                // You need to provide your own logic here that takes the credentials
                // submitted and returns either a object representing a user or value
                // that is false/null if the credentials are invalid.
                // e.g. return { id: 1, name: 'J Smith', email: 'jsmith@example.com' }
                // You can also use the `req` object to obtain additional parameters
                // (i.e., the request IP address)
                await dbConnect();
                try {
                    const email = credentials?.email;

                    const password = credentials?.password;

                    if (!email || !password) {
                        throw new Error("Email and Password are required");
                    }
                    const userInDb = await User.findOne({
                        $or: [{ email: email }, { name: email }]
                    });
                    if (!userInDb) {
                        throw new Error("You have not yet signed up please sign up first")
                    }
                    if (!userInDb.isVerified) {
                        throw new Error("You have not yet verified your account via OTP signup again to get verification code")
                    }
                    const isPasswordSame = await bcrypt.compare(password, userInDb.password);
                    if (!isPasswordSame) {
                        throw new Error("You have inputted wrong Password Please Check Again");
                    }
                    return userInDb;
                }
                catch (err: any) {
                    throw new Error(err)
                };

            }
        }),
        GithubProvider({
            clientId: process.env.GITHUB_CLIENT_ID || "",
            clientSecret: process.env.GITHUB_CLIENT_SECRET || "",
        }),
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID || "",
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
        }),

    ],
    pages: {
        signIn: "/sign-in",
        newUser: "/sign-up"
    },
    session: {
        strategy: "jwt",//(database or jwt)
        maxAge: 3 * 24 * 60 * 60,
        updateAge: 24 * 60 * 60,
    },
    jwt: {
        maxAge: 3 * 24 * 60 * 60,
    }, cookies: {
        sessionToken: {
            name: `next-auth.session-token`,
            options: {
                httpOnly: true,
                sameSite: "lax",
                path: "/",
                secure: false, // Secure false for localhost
            },
        },
    },
    callbacks: {
        async jwt({ token, user }) {
            // console.log("JWT CALLBACK:", { token, user });
            if (user) {
                token.id = user._id?.toString();
                token.email = user.email,
                    token.name = user.name,
                    token.image = user.image,
                    token.isVerified = user.isVerified,
                    token.subscriptionTier = user.subscriptionTier
            }

            return token;
        },
        async session({ session, user, token }) {
            // console.log("here are session callback", session, user, token)
            if (session.user) {
                session.user.id = token.sub || token.id;
                session.user.email = token.email;
                session.user.name = token.name;
                session.user.image = token.image;
                session.user.subscriptionTier = token.subscriptionTier;
                session.user.isVerified = token.isVerified;
            }
            return session;
        }, async redirect({ url, baseUrl }) {
            return `${baseUrl}/dashboard`;
        },
        signIn: async ({ user, account }) => {
            // console.log("SIGN IN CALLBACK TRIGGERED:", { user, account });
            await dbConnect();

            const { email, name, image } = user;
            const providerAccountId = account?.providerAccountId as string;
            const provider = account?.provider as string;

            try {
                let existingUser = await User.findOne({ email });

                if (existingUser) {
                    // Check if this OAuth provider is already linked

                    const oauthAccount = existingUser.oauthAccounts.find((acc: OAuthAccountInterface) =>
                        acc.provider === provider && acc.providerAccountId === providerAccountId
                    );


                    if (!oauthAccount) {
                        // Add new OAuth provider to the existing user
                        existingUser.oauthAccounts.push({ provider, providerAccountId });
                        await existingUser.save();
                    }

                } else {
                    // Create a new user with the OAuth account
                    let uniqueName = generateUniqueName();
                    uniqueName.replaceAll(" ", "_");
                    uniqueName = uniqueName + '1';
                    let nameExists = await User.findOne({ name: uniqueName });
                    let count = 1;
                    while (nameExists) {
                        uniqueName = `${generateUniqueName()}_${count}`;
                        uniqueName.replaceAll(" ", "_"); // Add a number if the name exists
                        nameExists = await User.findOne({ name: uniqueName });
                        count++;
                    }
                    count = 1;
                    const randomPassword = crypto.randomBytes(16).toString("hex"); // Random 32-character hex string

                    existingUser = new User({
                        email,
                        name: uniqueName,
                        image,
                        password: randomPassword, // No password needed for OAuth users so putting random password so that mongoose validation do not fail as password is required entry
                        latestOtp: 0,
                        isVerified: true,
                        isNewUser: true,
                        subscriptionTier: "Free",
                        subscriptionEndDate: null,
                        otpExpiryDate: new Date(0),
                        oauthAccounts: [{ provider, providerAccountId }],
                    });
                    await existingUser.save();
                }

                return true;

            } catch (error) {
                console.log("Error during OAuth sign-in:", error);
                return false;
            }
        },

    },
    secret: process.env.NEXTAUTH_SECRET,

}