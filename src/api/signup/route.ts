import { NextResponse } from "next/server";
import User from "@/models/User";
import otpGenerator from "otp-generator";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/dbConnect";


export async function POST(req: Request) {
    await dbConnect();
    try {
        const { name, email, password, profilePic } = await req.json();
        const userFromDb = await User.findOne({ email });

        if (userFromDb?.isVerified) {
            return NextResponse.json(
                { message: "You are already registered. Please log in.", success: false },
                { status: 400 }
            );
        }

        if (userFromDb) {
            const hashedPass = await bcrypt.hash(password, 10);
            const otp = otpGenerator.generate(6, { upperCaseAlphabets: false, specialChars: false });

            userFromDb.latestOtp = Number(otp);
            userFromDb.password = hashedPass;
            await userFromDb.save();

            return NextResponse.json({ message: "OTP sent again. Please verify your account.", success: true, otp }, { status: 200 });
        }

        const hashedPass = await bcrypt.hash(password, 10);
        const otp = otpGenerator.generate(6, { upperCaseAlphabets: false, specialChars: false });

        const newUser = new User({
            name,
            email,
            password: hashedPass,
            profilePic: profilePic || "https://example.com/default-profile.png",
            latestOtp: Number(otp),
            isVerified: false,
            isNewUser: true,
            subscriptionTier: "Free",
            subscriptionEndDate: null,
            oauthAccounts: [],
            spaces: [],
        });

        await newUser.save();

        return NextResponse.json({ message: "User registered successfully. OTP sent.", success: true, otp }, { status: 201 });
    } catch (err) {
        console.error("Error during user registration:", err);
        return NextResponse.json({ message: "Internal Server Error", success: false }, { status: 500 });
    }
}
