import "react-loading-skeleton/dist/skeleton.css";

import { HomeIcon } from "@heroicons/react/20/solid";
import {
	HeartIcon,
	MagnifyingGlassIcon,
	PaperAirplaneIcon,
	PlusCircleIcon,
	UserGroupIcon,
} from "@heroicons/react/24/outline";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import Image from "next/image";
import { useRouter } from "next/router";
import { signIn, useSession } from "next-auth/react";
import React, { useEffect, useRef, useState } from "react";
import Skeleton from "react-loading-skeleton";
import { useRecoilState } from "recoil";

import { modalState } from "@/components/atoms/modalAtom";
import { db } from "@/utils/firebase";
import { User, UserSession } from "@/utils/models";

export default function Header(): React.JSX.Element {
	const { data: session }: { data: UserSession | null | undefined } = useSession();
	const [userData, setUserData] = useState<User>();
	const searchBarRef = useRef<HTMLInputElement>(null);
	const suggestionRef = useRef<HTMLDivElement>(null);
	const setOpen = useRecoilState(modalState)[1];
	const router = useRouter();
	const [suggestions, setSuggestions] = useState<User[]>([]);
	const addSuggestions = (): void => {
		if (searchBarRef.current?.value === "") {
			setSuggestions([]);
			suggestionRef.current?.classList.remove("border");
			return;
		}
		const text = searchBarRef.current?.value;
		onSnapshot(query(collection(db, "users"), where("username", ">=", text)), (snapshot) => {
			suggestionRef.current?.classList.add("border");
			const users = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as User));
			setSuggestions(users);
		});
	};
	const clickUser = async (id: string): Promise<void> => {
		setSuggestions([]);
		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-expect-error
		searchBarRef.current.value = "";
		await router.push(`/users/${id}`);
	};
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
		<header className="shadow-sm border-b bg-white sticky top-0 z-40">
			<div className="flex justify-between max-w-6xl mx-5 lg:mx-auto">
				{/* Full screen logo */}
				{/* eslint-disable-next-line @typescript-eslint/no-misused-promises,@typescript-eslint/explicit-function-return-type */}
				<div className="relative w-28 hidden lg:inline-grid cursor-pointer" onClick={() => router.push("/")}>
					<Image
						src="https://links.papareact.com/ocw"
						alt="Instagram Logo"
						fill={true}
						style={{ objectFit: "contain" }}
					/>
				</div>
				{/* Mobile logo */}
				{/* eslint-disable-next-line @typescript-eslint/no-misused-promises,@typescript-eslint/explicit-function-return-type */}
				<div className="relative w-10 lg:hidden flex-shrink-0 cursor-pointer" onClick={() => router.push("/")}>
					<Image
						src="https://links.papareact.com/jjm"
						alt="Instagram"
						fill={true}
						style={{ objectFit: "contain" }}
					/>
				</div>
				{/* Search bar */}
				<div className="max-w-xs">
					<div className="relative mt-1 p-3 rounded-md ml-3">
						<div className="absolute inset-y-0 pl-3 flex items-center pointer-events-none">
							<MagnifyingGlassIcon className="h-5 w-5 text-gray-500" />
						</div>
						<input
							ref={searchBarRef}
							onChange={addSuggestions}
							type="text"
							placeholder="Search"
							className="bg-gray-50 block w-full pl-10 sm:text-sm border-gray-300 rounded-md focus:ring-black focus:border-black"
						/>
						<div
							className="absolute bg-gray-100 border-gray-300 divide-gray-300 rounded-md mt-1 z-10 w-[235px] md:w-[212px] max-h-44 divide-y pl-2 overflow-y-scroll scrollbar-thin scrollbar-thumb-gray-300"
							ref={suggestionRef}>
							{suggestions.map((suggestion) => (
								<div
									className="flex items-center p-2 cursor-pointer hover:text-blue-400 transition ease-in-out duration-150 w-full"
									key={suggestion.id}
									/* eslint-disable-next-line @typescript-eslint/no-misused-promises,@typescript-eslint/explicit-function-return-type */
									onClick={() => clickUser(suggestion.id)}>
									<Image
										src={suggestion.avatar}
										className="rounded-full h-8 w-8 object-cover p-1"
										alt="Profile Picture"
										width={30}
										height={30}
										layout="fixed"
									/>
									<p className="text-sm ml-2 truncate hover:scale-110 transition ease-in-out duration-150">
										{suggestion.username}
									</p>
								</div>
							))}
						</div>
					</div>
				</div>
				{/* Menu items */}
				<div className="flex items-center justify-end space-x-4">
					{/* eslint-disable-next-line @typescript-eslint/no-misused-promises,@typescript-eslint/explicit-function-return-type */}
					<HomeIcon className="navBtn" onClick={() => router.push("/")} />
					{session ? (
						<>
							<div className="relative navBtn -rotate-45">
								<PaperAirplaneIcon className="navBtn" />
								<div className="absolute -top-1 -right-2 rotate-45 text-xs w-5 h-5 bg-red-500 rounded-full flex items-center justify-center animate-pulse text-white">
									3
								</div>
							</div>
							<PlusCircleIcon className="navBtn" onClick={(): void => setOpen(true)} />
							<UserGroupIcon className="navBtn" />
							<HeartIcon className="navBtn" />
							{userData?.avatar ?? session.user?.image ? (
								<Image
									/* eslint-disable-next-line @typescript-eslint/no-misused-promises */
									alt="Profile Picture"
									className="rounded-full cursor-pointer h-7"
									width={30}
									height={30}
									/* eslint-disable-next-line @typescript-eslint/explicit-function-return-type,@typescript-eslint/no-misused-promises */
									onClick={() => router.push(`/users/${String(session.user?.uid)}`)}
									src={String(userData?.avatar ?? session.user?.image)}
								/>
							) : (
								<Skeleton circle={true} height={30} width={30} />
							)}
						</>
					) : (
						<button
							className="text-sm text-blue-400 font-semibold"
							// eslint-disable-next-line @typescript-eslint/no-misused-promises
							onClick={async (): Promise<void> => await signIn()}>
							Sign In
						</button>
					)}
				</div>
			</div>
		</header>
	);
}
