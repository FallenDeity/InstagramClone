import { useSession } from "next-auth/react";
import React from "react";

import MiniProfile from "./MiniProfile";
import Posts from "./Posts";
import Stories from "./Stories";
import Suggestions from "./Suggestions";

export default function Feed(): React.JSX.Element {
	const { data: session } = useSession();
	return (
		<main
			className={`grid grid-cols-1 md:grid-cols-2 md:max-w-3xl xl:grid-cols-3 xl:max-w-6xl mx-auto ${
				// eslint-disable-next-line @typescript-eslint/restrict-template-expressions
				!session && "!grid-cols-1 !max-w-3xl"
			}`}>
			<section className="col-span-2">
				<Stories />
				<Posts />
			</section>
			{session && (
				<section className="md:col-span-1 hidden xl:inline-grid">
					<div className="fixed">
						<MiniProfile />
						<Suggestions />
					</div>
				</section>
			)}
		</main>
	);
}
