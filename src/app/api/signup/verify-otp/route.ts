import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import { NextResponse } from "next/server";

//http//localhost:3000/api/signup/verify-otp
//body - name,otp,id
//tested
export async function POST(request: Request) {
    await dbConnect();
    try {
        //taking out unique name and otp from the frontend
        const { name, otp, id } = await request.json();
        //decoding Unique Name this method changes spaces to %20
        const decodedUniqueName = decodeURIComponent(name);
        const usersinDb = await User.find({ name: decodedUniqueName });

        if (usersinDb.length === 0) {
            return NextResponse.json({
                message: "User Not Found, Verify your unique name",
                success: false,
            }, {
                status: 500,
            })
        }
        if (usersinDb.length > 1) {
            const isAnyUserVerified = usersinDb.some(user => user.isVerified === true);
            if (isAnyUserVerified) {
                return NextResponse.json(
                    {
                        message: "Someone took your unique name and verified it before you. Please choose another unique name and sign up again.",
                        success: false,
                    },
                    { status: 409 }
                );
            }
        }

        const currentUserInDb = await User.findById({ _id: id });
        if (!currentUserInDb) {
            return NextResponse.json({
                message: "User Not Found",
                success: false,
            }, {
                status: 500,
            })

        }

        const isOtpValid = Number(currentUserInDb.latestOtp) === Number(otp);
        const isOtpNotExpired = currentUserInDb.otpExpiryDate && currentUserInDb.otpExpiryDate > new Date(Date.now());

        if (isOtpValid && isOtpNotExpired) {
            currentUserInDb.isVerified = true;
            await currentUserInDb.save();
            return NextResponse.json({
                message: "Account verified successfully",
                success: true,
            }, {
                status: 200,
            })


        }

        else if (!isOtpValid) {
            return NextResponse.json({
                message: "You entered wrong otp, Please try again",
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