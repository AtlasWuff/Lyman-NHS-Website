// Imports
import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import Script from "next/script";
import type { AppProps } from "next/app";

import { useRef, useEffect } from "react";

// CSS imports
import styles from "../../styles/parts/Navbar.module.css";

// Component imports

// Page
export default function Navbar({ Component, pageProps }: AppProps) {
	return (
		<nav>
			<div className={`${styles.NavWrapper} position-fixed top-0 start-0`}>
				<Image
					src="https://picsum.photos/200/300"
					alt="Picture of the author"
					width={200}
					height={300}
					unoptimized
				/>
			</div>
		</nav>
	);
}
