import { NextResponse } from 'next/server';
import { TwitterApi } from 'twitter-api-v2';

export async function POST() {
    const { TWITTER_APP_KEY, TWITTER_APP_SECRET, TWITTER_CALLBACK_URL } = process.env;

    if (!TWITTER_APP_KEY || !TWITTER_APP_SECRET || !TWITTER_CALLBACK_URL) {
        return NextResponse.json({ message: "Server configuration error." }, { status: 500 });
    }

    try {
        const client = new TwitterApi({ appKey: TWITTER_APP_KEY, appSecret: TWITTER_APP_SECRET });
        const authLink = await client.generateAuthLink(TWITTER_CALLBACK_URL, { linkMode: 'authorize' });

        const response = NextResponse.json({ authUrl: authLink.url });
        
        response.cookies.set('oauth_token', authLink.oauth_token, { httpOnly: true, secure: process.env.NODE_ENV === 'production', path: '/' });
        response.cookies.set('oauth_token_secret', authLink.oauth_token_secret, { httpOnly: true, secure: process.env.NODE_ENV === 'production', path: '/' });

        return response;
    } catch (error) {
        console.error("Error generating auth link:", error);
        return NextResponse.json({ message: "Failed to generate Twitter auth link." }, { status: 500 });
    }
}