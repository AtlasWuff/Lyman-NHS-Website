// Imports
import * as React from "react";
import Image from "next/image";

import { motion, useAnimation } from "framer-motion";
import { useInView } from "react-intersection-observer";

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
	className?: string;
	children?: React.ReactNode;
	useArrow?: boolean;
}

// Page
export default function Table({
	minHeight = "20vh",
	maxHeight = "90vh",
	bgColor = "rgba(0,0,0,0.2)",
	widthVal = "95%",
	showLoading,
	className,
	children,
	useArrow = false,
}: Props) {
	const controls = useAnimation();
	const [ref, inView] = useInView();

	React.useEffect(() => {
		if (inView) {
			controls.start("visible");
		}
	}, [controls, inView]);

	const tableDiv = React.useRef<HTMLDivElement>(null);

	function isOverflown(element: HTMLDivElement) {
		if (!element) return false;

		return (
			element.scrollHeight > element.clientHeight ||
			element.scrollWidth > element.clientWidth
		);
	}

	const [showArrow, setShowArrow] = React.useState<boolean>(false);

	React.useEffect(() => {
		if (tableDiv.current) {
			if (isOverflown(tableDiv.current)) {
				setShowArrow(true);
				console.log("overflown");
			} else {
				setShowArrow(false);
			}
		}
	}, [tableDiv]);
	return (
		<>
			<motion.div
				className={`${styles.TableWrapper} ${className} position-relative`}
				style={{ width: widthVal }}
				animate={controls}
				ref={ref}
				transition={{ duration: 0.5, ease: [0.5, 0.01, -0.05, 0.9] }}
				initial={{ scale: 0 }}
				variants={{
					visible: { scale: 1 },
				}}
			>
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
				{useArrow ? (
					<div className={`${styles.arrow}`}>
						{/* // eslint-disable-next-line react/jsx-no-undef */}
						<Image
							src="/img/downarrow.svg"
							alt="Arrow down"
							width={25}
							height={25}
						/>
					</div>
				) : null}
			</motion.div>
		</>
	);
}
