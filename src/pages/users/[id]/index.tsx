import "react-loading-skeleton/dist/skeleton.css";

import {
	ArrowsPointingOutIcon,
	BookmarkIcon,
	NoSymbolIcon,
	Squares2X2Icon,
	UserCircleIcon,
} from "@heroicons/react/24/outline";
import { Cog6ToothIcon } from "@heroicons/react/24/solid";
import assert from "assert";
import { collection, doc, getDoc, onSnapshot, orderBy, query, updateDoc, where } from "firebase/firestore";
import ErrorPage from "next/error";
import Image from "next/image";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import React, { createRef, useEffect, useState } from "react";
import Skeleton from "react-loading-skeleton";
import { BeatLoader } from "react-spinners";
import { useRecoilState } from "recoil";

import { editProfileModalState } from "@/components/atoms/modalAtom";
import EditProfileModal from "@/components/EditProfileModal";
import Footer from "@/components/Footer";
import CustomHead from "@/components/Head";
import Header from "@/components/Header";
import Modal from "@/components/Modal";
import { db } from "@/utils/firebase";
import { PostModel, User, UserSession } from "@/utils/models";

export default function Users({ user }: { user: User }): React.JSX.Element {
	user.timestamp = new Date(String(user.timestamp));
	const { data: session }: { data: UserSession | null | undefined } = useSession();
	// eslint-disable-next-line @typescript-eslint/no-empty-function
	const [followers, setUserFollowers] = useState<string[]>(user.followers);
	const [loading, setLoading] = useState(false);
	const [currentIdx, setCurrentIdx] = useState<number>(0);
	const [userData, setUserData] = useState<User>(user);
	const [posts, setUserPosts] = useState<PostModel[]>([]);
	const [bookmarks, setUserBookmarks] = useState<PostModel[]>([]);
	const data = [posts, bookmarks, []];
	const dataList = createRef<HTMLUListElement>();
	const setEditProfileOpen = useRecoilState(editProfileModalState)[1];
	const switchType = (idx: number): void => {
		setCurrentIdx(idx);
		for (const li of dataList.current?.children as unknown as HTMLLIElement[]) {
			li.className = "";
		}
		"md:border-t md:border-gray-700 md:-mt-px md:text-gray-700".split(" ").forEach((className) => {
			dataList.current?.children[idx].classList.add(className);
		});
	};
	const followUser = async (e: React.MouseEvent<HTMLButtonElement>): Promise<void> => {
		e.preventDefault();
		if (loading) return;
		setLoading(true);
		assert(session);
		const self = await getDoc(doc(db, "users", String(session.user?.uid)));
		const toFollow = await getDoc(doc(db, "users", user.id));
		const toFollowData = toFollow.data() as User;
		const selfData = self.data() as User;
		// followers is a list of user objects
		if (toFollowData.followers.some((follower) => follower === session.user?.uid)) {
			const newFollowers = followers.filter((follower) => follower !== session.user?.uid);
			setUserFollowers(newFollowers);
			await updateDoc(doc(db, "users", String(session.user?.uid)), {
				following: selfData.following.filter((following) => following !== user.id),
			});
			await updateDoc(doc(db, "users", user.id), {
				followers: toFollowData.followers.filter((follower) => follower !== session.user?.uid),
			});
		} else {
			toFollowData.followers.push(String(session.user?.uid));
			setUserFollowers(toFollowData.followers);
			await updateDoc(doc(db, "users", String(session.user?.uid)), {
				following: [...selfData.following, user.id],
			});
			await updateDoc(doc(db, "users", user.id), {
				followers: toFollowData.followers,
			});
		}
		setLoading(false);
	};
	useEffect((): void => {
		onSnapshot(query(collection(db, "users"), where("__name__", "==", user.id)), (snapshot) => {
			const _userData = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as User));
			setUserData(_userData[0]);
		});
	}, [user.id, db]);
	useEffect(() => {
		// eslint-disable-next-line @typescript-eslint/no-misused-promises
		onSnapshot(query(collection(db, "posts"), orderBy("timestamp", "desc")), async (snapshot) => {
			const _posts = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as PostModel));
			// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
			const _filteredPosts = _posts.filter((post) => post.userid === user.id);
			setUserPosts(_filteredPosts);
			const _bookmarks: PostModel[] = [];
			for (const _doc of _posts) {
				const _cbookmarks = await getDoc(doc(db, "posts", _doc.id, "bookmarks", user.id));
				if (_cbookmarks.exists()) {
					_bookmarks.push(_doc);
				}
				// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
				setUserBookmarks(_bookmarks);
			}
		});
	}, [db, user.id]);
	if (user.id) {
		return (
			<>
				<CustomHead
					title={`${String(userData.username || user.username)} (@${String(
						userData.username || user.username
					)})`}
				/>
				<div className="h-screen overflow-y-scroll scrollbar-hide bg-gray-50">
					<Header />
					<main className="bg-gray-100 bg-opacity-25 h-screen">
						<div className="lg:w-8/12 lg:mx-auto mb-8">
							<header className="flex flex-wrap items-center p-4 md:py-8">
								<div className="md:w-3/12 md:ml-16">
									<Image
										width={500}
										height={500}
										className="w-20 h-20 md:w-40 md:h-40 object-cover rounded-full
                     border-2 border-pink-600 p-1"
										src={userData.avatar || "/user.png"}
										alt="profile"
									/>
								</div>
								<div className="w-8/12 md:w-7/12 ml-4">
									<div className="md:flex md:flex-wrap md:items-center mb-4">
										<h2 className="text-3xl inline-block font-light md:mr-2 mb-2 sm:mb-0">
											{userData.username || user.username || <Skeleton />}
										</h2>
										<span
											className="inline-block fas fa-certificate fa-lg text-blue-500
                               relative mr-6 text-xl transform -translate-y-2"
											aria-hidden="true">
											<i
												className="fas fa-check text-white text-xs absolute inset-x-0
                               ml-1 mt-px"></i>
										</span>
										{session &&
											(session.user?.uid === user.id ? (
												<>
													<button
														onClick={(): void => setEditProfileOpen(true)}
														className="bg-blue-500 px-2 py-1 font-semibold text-sm mt-2 md:py-1.5 hover:bg-blue-400 text-white
									               rounded block text-center sm:inline-block sm:mt-0 sm:ml-2 w-full md:w-auto">
														<Cog6ToothIcon className="h-5 w-5 inline-block mr-1" />
														Edit Profile
													</button>
													<button
														className="border border-gray-300 px-2 py-1 font-semibold text-sm mt-2 md:py-1.5 hover:bg-gray-200
									               rounded block text-center sm:inline-block sm:mt-0 sm:ml-2 w-full md:w-auto"
														/* eslint-disable-next-line @typescript-eslint/no-misused-promises,@typescript-eslint/explicit-function-return-type */
														onClick={() => signOut()}>
														<ArrowsPointingOutIcon className="h-5 w-5 inline-block mr-1" />
														Sign Out
													</button>
												</>
											) : (
												<>
													<button
														/* eslint-disable-next-line @typescript-eslint/no-misused-promises */
														onClick={followUser}
														disabled={loading}
														className="bg-blue-500 px-2 py-1 mt-2 w-full md:w-auto
                        text-white font-semibold text-sm rounded block text-center md:py-1.5
                        sm:inline-block hover:bg-blue-600 sm:mt-0 sm:ml-2 disabled:bg-gray-300 disabled:cursor-not-allowed">
														<p className="inline-block">
															{loading && (
																<BeatLoader
																	color="white"
																	size={4}
																	className="inline-flex mr-2"
																/>
															)}
															{followers.some(
																(follower) => follower === session.user?.uid
															)
																? "Unfollow"
																: "Follow"}
														</p>
													</button>
													<button
														className="border border-gray-300 px-2 py-1 font-semibold text-sm mt-2 md:py-1.5 hover:bg-gray-100
									               rounded block text-center sm:inline-block sm:mt-0 sm:ml-2 w-full md:w-auto">
														Message
													</button>
												</>
											))}
									</div>
									<ul className="hidden md:flex space-x-10 mb-4">
										<li>
											<span className="font-semibold mr-1">{posts.length}</span>
											posts
										</li>
										<li>
											<span className="font-semibold mr-1">{followers.length}</span>
											followers
										</li>
										<li>
											<span className="font-semibold mr-1">{user.following.length}</span>
											following
										</li>
									</ul>
									<div className="hidden md:block">
										<h1 className="font-semibold">
											{userData.username || user.username || <Skeleton />}
										</h1>
										{!userData.description ? (
											<span className="text-gray-600">No bio provided...</span>
										) : (
											// replace newlines with <br /> tags
											<span
												className="text-gray-600 whitespace-pre-line"
												dangerouslySetInnerHTML={{
													__html: userData.description.replace(/\n/g, "<br />"),
												}}></span>
										)}
									</div>
								</div>
								<div className="md:hidden text-sm my-2">
									<h1 className="font-semibold">{userData.username || user.username}</h1>
									{!userData.description ? (
										<span className="text-gray-600">No bio provided...</span>
									) : (
										// replace newlines with <br /> tags
										<span
											className="text-gray-600 whitespace-pre-line"
											dangerouslySetInnerHTML={{
												__html: userData.description.replace(/\n/g, "<br />"),
											}}></span>
									)}
								</div>
							</header>
							<div className="px-px md:px-3">
								<ul
									className="flex md:hidden justify-around space-x-8 border-t
                text-center p-2 text-gray-600 leading-snug text-sm">
									<li>
										<span className="font-semibold text-gray-800 block">{posts.length}</span>
										posts
									</li>
									<li>
										<span className="font-semibold text-gray-800 block">{followers.length}</span>
										followers
									</li>
									<li>
										<span className="font-semibold text-gray-800 block">
											{user.following.length}
										</span>
										following
									</li>
								</ul>
								<ul
									ref={dataList}
									className="flex items-center justify-around md:justify-center space-x-12
                    uppercase tracking-widest font-semibold text-xs text-gray-600
                    border-t">
									<li className="md:border-t md:border-gray-700 md:-mt-px md:text-gray-700">
										<div
											className="inline-block p-3 space-x-2 cursor-pointer"
											onClick={(): void => switchType(0)}>
											<Squares2X2Icon className="h-5 w-5 inline-flex" />
											<p className="hidden md:inline align-middle">posts</p>
										</div>
									</li>
									<li>
										<div
											className="inline-block p-3 space-x-2 cursor-pointer"
											onClick={(): void => switchType(1)}>
											<BookmarkIcon className="h-5 w-5 inline-flex" />
											<span className="hidden md:inline align-middle">saved</span>
										</div>
									</li>
									<li>
										<div
											className="inline-block p-3 space-x-2 cursor-pointer"
											onClick={(): void => switchType(2)}>
											<UserCircleIcon className="h-5 w-5 inline-flex" />
											<span className="hidden md:inline align-middle">tagged</span>
										</div>
									</li>
								</ul>
								<div className="flex flex-wrap -mx-px md:-mx-3 h-[400px]">
									{!data[currentIdx].length && (
										<div className="w-full flex flex-col justify-center items-center">
											<NoSymbolIcon className="h-24 w-24 text-gray-600" />
											<p className="text-gray-600 text-2xl">No posts yet</p>
										</div>
									)}
									{data[currentIdx].map((post) => (
										<div className="w-1/3 p-px md:px-3 cursor-pointer" key={post.id}>
											<Link href={`/users/${post.userid}/posts#${post.id}`}>
												<article className="post bg-gray-100 text-white relative pb-full md:mb-6">
													{post.image ? (
														<Image
															className="w-full h-full absolute left-0 top-0 object-cover"
															width={500}
															height={500}
															src={post.image}
															alt="image"
														/>
													) : (
														<Skeleton className="w-full h-full absolute left-0 top-0 object-cover" />
													)}
													<i className="fas fa-square absolute right-0 top-0 m-1"></i>
													<div
														className="overlay bg-gray-800 bg-opacity-25 w-full h-full absolute
                                left-0 top-0 hidden"></div>
												</article>
											</Link>
										</div>
									))}
									<div className="h-[250px]" />
								</div>
							</div>
						</div>
					</main>
					<EditProfileModal />
					<Modal />
					<Footer />
				</div>
			</>
		);
	}
	return <ErrorPage statusCode={404} />;
}

export async function getServerSideProps({
	params,
}: {
	params: { id: string };
}): Promise<{ props: { user: User } } | { notFound: boolean }> {
	const docRef = doc(db, "users", params.id);
	const docSnap = await getDoc(docRef);
	const user: User = docSnap.data() as User;
	if (docSnap.exists()) {
		user.id = docSnap.id;
		if ("seconds" in user.timestamp) {
			// eslint-disable-next-line @typescript-eslint/ban-ts-comment
			// @ts-expect-error
			user.timestamp = new Date(user.timestamp.seconds * 1000).toISOString();
		}
		return {
			props: {
				user: user,
			},
		};
	}
	return {
		notFound: true,
	};
}
