import Image from "next/image";
import React from "react";

export default function Story({ image, username }: { image: string; username: string }): React.JSX.Element {
	return (
		<div>
			<Image
				src={image}
				alt={username}
				width={40}
				height={40}
				className="h-14 w-14 rounded-full p-[1.5px] border-red-500 border-2 object-contain cursor-pointer hover:scale-110 transition transform duration-200 ease-out"
			/>
			<p className="text-xs w-14 truncate text-center">{username}</p>
		</div>
	);
}
