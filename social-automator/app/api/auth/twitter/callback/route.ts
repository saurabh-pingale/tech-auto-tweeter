import { NextRequest, NextResponse } from 'next/server';
import { TwitterApi } from 'twitter-api-v2';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const oauth_token = searchParams.get('oauth_token');
    const oauth_verifier = searchParams.get('oauth_verifier');

    const cookie_oauth_token = req.cookies.get('oauth_token')?.value;
    const oauth_token_secret = req.cookies.get('oauth_token_secret')?.value;
    
    const frontendUrl = process.env.NEXT_PUBLIC_FRONTEND_URL || '';

    if (!oauth_token || !oauth_verifier || !cookie_oauth_token || !oauth_token_secret || oauth_token !== cookie_oauth_token) {
        return NextResponse.redirect(`${frontendUrl}/login?error=auth-failed`);
    }

    try {
        const client = new TwitterApi({
            appKey: process.env.TWITTER_APP_KEY!,
            appSecret: process.env.TWITTER_APP_SECRET!,
            accessToken: oauth_token,
            accessSecret: oauth_token_secret,
        });

        const { client: loggedInClient, accessToken, accessSecret, screenName, userId } = await client.login(oauth_verifier);
        const { data: userObject } = await loggedInClient.v2.me({ 'user.fields': ['profile_image_url', 'name'] });

        if (!userObject) {
            return NextResponse.redirect(`${frontendUrl}/login?error=user-not-found`);
        }
        
        await dbConnect();

        const userData = {
            _id: userId,
            screenName,
            name: userObject.name,
            profileImageUrl: userObject.profile_image_url || '',
            accessToken,
            accessSecret,
        };

        await User.findByIdAndUpdate(userId, userData, { upsert: true, new: true });

        const response = NextResponse.redirect(`${frontendUrl}/dashboard?userId=${userId}`);

        response.cookies.delete('oauth_token');
        response.cookies.delete('oauth_token_secret');

        return response;

    } catch (error) {
        console.error("Error in Twitter callback:", error);
        return NextResponse.redirect(`${frontendUrl}/login?error=callback-failed`);
    }
}