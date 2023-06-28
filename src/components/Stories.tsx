import { faker } from "@faker-js/faker";
import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";

import { User } from "../utils/models";
import Story from "./Story";

export default function Stories(): React.JSX.Element {
	const [suggestions, setSuggestions] = useState<User[]>([]);
	const { data: session } = useSession();
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
				timestamp: faker.date.past(),
			});
		}
		setSuggestions(suggestions);
	}, []);
	return (
		<div className="flex space-x-2 p-6 bg-white mt-4 md:mt-8 border-gray-200 rounded-sm overflow-x-scroll scrollbar-thin scrollbar-thumb-gray-200 shadow-sm">
			{session && <Story image={String(session.user?.image)} username={String(session.user?.name)} />}
			{suggestions.map((suggestion) => (
				<Story key={suggestion.id} image={suggestion.avatar} username={suggestion.username} />
			))}
		</div>
	);
}
