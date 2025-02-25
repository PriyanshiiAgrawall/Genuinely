//for fetching space with space id
//http://localhost:3000/api/space/ndhwjbdhedgv6y7
//this is spaceId

import { NextResponse } from 'next/server';

import dbConnect from '@/lib/dbConnect';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/options';
import Space from '@/models/Space';

export async function GET(req: Request, params: any) {
    dbConnect();

    try {
        console.log("this got triggered");
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({
                success: false,
                message: "Not Authenticated"
            }, {
                status: 400,
            })
        }
        console.log(session);

        //extract spaceId from url
        console.log(params);
        const { spaceId } = params.spaceId;
        console.log("spaceid", spaceId)
        if (!spaceId) {
            return NextResponse.json(
                { success: false, message: "No space ID provided" },
                { status: 400 }
            );
        }
        const spaceFromDb = await Space.findById({ _id: spaceId });

        if (!spaceFromDb) {
            return NextResponse.json(
                { success: false, message: "Space not found" },
                { status: 404 }
            );
        }

        const sessionUser = session.user;
        if (sessionUser.id.toString() != spaceFromDb.owner.toString()) {
            return NextResponse.json(
                { success: false, message: "Unauthorized: You do not own this space" },
                { status: 403 }
            );

        }

        return NextResponse.json({ message: 'Successfully fetched space', space: spaceFromDb }, {
            status: 200,
        });


    }
    catch (error) {
        console.error("Error getting space:", error);
        return NextResponse.json(
            {
                success: false,
                message: "Error getting space", error
            },
            { status: 500 }
        );
    }
};