import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import NextAuth, { Session } from "next-auth";
import Google from "next-auth/providers/google";

import { db } from "@/utils/firebase";

// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
export default NextAuth({
	providers: [
		Google({
			clientId: String(process.env.GOOGLE_CLIENT_ID),
			clientSecret: String(process.env.GOOGLE_CLIENT_SECRET),
		}),
	],
	/*
	theme: {
		logo: "https://links.papareact.com/sq0",
		brandColor: "#F13287",
		colorScheme: "auto",
	},
	*/
	pages: {
		signIn: "/auth/signin",
	},
	callbacks: {
		// eslint-disable-next-line @typescript-eslint/require-await
		async session({ session, token }): Promise<Session> {
			// eslint-disable-next-line @typescript-eslint/ban-ts-comment
			// @ts-expect-error
			session.user.name = session.user.name?.split(" ").join("").toLocaleLowerCase();
			// eslint-disable-next-line @typescript-eslint/ban-ts-comment
			// @ts-expect-error
			session.user.uid = token.sub;
			// 1) check if user is in users collection in db
			// eslint-disable-next-line @typescript-eslint/no-unsafe-argument,@typescript-eslint/ban-ts-comment
			// @ts-expect-error
			const userDoc = await getDoc(doc(db, "users", String(session.user.uid)));
			// 2) if not, create user in db
			if (!userDoc.exists()) {
				// eslint-disable-next-line @typescript-eslint/no-unsafe-argument,@typescript-eslint/ban-ts-comment
				// @ts-expect-error
				await setDoc(doc(db, "users", String(session.user.uid)), {
					// eslint-disable-next-line @typescript-eslint/ban-ts-comment
					// @ts-expect-error
					username: session.user.name,
					// eslint-disable-next-line @typescript-eslint/ban-ts-comment
					// @ts-expect-error
					email: session.user.email,
					// eslint-disable-next-line @typescript-eslint/ban-ts-comment
					// @ts-expect-error
					avatar: session.user.image,
					following: [],
					followers: [],
					description: "",
					timestamp: serverTimestamp(),
				});
			}
			return session;
		},
	},
});
