import {NextResponse} from "next/server";
import connection from "@/lib/db";
import User from "@/lib/models/user";
import {Types} from "mongoose";

const ObjectId = require("mongoose").Types.ObjectId;

export const GET = async () => {
    try {
        await connection();
        const users = await User.find();
        return new NextResponse(JSON.stringify(users), {status: 200});
    } catch (error: any) {
        return new NextResponse(error.message, {status: 500});
    }
}

export const POST = async (request: Request) => {
    try {
        const body = await request.json();
        await connection();
        const user = await new User(body);
        await user.save();

        return new NextResponse(JSON.stringify({
                message: "New user is created",
                user: user
            }),
            {status: 200}
        );

    } catch (error: any) {
        return new NextResponse("Error in creating user" + error.message, {
            status: 500,
        });
    }
}

export const PATCH = async (request: Request) => {
    try {
        const body = await request.json();
        const {userId, newUsername} = body;

        await connection();
        if (!userId || !newUsername) {
            return new NextResponse(
                JSON.stringify({message: "ID or new username not found"}),
                {status: 400}
            );
        }

        if (!Types.ObjectId.isValid(userId)) {
            return new NextResponse(JSON.stringify({message: "Invalid User id"}), {
                status: 400,
            });
        }

        const updatedUser = await User.findOneAndUpdate(
            {_id: new ObjectId(userId)},
            {username: newUsername},
            {new: true}
        );

        if (!updatedUser) {
            return new NextResponse(
                JSON.stringify({message: "User not found in the database"}),
                {status: 400}
            );
        }

        return new NextResponse(
            JSON.stringify({message: "User is updated", user: updatedUser}),
            {status: 200}
        );
    } catch (error: any) {
        return new NextResponse("Error in updating user" + error.message, {
            status: 500,
        });
    }
};

export const DELETE = async (request: Request) => {
    try {
        const {searchParams} = new URL(request.url);
        const userId = searchParams.get("userId");

        if (!userId) {
            return new NextResponse(JSON.stringify({message: "ID not found"}), {
                status: 400,
            });
        }

        if (!Types.ObjectId.isValid(userId)) {
            return new NextResponse(JSON.stringify({message: "Invalid User id"}), {
                status: 400,
            });
        }

        await connection();

        const deletedUser = await User.findByIdAndDelete(
            new Types.ObjectId(userId)
        );

        if (!deletedUser) {
            return new NextResponse(
                JSON.stringify({message: "User not found in the database"}),
                {status: 400}
            );
        }

        return new NextResponse(
            JSON.stringify({message: "User is deleted", user: deletedUser}),
            {status: 200}
        );
    } catch (error: any) {
        return new NextResponse("Error in deleting user" + error.message, {
            status: 500,
        });
    }
};