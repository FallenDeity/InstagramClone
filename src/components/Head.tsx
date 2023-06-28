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
			<meta property="og:title" content="Instagram clone" />
			<meta property="og:description" content="A basic Instagram clone built with Next.js and Tailwind CSS" />
			<meta property="og:type" content="website" />
			<meta property="og:url" content={process.env.NEXTAUTH_URL} />
			<meta property="og:image" content="/logo.png" />
			<link rel="icon" href="/favicon.ico" />
			<meta name="viewport" content="width=device-width, initial-scale=1" />
		</Head>
	);
}
