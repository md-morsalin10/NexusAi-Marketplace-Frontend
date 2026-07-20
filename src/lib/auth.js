import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "better-auth/adapters/mongodb";

const client = new MongoClient(process.env.MONGODB_URI);
const db = client.db("GadgetHub");

export const auth = betterAuth({
    database: mongodbAdapter(db, {
        // Optional: if you don't provide a client, database transactions won't be enabled.
        client
    }),
    emailAndPassword: {
        enabled: true,
    },
    user: {
        // fields এর জায়গায় additionalFields ব্যবহার করুন
        additionalFields: {
            role: {
                type: "string",
                defaultValue: "buyer",
                input: true, // ক্লায়েন্ট থেকে ইনপুট রিড করার অনুমতি দেয়
            },
        },
    },
});