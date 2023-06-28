import { collection, doc, getDoc, onSnapshot, orderBy, query } from "firebase/firestore";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";

import Footer from "../../../../components/Footer";
import CustomHead from "../../../../components/Head";
import Header from "../../../../components/Header";
import MiniProfile from "../../../../components/MiniProfile";
import Modal from "../../../../components/Modal";
import Post from "../../../../components/Post";
import Stories from "../../../../components/Stories";
import Suggestions from "../../../../components/Suggestions";
import { db } from "../../../../utils/firebase";
import { PostModel, User, UserSession } from "../../../../utils/models";

export default function Posts(): React.JSX.Element {
	const router = useRouter();
	const { id } = router.query;
	const targetAnchor = router.asPath.split("#").length ? router.asPath.split("#")[1] : "";
	const [posts, setPosts] = useState<PostModel[]>([]);
	const [user, setUser] = useState<User | null>(null);
	const { data: session }: { data: UserSession | null | undefined } = useSession();
	useEffect(() => {
		onSnapshot(doc(db, "users", id as string), (doc) => {
			setUser(doc.data() as User);
		});
	}, [db, id]);
	useEffect(() => {
		onSnapshot(query(collection(db, "posts"), orderBy("timestamp", "desc")), (snapshot) => {
			const _posts = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as PostModel));
			// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
			const _filteredPosts = _posts.filter((post) => post.userid === id && post.image && post.timestamp);
			setPosts(_filteredPosts);
		});
	}, [db, id]);
	useEffect(() => {
		if (targetAnchor) {
			// wait for the page to be rendered
			setTimeout(() => {
				const element = document.getElementById(targetAnchor);
				element?.scrollIntoView({ behavior: "smooth" });
			}, 3000);
		}
	}, [targetAnchor]);
	return (
		<>
			<CustomHead title={`${String(user?.username)}'s Posts`} />
			<div className="bg-gray-50 h-screen overflow-y-scroll scrollbar-hide">
				<Header />
				<main
					className={`h-screen grid grid-cols-1 md:grid-cols-2 md:max-w-3xl xl:grid-cols-3 xl:max-w-6xl mx-auto ${
						// eslint-disable-next-line @typescript-eslint/restrict-template-expressions
						!session && "!grid-cols-1 !max-w-3xl"
					}`}>
					<section className="col-span-2">
						<Stories />
						<div>
							{posts.map((post) => (
								<Post key={post.id} post={post} />
							))}
						</div>
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
				<Modal />
				<Footer />
			</div>
		</>
	);
}

export async function getServerSideProps({
	params,
}: {
	params: { id: string };
}): Promise<{ props: { id: string } } | { notFound: boolean }> {
	const docRef = doc(db, "users", params.id);
	const docSnap = await getDoc(docRef);
	if (!docSnap.exists()) {
		return {
			notFound: true,
		};
	}
	return {
		props: {
			id: params.id,
		},
	};
}
