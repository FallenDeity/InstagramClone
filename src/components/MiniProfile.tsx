/* eslint-disable @typescript-eslint/no-misused-promises */

import Image from "next/image";
import { useRouter } from "next/router";
import { signOut, useSession } from "next-auth/react";
import React from "react";

import { UserSession } from "../utils/models";

export default function MiniProfile(): React.JSX.Element {
	const { data: session }: { data: UserSession | null | undefined } = useSession();
	const router = useRouter();
	return (
		<div className="flex items-center justify-between mt-14 ml-10 bg-gray-50 p-3 border rounded-md shadow-sm">
			<Image
				className="rounded-full border p-[2px] w-16 h-16"
				src={String(session?.user?.image)}
				alt="Profile Picture"
				width={30}
				height={30}
			/>
			<div className="flex-1 mx-4">
				<h2
					className="font-bold cursor-pointer"
					/* eslint-disable-next-line @typescript-eslint/explicit-function-return-type */
					onClick={() => router.push(`/users/${String(session?.user?.uid)}`)}>
					{session?.user?.name}
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
