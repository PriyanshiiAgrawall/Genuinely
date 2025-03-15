import { NextResponse } from "next/server";
import User, { UserInterface } from "@/models/User";
import otpGenerator from "otp-generator";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/dbConnect";
import signupOtpEmailSending from "@/helpers/signupOtpEmailSending";
import { exampleAvatar, generateCustomAvatar } from "@/helpers/avatar-generator";

// http//localhost:3000/api/signup
//body - name,email,password
//tested
export async function POST(req: Request) {
    await dbConnect();
    try {
        const { name, email, password } = await req.json();
        const userFromDb: UserInterface | null = await User.findOne({ email });

        if (userFromDb?.isVerified) {
            return NextResponse.json(
                { message: "You are already registered. Please log in.", success: false },
                { status: 400 }
            );
        }

        if (userFromDb) {
            const id = userFromDb._id;
            const hashedPass = await bcrypt.hash(password, 10);

            const otp = Math.floor(100000 + Math.random() * 900000);

            userFromDb.latestOtp = Number(otp);

            userFromDb.otpExpiryDate = new Date(Date.now() + 10 * 60 * 1000);

            userFromDb.password = hashedPass;

            userFromDb.name = name;
            await userFromDb.save();
            console.log("hereeeeeeeeeeee")
            console.log(otp);
            console.log(email);
            const otpSend = await signupOtpEmailSending({ name, otp, email });
            console.log(otpSend);
            if (!otpSend?.success) {
                return NextResponse.json({
                    success: false,
                    message: "Error in sending OTP, Please try again",
                }, {
                    status: 400,
                })
            }

            return NextResponse.json({ message: "This email has been previously used for signing up, but verification yet has to be done. OTP sent to this email again. Please verify your account to continue, Eitherway we have updated your username and password", success: true, id: id }, { status: 200 });
        }

        const hashedPass = await bcrypt.hash(password, 10);
        const otp = Math.floor(100000 + Math.random() * 900000);

        const base64Avatar = `data:image/svg+xml;base64,${Buffer.from(generateCustomAvatar(email || name)).toString("base64")}`;

        const isOtpSend = await signupOtpEmailSending({ name, otp, email });
        console.log(isOtpSend);
        console.log(otp);
        if (!isOtpSend?.success) {
            return NextResponse.json({
                success: false,
                message: "Error in sending OTP, Please try again",
            }, {
                status: 400,
            })
        }


        const newUser = {
            name,
            email,
            password: hashedPass,
            image: base64Avatar || exampleAvatar,
            latestOtp: Number(otp),
            otpExpiryDate: new Date(Date.now() + 10 * 60 * 1000),
            isVerified: false,
            isNewUser: true,
            subscriptionTier: "Free",
            subscriptionEndDate: null,
            oauthAccounts: [],
            spaces: [],
        };

        const isCreated = await User.create(newUser);
        if (!isCreated._id) {
            return NextResponse.json(
                { message: "There is some error in signing you up, Please try again ", success: false },
                { status: 400 }
            );
        }

        return NextResponse.json({ message: "User registered successfully. OTP sent.", success: true, id: isCreated._id.toString() }, { status: 201 });
    } catch (err) {
        console.error("Error during user registration:", err);
        return NextResponse.json({ message: "Internal Server Error", success: false }, { status: 500 });
    }
}


