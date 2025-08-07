import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User, { IUser } from '@/models/User';

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');

    if (!userId) {
        return NextResponse.json({ message: 'User ID is required.' }, { status: 400 });
    }

    try {
        await dbConnect();
        const user: IUser | null = await User.findById(userId).lean<IUser>();

        if (!user) {
            return NextResponse.json({ message: 'User not found.' }, { status: 404 });
        }
        
        const { accessToken, accessSecret, _id, ...safeUser } = user;
        
        return NextResponse.json({ id: _id, ...safeUser });
    } catch (error) {
        console.error("Error fetching user:", error);
        return NextResponse.json({ message: 'Failed to fetch user data.' }, { status: 500 });
    }
}