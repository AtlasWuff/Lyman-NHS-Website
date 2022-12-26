// Imports
import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import Script from "next/script";
import type { AppProps } from "next/app";
import $ from "jquery";

import { useRef, useEffect } from "react";

// CSS imports
import styles from "../../styles/parts/Navbar.module.css";

// Interface to define props
interface Props {}

// Page
export default function Navbar({}: Props) {
	const logoRef = useRef<HTMLImageElement>(null);
	const navbarRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		window.addEventListener("scroll", () => {
			if (navbarRef.current !== null) {
				document.body.getBoundingClientRect().top <= -1
					? navbarRef.current.classList.add(`${styles.scrolledNav}`)
					: navbarRef.current.classList.remove(`${styles.scrolledNav}`);
			}
		});
	}, []);

	return (
		<nav>
			<div className={`${styles.NavWrapper}`} ref={navbarRef}>
				<ul className="d-flex flex-row justify-content-around align-items-center">
					<li className="col-2">
						<Link href="/">
							<Image
								src={"/img/lymannhs.svg"}
								width={50}
								height={50}
								alt="Logo"
								id={styles.NavLogo}
								ref={logoRef}
							/>
						</Link>
					</li>
					<li className="col-6">
						<Link href="/about">About</Link>
					</li>
					<li className="col-4">
						<Link href="/about">Abou2t</Link>
					</li>
				</ul>
			</div>
		</nav>
	);
}
