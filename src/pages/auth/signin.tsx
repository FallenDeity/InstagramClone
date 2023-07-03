import Image from "next/image";
import { ClientSafeProvider, getProviders, signIn as SignIntoProvider, SignInResponse } from "next-auth/react";
import React from "react";

import Footer from "@/components/Footer";
import CustomHead from "@/components/Head";
import Header from "@/components/Header";

interface Provider {
	id: string;
	name: string;
	type: string;
	signinUrl: string;
	callbackUrl: string;
}

export default function signIn({ providers }: { providers: Provider }): React.JSX.Element {
	return (
		<>
			<CustomHead title={"Sign In"} />
			<Header />
			<div className="flex flex-col items-center justify-center min-h-screen px-14 -mt-24 text-center">
				<Image src="https://links.papareact.com/ocw" alt="Logo" className="w-80" width={30} height={30} />
				<p className="font-xs italic mt-5">This is not a REAL app, it is built for educational purposes only</p>
				<div className="mt-24">
					{Object.values(providers).map((provider: Provider) => (
						<div key={provider.name}>
							<button
								className="p-3 bg-blue-500 rounded-lg text-white"
								/* eslint-disable-next-line @typescript-eslint/no-misused-promises */
								onClick={(): Promise<SignInResponse | undefined> =>
									SignIntoProvider(provider.id, {
										callbackUrl: "/",
									})
								}>
								Sign in with {provider.name}
							</button>
						</div>
					))}
				</div>
			</div>
			<Footer />
		</>
	);
}

export async function getServerSideProps(): Promise<{
	props: {
		providers: Record<
			| (string & Record<never, never>)
			| "42-school"
			| "apple"
			| "atlassian"
			| "auth0"
			| "authentik"
			| "azure-ad-b2c"
			| "azure-ad"
			| "battlenet"
			| "box"
			| "boxyhq-saml"
			| "bungie"
			| "cognito"
			| "coinbase"
			| "credentials"
			| "discord"
			| "dropbox"
			| "duende-identity-server6"
			| "email"
			| "eveonline"
			| "facebook"
			| "faceit"
			| "foursquare"
			| "freshbooks"
			| "fusionauth"
			| "github"
			| "gitlab"
			| "google"
			| "hubspot"
			| "identity-server4"
			| "index"
			| "instagram"
			| "kakao"
			| "keycloak"
			| "line"
			| "linkedin"
			| "mailchimp"
			| "mailru"
			| "medium"
			| "naver"
			| "netlify"
			| "oauth-types"
			| "oauth"
			| "okta"
			| "onelogin"
			| "osso"
			| "osu"
			| "patreon"
			| "pinterest"
			| "pipedrive"
			| "reddit"
			| "salesforce"
			| "slack"
			| "spotify"
			| "strava"
			| "todoist"
			| "trakt"
			| "twitch"
			| "twitter"
			| "united-effects"
			| "vk"
			| "wikimedia"
			| "wordpress"
			| "workos"
			| "yandex"
			| "zitadel"
			| "zoho"
			| "zoom",
			ClientSafeProvider
		> | null;
	};
}> {
	return {
		props: {
			providers: await getProviders(),
		},
	};
}
