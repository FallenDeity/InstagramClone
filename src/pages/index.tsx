"use client";

import React from "react";

import Feed from "@/components/Feed";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Modal from "@/components/Modal";

export default function Home(): React.JSX.Element {
	return (
		<div className="bg-gray-50 h-screen overflow-y-scroll scrollbar-hide">
			<Header />
			<div className="h-screen">
				<Feed />
			</div>
			<Modal />
			<Footer />
		</div>
	);
}
