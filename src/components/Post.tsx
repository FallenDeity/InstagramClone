import "react-loading-skeleton/dist/skeleton.css";

import {
	BookmarkIcon,
	ChatBubbleOvalLeftIcon,
	EllipsisHorizontalIcon,
	FaceSmileIcon,
	HeartIcon,
	PaperAirplaneIcon,
} from "@heroicons/react/24/outline";
import { BookmarkIcon as BookmarkIconFilled, HeartIcon as HeartIconFilled } from "@heroicons/react/24/solid";
import assert from "assert";
import {
	addDoc,
	collection,
	deleteDoc,
	doc,
	onSnapshot,
	orderBy,
	query,
	serverTimestamp,
	setDoc,
	where,
} from "firebase/firestore";
import Image from "next/image";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import Skeleton from "react-loading-skeleton";
import Moment from "react-moment";

import { db } from "@/utils/firebase";
import { BookmarkModel, CommentModel, LikeModel, PostModel, User, UserSession } from "@/utils/models";

export default function Post({ post }: { post: PostModel }): React.JSX.Element {
	const { data: session }: { data: UserSession | null | undefined } = useSession();
	const router = useRouter();
	const [comments, setComments] = useState<CommentModel[]>([]);
	const [comment, setComment] = useState("");
	const [likes, setLikes] = useState<LikeModel[]>([]);
	const [bookmarks, setBookmarks] = useState<BookmarkModel[]>([]);
	const [userData, setUserData] = useState<User>();
	const [postUserData, setPostUserData] = useState<User>();
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
		onSnapshot(query(collection(db, "users"), where("__name__", "==", String(post.userid))), (snapshot) => {
			const _userData = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as User));
			setPostUserData(_userData[0]);
		});
	}, [session, post.userid, db]);
	useEffect((): void => {
		onSnapshot(query(collection(db, "posts", post.id, "likes"), orderBy("timestamp", "desc")), (snapshot) => {
			const _likes = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as LikeModel));
			// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
			const _filteredLikes = _likes.filter((like) => like.timestamp);
			setLikes(_filteredLikes);
		});
	}, [db, post.id]);
	useEffect((): void => {
		onSnapshot(query(collection(db, "posts", post.id, "comments"), orderBy("timestamp", "desc")), (snapshot) => {
			const _comms = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as CommentModel));
			for (const comm of _comms) {
				onSnapshot(query(collection(db, "users"), where("__name__", "==", String(comm.userid))), (snapshot) => {
					const _userData = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as User));
					comm.username = _userData[0].username;
					comm.avatar = _userData[0].avatar;
				});
			}
			// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
			const _filteredComms = _comms.filter((comm) => comm.timestamp);
			setComments(_filteredComms);
		});
	}, [db, post.id]);
	useEffect((): void => {
		onSnapshot(query(collection(db, "posts", post.id, "bookmarks"), orderBy("timestamp", "desc")), (snapshot) => {
			const _bookmarks = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as BookmarkModel));
			// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
			const _filteredBookmarks = _bookmarks.filter((bookmark) => bookmark.timestamp);
			setBookmarks(_filteredBookmarks);
		});
	}, [db, post.id]);
	const sendComment = async (e: React.FormEvent<HTMLButtonElement>): Promise<void> => {
		e.preventDefault();
		const commentToSend = comment;
		setComment("");
		await addDoc(collection(db, "posts", post.id, "comments"), {
			comment: commentToSend,
			userid: session?.user?.uid,
			username: userData?.username,
			avatar: userData?.avatar,
			timestamp: serverTimestamp(),
		});
	};
	const likePost = async (): Promise<void> => {
		assert(session);
		if (likes.find((like) => like.userid === session.user?.uid)) {
			await deleteDoc(doc(db, "posts", post.id, "likes", String(session.user?.uid)));
			return;
		}
		await setDoc(doc(db, "posts", post.id, "likes", String(session.user?.uid)), {
			username: userData?.username,
			userid: session.user?.uid,
			avatar: userData?.avatar,
			timestamp: serverTimestamp(),
		});
	};
	const bookmarkPost = async (): Promise<void> => {
		assert(session);
		if (bookmarks.find((bookmark) => bookmark.userid === session.user?.uid)) {
			await deleteDoc(doc(db, "posts", post.id, "bookmarks", String(session.user?.uid)));
			return;
		}
		await setDoc(doc(db, "posts", post.id, "bookmarks", String(session.user?.uid)), {
			username: userData?.username,
			userid: session.user?.uid,
			avatar: userData?.avatar,
			timestamp: serverTimestamp(),
		});
	};
	return (
		<div className="bg-white my-7 border rounded-md md:shadow-lg pb-3" id={post.id}>
			{/* Header */}
			<div className="flex items-center p-3">
				{postUserData?.username ?? session?.user?.name ? (
					<Image
						src={String(postUserData?.avatar ?? session?.user?.image)}
						alt={String(postUserData?.username ?? session?.user?.name)}
						width={30}
						height={30}
						/* eslint-disable-next-line @typescript-eslint/explicit-function-return-type,@typescript-eslint/no-misused-promises */
						onClick={() => router.push(`/users/${String(post.userid)}`)}
						className="rounded-full h-12 w-12 object-contain p-[1.5px] border border-red-500 mr-3 cursor-pointer"
					/>
				) : (
					<Skeleton circle height={30} width={30} className="h-12 w-12 mr-3" />
				)}
				<div className="flex flex-col">
					<h2
						className="font-semibold text-base cursor-pointer"
						/* eslint-disable-next-line @typescript-eslint/explicit-function-return-type,@typescript-eslint/no-misused-promises */
						onClick={() => router.push(`/users/${String(post.userid)}`)}>
						{postUserData?.username ?? session?.user?.name ?? <Skeleton width={100} />}
					</h2>
					{/* eslint-disable-next-line @typescript-eslint/no-unnecessary-condition */}
					{post.timestamp ? (
						<Moment fromNow className="text-xs text-gray-500">
							{new Date("seconds" in post.timestamp ? post.timestamp.seconds * 1000 : post.timestamp)}
						</Moment>
					) : (
						<Skeleton width={100} />
					)}
				</div>
				<div className="flex-grow" />
				<EllipsisHorizontalIcon className="postBtn" />
			</div>
			{/* Image */}
			{post.image ? (
				<Image
					src={post.image}
					alt={String(postUserData?.username ?? session?.user?.name)}
					className="object-cover w-full"
					width={30}
					height={30}
				/>
			) : (
				<Skeleton className="w-full h-96" />
			)}
			{/* Buttons */}
			{session && (
				<div className="flex justify-between px-4 pt-4">
					<div className="flex space-x-4">
						{likes.some((like) => like.userid === session.user?.uid) ? (
							// eslint-disable-next-line @typescript-eslint/no-misused-promises
							<HeartIconFilled className="postBtn text-red-500" onClick={likePost} />
						) : (
							// eslint-disable-next-line @typescript-eslint/no-misused-promises
							<HeartIcon className="postBtn" onClick={likePost} />
						)}
						<ChatBubbleOvalLeftIcon className="postBtn" />
						<PaperAirplaneIcon className="postBtn -rotate-45" />
					</div>
					{bookmarks.some((bookmark) => bookmark.userid === session.user?.uid) ? (
						// eslint-disable-next-line @typescript-eslint/no-misused-promises
						<BookmarkIconFilled className="postBtn text-amber-300" onClick={bookmarkPost} />
					) : (
						// eslint-disable-next-line @typescript-eslint/no-misused-promises
						<BookmarkIcon className="postBtn" onClick={bookmarkPost} />
					)}
				</div>
			)}
			{/* Caption */}
			<p className="p-5 truncate">
				{likes.length > 0 && (
					<p className="font-bold mb-1">
						{likes.length} {likes.length === 1 ? "like" : "likes"}
					</p>
				)}
				<span className="font-bold mr-1">{postUserData?.username ?? session?.user?.name}</span>
				{post.caption}
			</p>
			{/* Comments */}
			{comments.length > 0 && (
				<div className="ml-10 overflow-y-scroll scrollbar-thumb-gray-300 scrollbar-thin max-h-20">
					{comments.map((comment) => (
						<div key={comment.id} className="flex items-center space-x-2 px-4 py-2">
							<Image
								src={comment.avatar}
								alt={comment.username}
								className="h-7 rounded-full cursor-pointer"
								width={30}
								height={30}
								/* eslint-disable-next-line @typescript-eslint/explicit-function-return-type,@typescript-eslint/no-misused-promises */
								onClick={() => router.push(`/users/${String(comment.userid)}`)}
							/>
							<p className="text-sm flex-1 cursor-pointer">
								<span
									className="font-semibold cursor-pointer pr-1"
									/* eslint-disable-next-line @typescript-eslint/explicit-function-return-type,@typescript-eslint/no-misused-promises */
									onClick={() => router.push(`/users/${String(post.userid)}`)}>
									{comment.username}
								</span>
								{comment.comment}
							</p>
							<Moment fromNow className="pr-5 text-xs text-gray-500">
								{
									new Date(
										"seconds" in comment.timestamp
											? comment.timestamp.seconds * 1000
											: comment.timestamp
									)
								}
							</Moment>
						</div>
					))}
				</div>
			)}
			{/* Input box */}
			{session && (
				<form className="flex items-center p-4">
					<FaceSmileIcon className="h-7" />
					<input
						type="text"
						value={comment}
						onChange={(e): void => setComment(e.target.value)}
						placeholder="Add a comment..."
						className="border-none flex-1 focus:ring-0 outline-none"
					/>
					<button
						type="submit"
						className="font-semibold text-blue-400"
						disabled={!comment.trim()}
						/* eslint-disable-next-line @typescript-eslint/no-misused-promises */
						onClick={async (e: React.FormEvent<HTMLButtonElement>): Promise<void> => await sendComment(e)}>
						Post
					</button>
				</form>
			)}
		</div>
	);
}
