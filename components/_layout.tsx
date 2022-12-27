// Imports
import Head from "next/head";
import Script from "next/script";
import * as React from "react";

// Component imports
import Navbar from "./parts/Navbar";
import Footer from "./parts/Footer";

// Interface to define props
interface Props {
	children: React.ReactNode;
}

// Page
export default function Layout({ children }: Props) {
	return (
		<>
			<Head>
				<link rel="icon" href="/img/lymannhs.svg" />
			</Head>

			{/* Webpage global layout */}
			<Script
				src="https://kit.fontawesome.com/8ee8b8ceb7.js"
				crossOrigin="anonymous"
			></Script>

			<Navbar />
			{children}
			<Footer />
		</>
	);
}
