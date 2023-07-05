/* eslint-disable @typescript-eslint/no-misused-promises */

import "react-loading-skeleton/dist/skeleton.css";

import { collection, onSnapshot, query, where } from "firebase/firestore";
import Image from "next/image";
import { useRouter } from "next/router";
import { signOut, useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import Skeleton from "react-loading-skeleton";

import { db } from "@/utils/firebase";
import { User, UserSession } from "@/utils/models";

export default function MiniProfile(): React.JSX.Element {
	const { data: session }: { data: UserSession | null | undefined } = useSession();
	const router = useRouter();
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
	return (
		<div className="flex items-center justify-between mt-14 ml-10 bg-gray-50 p-3 border rounded-md shadow-sm">
			{userData?.username ?? session?.user?.name ? (
				<Image
					className="rounded-full border p-[2px] w-16 h-16"
					src={String(userData?.avatar ?? session?.user?.image)}
					alt="Profile Picture"
					width={30}
					height={30}
				/>
			) : (
				<Skeleton className="rounded-full border p-[2px] w-16 h-16" width={30} height={30} />
			)}
			<div className="flex-1 mx-4">
				<h2
					className="font-bold cursor-pointer"
					/* eslint-disable-next-line @typescript-eslint/explicit-function-return-type */
					onClick={() => router.push(`/users/${String(session?.user?.uid)}`)}>
					{userData?.username ?? session?.user?.name ?? <Skeleton width={50} />}
				</h2>
				<h3 className="text-sm text-gray-400">Welcome to Instagram</h3>
			</div>
			{/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
			{/* @ts-expect-error */}
			<button className="text-blue-400 text-sm font-semibold" onClick={signOut}>
				Sign Out
			</button>
		</div>
	);
}
