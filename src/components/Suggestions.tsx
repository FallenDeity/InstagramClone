import { faker } from "@faker-js/faker";
import Image from "next/image";
import React, { useEffect, useState } from "react";

import { User } from "@/utils/models";

interface CompanyUser extends User {
	company: string;
}

export default function Suggestions(): React.JSX.Element {
	const [suggestions, setSuggestions] = useState<CompanyUser[]>([]);
	useEffect(() => {
		const suggestions: CompanyUser[] = [];
		for (let i = 0; i < 5; i++) {
			suggestions.push({
				id: String(i),
				username: faker.internet.userName(),
				email: faker.internet.email(),
				avatar: faker.internet.avatar(),
				company: faker.company.name(),
				followers: [],
				following: [],
				description: faker.lorem.sentence(),
				timestamp: faker.date.past(),
			});
		}
		setSuggestions(suggestions);
	}, []);
	return (
		<div className="mt-4 ml-10 p-3">
			<div className="flex justify-between mb-5 text-sm">
				<h3 className="text-sm text-gray-400 font-bold">Suggestions For You</h3>
				<button className="font-semibold text-blue-400">See All</button>
			</div>
			{suggestions.map((suggestion) => (
				<div key={suggestion.id} className="flex items-center justify-between mt-3">
					<Image
						className="rounded-full border p-[2px] w-10 h-10"
						src={suggestion.avatar}
						alt="Profile Picture"
						width={40}
						height={40}
					/>
					<div className="flex-1 ml-4">
						<h2 className="font-semibold text-sm">{suggestion.username}</h2>
						<h3 className="text-xs text-gray-400">Works at {suggestion.company}</h3>
					</div>
					<button className="text-blue-400 text-xs">Follow</button>
				</div>
			))}
		</div>
	);
}
