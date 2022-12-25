// Imports
import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import Script from "next/script";
import type { AppProps } from "next/app";
import $ from "jquery";

import { useRef, useEffect } from "react";

// CSS imports
import styles from "../../styles/parts/Footer.module.css";

// Interface to define props
interface Props {}

// Page
export default function Footer({}: Props) {
	const logoRef = useRef<HTMLImageElement>(null);

	return (
		<footer>
			<div className={`${styles.FtrWrapper}`}></div>
		</footer>
	);
}
