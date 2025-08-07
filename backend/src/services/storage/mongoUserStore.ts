import { MongoClient } from 'mongodb';
import { env } from '../../config/env';

export interface TwitterUserData {
    id: string;
    screenName: string;
    name: string;
    profileImageUrl: string;
    accessToken: string;
    accessSecret: string;
}

const USERS_COLLECTION = 'users';

export class MongoUserStore {
    private async getDb() {
        if (!env.MONGODB_URI) {
            throw new Error('MONGODB_URI is not defined in environment variables.');
        }
        const client = new MongoClient(env.MONGODB_URI);
        await client.connect();
        return client.db();
    }

    async getAllUsers(): Promise<TwitterUserData[]> {
        const db = await this.getDb();
        const users = await db.collection(USERS_COLLECTION).find({}).toArray();

        return users.map(user => ({
            id: user._id.toString(),
            screenName: user.screenName,
            name: user.name,
            profileImageUrl: user.profileImageUrl,
            accessToken: user.accessToken,
            accessSecret: user.accessSecret,
        }));
    }
}