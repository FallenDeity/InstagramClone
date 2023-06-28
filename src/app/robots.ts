import { MetadataRoute } from "next";

export default function Robots(): MetadataRoute.Robots {
	return {
		rules: {
			userAgent: "*",
			allow: "/",
			disallow: ["/api", "/_next", "/static", "/private"],
		},
		sitemap: "/sitemap.xml",
	};
}
