import { faker } from "@faker-js/faker";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";

import { db } from "@/utils/firebase";
import { User, UserSession } from "@/utils/models";

import Story from "./Story";

export default function Stories(): React.JSX.Element {
	const [suggestions, setSuggestions] = useState<User[]>([]);
	const { data: session }: { data: UserSession | null | undefined } = useSession();
	const [userData, setUserData] = useState<User>();
	useEffect((): void => {
		if (session) {
			onSnapshot(
				query(collection(db, "users"), where("__name__", "==", String(session.user?.uid))),
				(snapshot) => {
					const _userData = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as User));
					setUserData(_userData[0]);
				}
			);
		}
	}, [session, db]);
	useEffect(() => {
		const suggestions: User[] = [];
		for (let i = 0; i < 20; i++) {
			suggestions.push({
				id: String(i),
				username: faker.internet.userName(),
				email: faker.internet.email(),
				avatar: faker.internet.avatar(),
				following: [],
				followers: [],
				description: faker.lorem.sentence(),
				timestamp: faker.date.past(),
			});
		}
		setSuggestions(suggestions);
	}, []);
	return (
		<div className="flex space-x-2 p-6 bg-white mt-4 md:mt-8 border-gray-200 rounded-sm overflow-x-scroll scrollbar-thin scrollbar-thumb-gray-200 shadow-sm">
			{session && (
				<Story
					image={String(userData?.avatar ?? session.user?.image)}
					username={String(userData?.username ?? session.user?.name)}
				/>
			)}
			{suggestions.map((suggestion) => (
				<Story key={suggestion.id} image={suggestion.avatar} username={suggestion.username} />
			))}
		</div>
	);
}
