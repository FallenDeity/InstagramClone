import Head from "next/head";
import React from "react";

export default function CustomHead({ title }: { title: string }): React.JSX.Element {
	return (
		<Head>
			<title>{title}</title>
			<meta name="description" content="A basic Instagram clone built with Next.js and Tailwind CSS" />
			<meta name="theme-color" content="#ed36ff" />
			<meta name="keywords" content="instagram, clone, next.js, tailwind, css, react, recoil, next-auth" />
			<meta name="author" content="Triyan Mukherjee" />
			<meta property="og:title" content="Triyan's Portfolio" />
			<meta property="og:type" content="website" />
			<meta property="og:image" content="/logo.png" />
			<meta property="og:image:width" content="1400" />
			<meta property="og:image:height" content="900" />
			<link rel="icon" href="/favicon.ico" />
			<meta name="viewport" content="width=device-width, initial-scale=1" />
		</Head>
	);
}
