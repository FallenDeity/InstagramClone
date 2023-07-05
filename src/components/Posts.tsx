import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import React, { useEffect, useState } from "react";

import { db } from "@/utils/firebase";
import { PostModel } from "@/utils/models";

import Post from "./Post";

export default function Posts(): React.JSX.Element {
	const [posts, setPosts] = useState<PostModel[]>([]);
	useEffect(() => {
		onSnapshot(query(collection(db, "posts"), orderBy("timestamp", "desc")), (snapshot) => {
			const _posts = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as PostModel));
			// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
			setPosts(_posts ?? []);
		});
	}, [db]);
	return (
		<div>
			{posts.map((post) => (
				<Post key={post.id} post={post} />
			))}
		</div>
	);
}
