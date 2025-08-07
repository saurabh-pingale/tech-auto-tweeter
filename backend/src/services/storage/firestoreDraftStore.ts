import { Firestore } from "@google-cloud/firestore";
import { DraftStorePort } from "./DraftStorePort";
import { FIRESTORE } from "../../constants/constants";
import { env } from "../../config/env";

export class FirestoreDraftStore implements DraftStorePort {
    private col;

    constructor(db?: Firestore) {
        const firestore =
            db ??
            (env.FIREBASE_PROJECT_ID && env.FIREBASE_CLIENT_EMAIL && env.FIREBASE_PRIVATE_KEY
              ? new Firestore({
                  projectId: env.FIREBASE_PROJECT_ID,
                  credentials: {
                    client_email: env.FIREBASE_CLIENT_EMAIL,
                    private_key: env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
                  },
                })
              : new Firestore());
            
        this.col = firestore.collection(FIRESTORE.COLLECTION);
    }

    async getOneAndDelete(): Promise<string | null> {
        const snap = await this.col.orderBy('createdAt', 'asc').limit(1).get();
        if (snap.empty) return null;
        
        const doc = snap.docs[0];
        const data = doc.data();
        await doc.ref.delete();

        return data.text as string;
    }

    async saveMany(texts: string[]): Promise<void> {
        const batch = this.col.firestore.batch();

        texts.forEach((text) => {
            const ref = this.col.doc();
            batch.set(ref, { text, createdAt: new Date().toISOString() });
        });
        await batch.commit();
    }
}