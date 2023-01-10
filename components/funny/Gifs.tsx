// Imports
import Image from "next/image";
import * as React from "react";
import { useEffectOnce } from "usehooks-ts";

// CSS imports
import styles from "../../styles/funny/Gifs.module.css";

// Component imports

// Interface to define props
interface Props {
	children?: React.ReactNode;
}

// Page
export default function Gifs({ children }: Props) {
	const [gifs, setGifs] = React.useState<Array<string>>([
		"https://media.tenor.com/Lbrr3HR3CnkAAAAd/snoop-dogg-rap.gif",
		"https://media.tenor.com/7KE3TH-N4IAAAAAd/celebrate-party.gif",
		"https://media.tenor.com/ukjUvE17ZcQAAAAd/party-minions.gif",
		"https://media.tenor.com/R7k3DxD5f34AAAAd/golden-girls-konga.gif",
		"https://media.tenor.com/TsNWXQ2E8pAAAAAC/celebration-confetti.gif",
		"https://media.tenor.com/J8KeZSDe_acAAAAd/dace.gif",
		"https://media.tenor.com/jYqfbfE5wU4AAAAC/yay-yes.gif",
		"https://media.tenor.com/bIWKGrYb0FIAAAAd/crazy-dance-funny-dance.gif",
		"https://media.tenor.com/IKwGOsinNnkAAAAd/markiplier-dancing.gif",
		"https://media.tenor.com/mAJMFA1Gjj0AAAAd/baby-yoda-baby-yoda-dancing.gif",
		"https://media.tenor.com/6P_6Nu-e3y0AAAAd/my-dancing.gif",
		"https://media.tenor.com/ME4hOuZqjx4AAAAd/bear-dance.gif",
	]);
	const [selectedGifs, setSelectedGifs] = React.useState<Array<string>>([]);

	useEffectOnce(() => {
		let newGifs = [];
		for (let i = 0; i < 5; i++) {
			let randomIndex = Math.floor(Math.random() * gifs.length);
			newGifs.push(gifs[randomIndex]);
			gifs.splice(randomIndex, 1);
		}
		setSelectedGifs(newGifs);
	});
	return (
		<>
			<div className={styles.wrapper}>
				{selectedGifs.map((gif, index) => {
					return (
						// gif random position on screen

						<div
							className={styles.gif}
							// top and left within 25% to 75% of screen
							style={{
								top: `${Math.floor(Math.random() * 50) + 5}%`,
								left: `${Math.floor(Math.random() * 70) + 5}%`,
							}}
							key={index}
						>
							<Image src={gif} alt="Gif" width={200} height={200} unoptimized />
						</div>
					);
				})}
			</div>
		</>
	);
}
