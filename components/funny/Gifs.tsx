// Imports
import Image from "next/image";
import * as React from "react";

// CSS imports
import styles from "../../styles/funny/Gifs.module.css";

// Component imports

// Interface to define props
interface Props {
	children?: React.ReactNode;
}

// Page
export default function Gifs({ children }: Props) {
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
					<Image src={`/img/wave2.svg`} fill alt="" draggable={false} />
				</div>
			</div>
		</>
	);
}
