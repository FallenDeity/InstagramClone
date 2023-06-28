import "../styles/globals.css";

import Head from "next/head";
import { Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import React from "react";
import { RecoilRoot } from "recoil";

interface AppProps {
	Component: React.FC;
	pageProps: Record<string, Session | null | undefined>;
}

export default function App({ Component, pageProps }: AppProps): React.JSX.Element {
	return (
		<>
			<Head>
				<title>Instragram Clone</title>
				<meta name="description" content="Instagram Clone" />
				<meta name="theme-color" content="#ed36ff" />
				<link rel="icon" href="/favicon.ico" />
				<meta name="viewport" content="width=device-width, initial-scale=1" />
			</Head>
			<SessionProvider session={pageProps.session}>
				<RecoilRoot>
					<Component {...pageProps} />
				</RecoilRoot>
			</SessionProvider>
		</>
	);
}
