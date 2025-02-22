
"use server";

import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import Space from "@/models/Space";
import { getServerSession } from "next-auth";

export async function getTotalSpaces() {
    await dbConnect();
    const session = await getServerSession(authOptions);
    if (!session) return 0;
    const userId = session.user?.id;
    const totalSpaces = await Space.find({ owner: userId }).countDocuments();
    return totalSpaces;
}

export async function deleteSpace() {

}
