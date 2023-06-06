// Imports
import Head from "next/head";
import Script from "next/script";
import * as React from "react";

// Component imports
import Navbar from "./parts/Navbar";

// Interface to define props
interface Props {
	children: React.ReactNode;
}

// Page
export default function Layout({ children }: Props) {
	return (
		<>
			<Head>
				<meta
					name="google-site-verification"
					content="VmGiD2gwTijQ1k9a2i6lKsdVfCV3lflb6VltDstfsJ0"
				/>
				<link rel="icon" href="/img/lymannhs.svg" />
				<meta charSet="UTF-8" />
				<meta name="description" content="Tachanks' website" />
				<meta
					name="keywords"
					content="Lyman NHS,NHS,NHS Lyman,Lyman NHS Club,NHS Lyman club,Lyman,Lyman high,Lyman high school,lyman high school nhs,lyman high school NHS"
				/>
				<meta name="theme-color" content="#345beb" data-reactroot="" />
				<meta property="og:title" content="Lyman NHS" />
				<meta
					property="og:description"
					content="Lyman High School's National Honor Society website"
				/>
				<meta property="og:type" content="website" />
				<meta property="og:url" content="https://lymannhs.netlify.app" />
				<meta
					property="og:image"
					content="https://cdn.discordapp.com/attachments/894669724305215509/1060727100862119986/lymannhsborder.png"
				/>

				<meta name="author" content="Josh" />
				<meta name="viewport" content="width=device-width, initial-scale=1.0" />
			</Head>

			{/* Webpage global layout */}
			<Script
				src="https://kit.fontawesome.com/8ee8b8ceb7.js"
				crossOrigin="anonymous"
			></Script>

			<Navbar />
			{children}
		</>
	);
}
