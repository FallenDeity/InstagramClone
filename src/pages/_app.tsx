import "@/styles/globals.css";

import { Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import React from "react";
import { RecoilRoot } from "recoil";

import CustomHead from "@/components/Head";

interface AppProps {
	Component: React.FC;
	pageProps: Record<string, Session | null | undefined>;
}

export default function App({ Component, pageProps }: AppProps): React.JSX.Element {
	return (
		<>
			<CustomHead title={"Instagram Clone"} />
			<SessionProvider session={pageProps.session}>
				<RecoilRoot>
					<Component {...pageProps} />
				</RecoilRoot>
			</SessionProvider>
		</>
	);
}
