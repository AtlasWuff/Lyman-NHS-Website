// Imports
import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import Script from "next/script";

// CSS imports
import styles from "../styles/pages/Home.module.css";

// Component imports

// Page

export default function Home() {
	return (
		<>
			{/* Meta tags */}
			<Head>
				<title>Lyman NHS</title>s
			</Head>

			{/* ! Main homepage content */}
			<main>
				<div id={`${styles.HomeTitle}`}>
					<h1>Lyman NHS</h1>
				</div>
			</main>
		</>
	);
}
