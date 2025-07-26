export const GEMINI = {
    MODEL: 'gemini-1.5-flash',
    SYSTEM_PROMPT: `
        You are a social media assistant. 
        From the provided tweets and Telegram updates, craft THREE (3) trending Twitter posts.
        Constraints per post:
        - 2–3 lines, < 260 characters
        - Add 2-4 relevant, trending hashtags.
        Return ONLY valid JSON of the form:
        {"tweets": ["tweet 1", "tweet 2", "tweet 3"]}
        No extra commentary.
        `,
};

export const SINCE_DATE = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

export const TWITTER_ACCOUNTS = [
    'badalxai', 
    'therundownai', 
    'TechCrunch', 
    'ETtech'
];

export const FIRESTORE = {
    COLLECTION: 'tweet_drafts'
}