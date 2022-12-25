// Imports
import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import Script from "next/script";
import type { AppProps } from "next/app";

// CSS imports

// Component imports
import Navbar from "./parts/Navbar";
import Footer from "./parts/Footer";

// Page
export default function Layout({ Component, pageProps }: AppProps) {
	return (
		<>
			<Head>
				<link rel="icon" href="/favicon.ico" />
			</Head>

			{/* Webpage global layout */}
			<Script
				src="https://kit.fontawesome.com/8ee8b8ceb7.js"
				crossOrigin="anonymous"
			></Script>
			<Script src="/scripts/LoadEffect.js" />

			<Navbar />
			{Component}
			<Footer />
		</>
	);
}
