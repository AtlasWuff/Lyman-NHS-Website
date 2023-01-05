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

// Page
export default function Laser({ children }: Props) {
	return (
		<>
			<div className={styles.flexContainer}>
				<div className={styles.loading}>
					<div className={styles.l}></div>
					<div className={styles.l}></div>
					<div className={styles.l}></div>
					<div className={styles.l}></div>
					<div className={styles.l}></div>
					<div className={styles.l}></div>
					<div className={styles.l}></div>
					<div className={styles.l}></div>
				</div>
			</div>
		</>
	);
}
