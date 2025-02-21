
import dbConnect from "@/lib/dbConnect";
import { NextResponse } from "next/server";
import { canCreateSpace } from "@/lib/featureAccess";
import { getServerSession } from "next-auth";
import { Types } from "mongoose";
import { authOptions } from "../auth/[...nextauth]/options";
import Space from "@/models/Space";
import User from "@/models/User";
import { generateUniqueLink } from "@/lib/generateUniqueLink";

//for fetching all spaces of the user
////http://localhost:3000/api/space  -> if no spaceid given then returns all spaces of user
//http://localhost:3000/api/space?id=dswajhdkhagd -> if spaceid given ythen returns that particular space
//userid will be taken from token
export async function GET(request: Request) {

    await dbConnect();

    try {

        const session = await getServerSession(authOptions);
        if (!session || !session?.user) {
            return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
        }

        const url = new URL(request.url);
        const spaceId = url.searchParams.get("id"); // check if `id` is passed as a query parameter.
        //if spaceId not found then all the spaces of user will be returned
        //convert string to ovjectid
        const userId = new Types.ObjectId(session?.user?.id);
        if (!userId) {
            return NextResponse.json({ message: "Something is wrong with your user session we cant fetch userid" }, { status: 401 });
        }
        if (spaceId) {
            // Fetch a specific space by ID
            const spaceFromDb = await Space.findOne({ _id: spaceId, owner: userId }).exec();

            if (!spaceFromDb) {
                return NextResponse.json({ message: "Either this space does not exist or you are not the owner of it" }, { status: 404 });
            }

            return NextResponse.json({ message: "Successfully fetched space", space: spaceFromDb });
        }
        else {
            // Fetch all spaces for the user
            const allSpacesOfUserFromDb = await Space.aggregate([
                {
                    $match: {
                        owner: userId,
                    },
                },
                {//For every space found, this counts how many testimonials it has and adds that number as testimonialsCount.
                    $addFields: {
                        testimonialsCount: {
                            $size: {
                                $ifNull: ["$testimonials", []]
                            },
                        },
                    },
                },
            ]);

            if (allSpacesOfUserFromDb.length === 0) {
                return NextResponse.json({ message: "No spaces found" }, { status: 200 });
            }

            return NextResponse.json({ message: "Successfully fetched spaces", spaces: allSpacesOfUserFromDb });
        }
    } catch (error) {
        return NextResponse.json(
            { message: "Error getting spaces", error },
            { status: 500 }
        );
    }
};

//for creating space for the user
//http://localhost:3000/api/space 

export async function POST(request: Request) {
    await dbConnect();
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session?.user) {
            return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
        }
        const body = await request.json();
        const spaceName = body.name;
        if (spaceName) {
            return NextResponse.json(
                { message: "Space Name is Required" },
                { status: 400 }
            );
        }
        const userId = new Types.ObjectId(session?.user?.id);
        const existingSpace = await Space.findOne({
            owner: userId,
            name: { $regex: new RegExp(`^${spaceName}$`, "i") },
        });
        //all space names for a particular user should be unique as unique link will be created by owner uniquename and spacename
        if (existingSpace) {
            return NextResponse.json(
                { message: "You have already taken this Space name. Please choose another one." },
                { status: 400 }
            );
        }

        const userInDb = await User.findById(userId);
        if (!userInDb) {
            return NextResponse.json({ message: "Something is wrong with your user session we cant fetch userid" }, { status: 401 });
        }

        const allowedToCreateSpace = canCreateSpace(userInDb.subscriptionTier, userInDb.spaces.length);

        if (!allowedToCreateSpace) {
            return NextResponse.json({ message: "You have reached the limit of creating space, Upgrade your Subscription to continue" }, { status: 400 });
        }

        const ownerUniqueName = userInDb.name;
        const uniqueLink = generateUniqueLink(ownerUniqueName, spaceName);

        const spacePayload = {
            name: spaceName,
            owner: userId,
            testimonials: [],
            isNewSpace: true,
            uniqueLink: uniqueLink,
            createdAt: new Date(Date.now()),
        }

        const createdSpace = await Space.create(spacePayload);

        if (!createdSpace) {
            return NextResponse.json({ message: "Error creating space" }, { status: 400 });
        }

        const updateComplete = await User.findByIdAndUpdate({ _id: userId }, { $push: { spaces: createdSpace._id } });

        if (updateComplete?.errors) {
            return NextResponse.json(
                { message: "error adding space to user object" },
                { status: 400 }
            );
        }

        return NextResponse.json({ message: "Space created successfully", space: createdSpace });
    } catch (error) {
        return NextResponse.json(
            { message: "Error creating space", error },
            { status: 400 }
        );
    }
};
