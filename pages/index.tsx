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

// Page
export default function Home() {
	const waveRef = useRef<HTMLDivElement>(null);

	return (
		<>
			{/* Meta tags */}
			<Head>
				<title>Lyman NHS</title>s
			</Head>

			{/* ! Main homepage content */}
			<main>
				<section id={`${styles.MainTitle}`}>
					<div id={`${styles.titleBg}`}>
						<Image src={"/img/campus.jpg"} fill alt="" />
					</div>
					<div id={`${styles.titleWrapper}`}>
						<h1 className="pb-3">Lyman NHS</h1>
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
					</div>
				</section>
				<div className={`${styles.waveWrap}`}>
					<div className={`${styles.wave}`}>
						<Image src={`/img/wave2.svg`} fill alt="" />
					</div>
				</div>
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
