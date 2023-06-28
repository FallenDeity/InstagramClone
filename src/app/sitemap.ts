import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
	const BASE_URL = process.env.NEXTAUTH_URL;
	return [
		{
			url: `${String(BASE_URL)}/`,
			lastModified: new Date(),
		},
	];
}
