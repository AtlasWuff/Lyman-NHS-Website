// Imports
import Image from "next/image";
import { useRef } from "react";

// CSS imports
import styles from "../../styles/parts/Footer.module.css";

// Interface to define props
interface Props {}

// Page
export default function Footer({}: Props) {
	const logoRef = useRef<HTMLImageElement>(null);

	return (
		<footer>
			<div className={`${styles.FtrWrapper}`}>
				<p className="">
					Made by{" "}
					<a
						href="https://tachanks.xyz"
						target="_blank"
						rel="noreferrer"
						className="hoverUnderlineAnim"
					>
						Josh
					</a>
				</p>
				<p>
					<a
						href="mailto: joshuaew06@gmail.com"
						target="_blank"
						rel="noreferrer"
						className="hoverUnderlineAnim"
					>
						Problems?
					</a>
				</p>
				<div className={`${styles.Socials}`}>
					<a href="https://tachanks.xyz" target="_blank" rel="noreferrer">
						<Image
							src="/img/socials/website.svg"
							width={30}
							height={30}
							alt=""
						/>
					</a>
					<a
						href="https://github.com/Its-Tachanks"
						target="_blank"
						rel="noreferrer"
					>
						<Image
							src="/img/socials/github.svg"
							width={30}
							height={30}
							alt=""
						/>
					</a>
					{/* <a
						href="https://linkedin.com/in/Joshua-EW"
						target="_blank"
						rel="noreferrer"
					>
						<Image
							src="/img/socials/linkedin.svg"
							width={30}
							height={30}
							alt=""
						/>
					</a> */}
					<a
						href="https://www.instagram.com/tachanks_/"
						target="_blank"
						rel="noreferrer"
					>
						<Image
							src="/img/socials/instagram.svg"
							width={30}
							height={30}
							alt=""
						/>
					</a>
				</div>
			</div>
		</footer>
	);
}
