import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "../auth/[...nextauth]/options";
import User from "@/models/User";

export async function POST(req: Request) {
    const { userId, eventData } = await req.json();

    if (!userId || !eventData) {
        return NextResponse.json({ message: "Invalid request" }, { status: 400 });
    }

    const session = await getServerSession(authOptions);
    const sessionUser = session?.user?.id;
    if (!sessionUser) {
        return NextResponse.json({ message: "User not found" }, { status: 404 });
    }
    // check if the user is the same as the one who made the request
    if (userId != sessionUser && userId != eventData.custom_data.user_id) {
        return NextResponse.json({ message: "User not found" }, { status: 404 });
    }


    const dbUser = await User.findById(userId).exec();
    if (!dbUser) {
        return NextResponse.json({ message: "User not found in db" }, { status: 404 });
    }

    // update the user's subscription tier
    let tier = eventData?.items[0].product.name;
    if (tier === "Pro-y") {
        tier = "Pro";
    }
    dbUser.subscriptionTier = tier;
    // update the user's subscription end date by adding 30 days to the date in the database
    // if the user has a subscription end date in the database


    let subscriptionEndDate = dbUser.subscriptionEndDate;
    const invalidDate = new Date(0)
    if (eventData?.items[0].product.name === "Pro") {

        if (subscriptionEndDate?.getTime() === invalidDate?.getTime()) {
            //30 days from today
            subscriptionEndDate = new Date();
            subscriptionEndDate.setDate(subscriptionEndDate.getDate() + 30);

        }
        else {
            //30 days from current sunscription end date 
            subscriptionEndDate?.setDate(subscriptionEndDate?.getDate() + 30);
        }
        dbUser.subscriptionEndDate = subscriptionEndDate;
    }
    else if (eventData?.items[0].product.name === "Lifetime") {
        dbUser.subscriptionEndDate = new Date(0);
    }
    else if (eventData?.items[0].product.name === "Pro-y") {
        if (subscriptionEndDate?.getTime() === invalidDate?.getTime()) {
            //365 days from today
            subscriptionEndDate = new Date();
            subscriptionEndDate.setDate(subscriptionEndDate.getDate() + 365);

        }
        else {
            //365 days from current sunscription end date 
            subscriptionEndDate?.setDate(subscriptionEndDate?.getDate() + 365);
        }
        dbUser.subscriptionEndDate = subscriptionEndDate;

    }

    await dbUser.save();

    return NextResponse.json({ message: "Subscription updated successfully" }, { status: 200 });


};