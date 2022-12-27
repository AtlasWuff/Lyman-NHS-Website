// Imports
import * as React from "react";

// CSS imports
import styles from "../../styles/parts/Table.module.css";

// Component imports

// Interface to define props
interface Props {
	minHeight: any;
	maxHeight: any;
	showLoading?: boolean;
	children?: React.ReactNode;
}

// Page
export default function Table({
	minHeight,
	maxHeight,
	showLoading,
	children,
}: Props) {
	return (
		<>
			<div className={`${styles.TableWrapper}`}>
				<div
					className={`${styles.Table}`}
					style={{ minHeight: minHeight, maxHeight: maxHeight }}
				>
					{children}
				</div>
			</div>
		</>
	);
}
