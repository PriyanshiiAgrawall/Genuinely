import dbConnect from "@/lib/dbConnect";
import { uniqueNameZod } from "@/lib/schemas";
import User from "@/models/User";
import { NextResponse } from "next/server";
import { z } from "zod";



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
            message: "This unique name is available",
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
