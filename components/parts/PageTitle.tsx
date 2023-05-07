// Imports
import Image from "next/image";
import * as React from "react";

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
					<Image src={"/img/campus.jpg"} fill alt="" draggable={false} />
				</div>
				<div id={`${styles.titleWrapper}`}>
					<h1 className="pb-3">{title}</h1>
					{children}
				</div>
			</section>
			<div className={`${styles.waveWrap}`}>
				<div className={`${styles.wave}`}>
					<Image
						src={`/img/wave2.svg`}
						fill
						alt=""
						draggable={false}
						className="min-vw-100"
					/>
				</div>
			</div>
		</>
	);
}
