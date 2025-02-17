import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import { NextResponse } from "next/server";


export async function POST(request: Request) {
    await dbConnect();
    try {
        //taking out unique name and otp from the frontend
        const { name, otp } = await request.json();
        //decoding Unique Name this method changes spaces to %20
        const decodedUniqueName = decodeURIComponent(name);
        const userinDb = await User.findOne({ name: decodedUniqueName });
        if (!userinDb) {
            return NextResponse.json({
                message: "User Not Found",
                success: false,
            }, {
                status: 500,
            })
        }
        const isOtpValid = Number(userinDb.latestOtp) === Number(otp);
        const isOtpNotExpired = userinDb.otpExpiryDate > new Date(Date.now());

        if (isOtpValid && isOtpNotExpired) {
            userinDb.isVerified = true;
            await userinDb.save();
            return NextResponse.json({
                message: "Account verified successfully",
                success: true,
            }, {
                status: 200,
            })


        }

        else if (!isOtpValid) {
            return NextResponse.json({
                message: "You entered wrong otp",
                success: false,
            }, {
                status: 400,
            })
        }
        else if (!isOtpNotExpired) {
            return NextResponse.json({
                message: "OTP got expired please signup again to get a new code",
                success: false,
            }, {
                status: 400,
            })
        }


    }
    catch (err) {
        return NextResponse.json({
            message: "Server Error",
            success: false,
        }, {
            status: 500,
        })

    }
}