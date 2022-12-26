// Imports
import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import Script from "next/script";
import type { AppProps } from "next/app";
import $ from "jquery";
import * as React from "react";

import { useRef, useEffect } from "react";

// CSS imports
import styles from "../../styles/parts/PageTitle.module.css";

// Component imports
import ReactTypingEffect from "react-typing-effect";

// Interface to define props
interface Props {
	title: string;
	height?: string;
	children?: React.ReactNode;
}

// Page
export default function PageTitle({ title, children }: Props) {
	return (
		<>
			<section id={`${styles.MainTitle}`}>
				<div id={`${styles.titleBg}`}>
					<Image src={"/img/campus.jpg"} fill alt="" />
				</div>
				<div id={`${styles.titleWrapper}`}>
					<h1 className="pb-3">{title}</h1>
					{children}
				</div>
			</section>
			<div className={`${styles.waveWrap}`}>
				<div className={`${styles.wave}`}>
					<Image src={`/img/wave2.svg`} fill alt="" />
				</div>
			</div>
		</>
	);
}
