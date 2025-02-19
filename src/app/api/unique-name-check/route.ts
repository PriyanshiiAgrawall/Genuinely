import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import { NextResponse } from "next/server";
import { z } from "zod";

export const uniqueNameZod = z.string()
    .min(2, "Unique Name must have at least 2 characters")
    .max(15, "Unique Name must have a maximum of 15 characters")
    .regex(/^(?=.*\d)[a-zA-Z0-9_]+$/, "Unique Name must contain at least one number and no special characters other than underscore");

export async function GET(request: Request) {
    await dbConnect();

    try {
        const url = new URL(request.url);
        const searchParams = url.searchParams;
        const uniqueName = searchParams.get("name");
        // const fetchedDataFromQueryParam = {
        //    uniqueName: uniqueName
        // }
        const checkedUniqueName = uniqueNameZod.safeParse(uniqueName);
        console.log(checkedUniqueName);
        if (!checkedUniqueName.success) {
            const errors = checkedUniqueName.error.format();
            //errors will have all the errors that zod might have faced throughout the project 
            const uniqueNameErrors = errors?._errors || [];
            //uniqueNameErrors will only have uniqueName errors
            return NextResponse.json({
                message: uniqueNameErrors.length > 0 ? uniqueNameErrors.join(', ') : "Invalid Unique Name",
                success: false,
            }, {
                status: 400,
            })
        }
        const userInDb = await User.findOne({ name: uniqueName });

        if (userInDb && userInDb.isVerified) {
            return NextResponse.json({
                message: "User with same unique Name does exist please choose a diffrent one",
                success: false,
            }, {
                status: 400,
            })
        }


        return NextResponse.json({
            message: "Unique Name is available",
            success: true,
        }, {
            status: 200,
        })
    }
    catch (err) {
        return NextResponse.json({
            message: "Internal server error while checking for unique otp",
            success: false,
        }, {
            status: 500,
        })
    }


}
