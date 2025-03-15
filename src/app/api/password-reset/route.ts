import dbConnect from "@/lib/dbConnect";
import { NextResponse } from "next/server";
import User from "@/models/User";
import bcrypt from "bcryptjs"
import ResetPassword from "@/models/ResetPassword";


export async function POST(request: Request) {
    await dbConnect();
    try {
        const { uniqueName, randomcode, password, confirmPassword } = await request.json();

        if (!password || !confirmPassword || !uniqueName || !randomcode) {
            return NextResponse.json({
                success: false,
                message: "Unique name or email,Password and Confirm Password Required"
            }, {
                status: 400,
            })
        }
        if (password !== confirmPassword) {
            return NextResponse.json({
                success: false,
                message: "Password and Confirm Password Mismatch"
            }, {
                status: 400,
            })
        }
        const user = await User.findOne({ name: uniqueName });
        if (!user) {
            return NextResponse.json({
                message: "User Not Found",
                success: false,
            }, {
                status: 400,
            })
        }
        const reset = await ResetPassword.findOne({
            email: user.email,
        })
        if (!reset) {
            return NextResponse.json({
                message: "No password reset request found",
                success: false,
            }, { status: 400 });
        }
        if (reset.codeExpiryDate.getTime() < Date.now()) {
            return NextResponse.json({
                message: "Password Resetting link expired",
                success: false,
            }, {
                status: 400,
            })

        }
        if (reset.latestcode !== randomcode) {
            return NextResponse.json({
                message: "Wrong url",
                success: false,
            }, {
                status: 400,
            })
        }

        const hashedPass = await bcrypt.hash(password, 10);
        user.password = hashedPass;
        await user.save();

        return NextResponse.json({
            message: "Account verified successfully",
            success: true,
        }, {
            status: 200,
        })
    }

    catch (err) {
        return NextResponse.json({
            message: "Error updating Password",
            success: false,
        }, {
            status: 500,
        })

    }
}