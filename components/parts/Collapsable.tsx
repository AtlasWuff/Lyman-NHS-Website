// Imports
import Image from "next/image";
import * as React from "react";
import { useRef, useState } from "react";

// CSS imports
import styles from "../../styles/parts/Collapsable.module.css";

// Component imports

// Interface to define props
interface Props {
	initText: string;
	className?: string;
	children?: React.ReactNode;
}

// Page
export default function Table({ initText, className, children }: Props) {
	const collapsableRef = useRef<HTMLDivElement>(null);
	const [isExpanded, setIsExpanded] = useState(false);

	const expandCollapsable = () => {
		setIsExpanded(!isExpanded);
		console.log("Collapsable is expanded: ", !isExpanded);
		if (collapsableRef.current) {
			collapsableRef.current.classList.toggle(styles.CollapsableExpanded);
		}
	};

	return (
		<>
			<div className={`${styles.CollapsableWrapper} `}>
				<div
					className={`${styles.Collapsable} ${className} h-100`}
					ref={collapsableRef}
				>
					<div className="d-flex justify-content-between align-items-center w-100 flex-column">
						<div className="w-100 d-flex justify-content-between align-items-center">
							<p>{initText}</p>
							<button
								onClick={(e) => {
									expandCollapsable();
								}}
							>
								<Image
									src="/img/caretdown.svg"
									alt="Arrow down"
									width={25}
									height={25}
								/>
							</button>
						</div>
					</div>
					<div className={`${styles.CollapsableContent}`}>
						<div>{children}</div>
					</div>
				</div>
			</div>
		</>
	);
}
