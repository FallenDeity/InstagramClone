import { HomeIcon } from "@heroicons/react/20/solid";
import { HeartIcon, PaperAirplaneIcon, PlusCircleIcon, UserGroupIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import React from "react";
import { useRecoilState } from "recoil";

import { modalState } from "@/components/atoms/modalAtom";
import { UserSession } from "@/utils/models";

export default function Footer(): React.JSX.Element {
	const { data: session }: { data: UserSession | null | undefined } = useSession();
	const setOpen = useRecoilState(modalState)[1];
	const router = useRouter();
	return (
		<div className="fixed md:hidden bottom-0 z-40 bg-white flex items-center justify-between border-t w-full h-12 p-5 pl-10 pr-10">
			{/* eslint-disable-next-line @typescript-eslint/explicit-function-return-type,@typescript-eslint/no-misused-promises,@typescript-eslint/restrict-template-expressions */}
			<HomeIcon className={`mobileNavBtn ${!session && "mx-auto"}`} onClick={() => router.push("/")} />
			{session && (
				<>
					<div className="relative mobileNavBtn -rotate-45">
						<PaperAirplaneIcon className="mobileNavBtn" />
						<div className="absolute -top-1 -right-2 rotate-45 text-xs w-5 h-5 bg-red-500 rounded-full flex items-center justify-center animate-pulse text-white">
							3
						</div>
					</div>
					<PlusCircleIcon className="mobileNavBtn" onClick={(): void => setOpen(true)} />
					<UserGroupIcon className="mobileNavBtn" />
					<HeartIcon className="mobileNavBtn" />
				</>
			)}
		</div>
	);
}
