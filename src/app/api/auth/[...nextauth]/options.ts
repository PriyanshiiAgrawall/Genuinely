import dbConnect from "@/lib/dbConnect";
import User, { OAuthAccountInterface } from "@/models/User";
import { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import GithubProvider from "next-auth/providers/github"
import GoogleProvider from "next-auth/providers/google"
import bcrypt from "bcryptjs";

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
                    const userInDb = await User.findOne({ email: email });
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
        signIn: "/sign-in"
    },
    session: {
        strategy: "jwt", //(database or jwt)
    },
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user._id.toString();
                token.email = user.email,
                    token.name = user.name,
                    token.image = user.image,
                    token.isAcceptingMessages = user.isAcceptingMessages,
                    token.isVerified = user.isVerified,
                    token.subscriptionTier = user.subscriptionTier
            }

            return token;
        },
        async session({ session, user, token }) {
            if (session.user) {
                session.user.id = token.id;
                session.user.email = token.email;
                session.user.name = token.name;
                session.user.image = token.image;
                session.user.subscriptionTier = token.subscriptionTier;
                session.user.isAcceptingMessages = token.isAcceptingMessages;
                session.user.isVerified = token.isVerified;
            }
            return session;
        },
        signIn: async ({ user, account }) => {
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
                    existingUser = new User({
                        email,
                        name: name || "New User",
                        image,
                        password: "", // No password needed for OAuth users
                        latestOtp: 0,
                        isVerified: true,
                        isAcceptingMessages: true,
                        isNewUser: true,
                        subscriptionTier: "Free",
                        subscriptionEndDate: null,
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