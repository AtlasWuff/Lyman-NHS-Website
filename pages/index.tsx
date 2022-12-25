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
				<div id={`${styles.HomeTitle}`}>
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
			</main>
		</>
	);
}
