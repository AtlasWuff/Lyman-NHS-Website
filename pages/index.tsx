// Imports
import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import Script from "next/script";

// CSS imports
import styles from "../styles/pages/Home.module.css";

// Component imports
import ReactTypingEffect from "react-typing-effect";

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
				<section id={`${styles.MainTitle}`}>
					<div id={`${styles.titleWrapper}`}>
						<h1 className="pb-3">
							<ReactTypingEffect
								text={["Lyman NHS"]}
								eraseSpeed={70}
								typingDelay={500}
								speed={180}
								eraseDelay={99999999999999}
								cursor=" "
							/>
						</h1>
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
				<section id={`${styles.UpcomingEvents}`}></section>
				<section id={`${styles.RecentEvents}`}></section>
				<section id={`${styles.SocialMedia}`}></section>
				<section id={`${styles.People}`}></section>
				<Script data-id="09964540365304747" id="coolors widget">
					{`new CoolorsPaletteWidget("09964540365304747",
					["6ab6dc","49a6d4","2f94c6","277ba5","1f6284","e0b700","ffd20a","ffda33","ffe15c","ffe570"]);{" "}`}
				</Script>
			</main>
		</>
	);
}
