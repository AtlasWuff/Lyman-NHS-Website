// Imports
import * as React from "react";

// CSS imports
import styles from "../../styles/parts/Table.module.css";

// Component imports

// Interface to define props
interface Props {
	minHeight?: any;
	maxHeight?: any;
	bgColor?: string;
	widthVal?: string;
	showLoading?: boolean;
	children?: React.ReactNode;
}

// Page
export default function Table({
	minHeight = "20vh",
	maxHeight = "90vh",
	bgColor = "rgba(0,0,0,0.2)",
	widthVal = "95%",
	showLoading,
	children,
}: Props) {
	return (
		<>
			<div className={`${styles.TableWrapper}`} style={{ width: widthVal }}>
				<div
					className={`${styles.Table}`}
					style={{
						minHeight: minHeight,
						maxHeight: maxHeight,
						backgroundColor: bgColor,
					}}
				>
					{children}
				</div>
			</div>
		</>
	);
}
