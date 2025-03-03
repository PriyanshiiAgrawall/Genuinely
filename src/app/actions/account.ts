"use server"


import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import { Types } from "mongoose";


export async function getSubTier(spaceOwner: string) {
    await dbConnect();
    try {
        const userId = new Types.ObjectId(spaceOwner);
        const user = await User.findById(userId).lean();
        if (!user) {
            throw new Error("User not found.");
        }
        return user.subscriptionTier.toString();

    }
    catch (error) {
        console.error("Error fetching subscription tier od user", error);
        throw error;
    }

}




