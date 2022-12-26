// Imports
import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import Script from "next/script";

import { useRef } from "react";

// CSS imports
import styles from "../styles/pages/Home.module.css";

// Component imports
import ReactTypingEffect from "react-typing-effect";
import PageTitle from "../components/parts/PageTitle";

// Page
export default function Home() {
	return (
		<>
			{/* Meta tags */}
			<Head>
				<title>Lyman NHS</title>
			</Head>

			{/* ! Main homepage content */}
			<main>
				<PageTitle title="Lyman NHS">
					<p id={`${styles.motto}`}>
						<ReactTypingEffect
							text={["Character", "Scholarship", "Leadership", "Service"]}
							eraseSpeed={70}
							typingDelay={1000}
							speed={180}
							eraseDelay={2000}
							cursor="_"
						/>
					</p>
				</PageTitle>
				<div id={`${styles.notTitle}`}>
					<section id={`${styles.UpcomingEvents}`}>
						<h1>Upcoming Events</h1>
					</section>
					<section id={`${styles.RecentEvents}`}></section>
					<section id={`${styles.SocialMedia}`}></section>
					<section id={`${styles.People}`}></section>
				</div>
			</main>
		</>
	);
}
