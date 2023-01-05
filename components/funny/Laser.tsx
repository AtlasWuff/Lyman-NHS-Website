// Imports
import Image from "next/image";
import * as React from "react";

// CSS imports
import styles from "../../styles/funny/Laser.module.css";

// Component imports

// Interface to define props
interface Props {
	children?: React.ReactNode;
}
// for class l add styles to make bg color random

// Page
export default function Laser({ children }: Props) {
	const ref1 = React.useRef<HTMLDivElement>(null);
	const ref2 = React.useRef<HTMLDivElement>(null);
	const ref3 = React.useRef<HTMLDivElement>(null);
	const ref4 = React.useRef<HTMLDivElement>(null);
	const ref5 = React.useRef<HTMLDivElement>(null);
	const ref6 = React.useRef<HTMLDivElement>(null);
	const [lasers, setLasers] = React.useState([ref1, ref2]);

	React.useEffect(() => {
		for (let i = 0; i < lasers.length; i++) {
			let thing = lasers[i].current as HTMLDivElement;
			if (thing !== null) {
				// add box shadow of random rainbow rgb color
				thing.style.boxShadow = `0 0 10px 10px rgb(${Math.floor(
					Math.random() * 255
				)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(
					Math.random() * 255
				)})`;
			}
		}
	}, [lasers]);

	return (
		<>
			<div className={styles.flexContainer}>
				<div className={styles.l} ref={ref1}></div>
				<div className={styles.l} ref={ref2}></div>
			</div>
			<div className="w-100 h-100 position-absolute">
				<Image
					src="/img/spotlight.png"
					alt="Spotlight"
					width={100}
					height={100}
					className={styles.spotlight}
				/>
				<Image
					src="/img/spotlight.png"
					alt="Spotlight"
					width={100}
					height={100}
					className={styles.spotlight}
				/>
			</div>
		</>
	);
}
