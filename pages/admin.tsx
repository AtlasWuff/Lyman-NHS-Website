// Imports
import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import Script from "next/script";

import { useRef, useState } from "react";

import { app, db } from "../firebase";
import { collection, addDoc } from "firebase/firestore";

// CSS imports
import styles from "../styles/pages/Admin.module.css";

// Component imports

// Interface for addMember function
interface addMemberProps {
	name: String;
	grade: String | Number;
}

// Page
export default function Home() {
	const [name, setName] = useState("");
	const [grade, setGrade] = useState("");

	const dbInstance = collection(db, "Members");
	const addMember = async ({ name, grade }: addMemberProps) => {
		const docRef = await addDoc(dbInstance, {
			name: name,
			grade: grade,
		});
		console.log("Document written with ID: ", docRef.id);
	};

	return (
		<>
			{/* Meta tags */}
			<Head>
				<title>NHS Admin</title>
			</Head>

			{/* ! Main homepage content */}
			<main>
				<section id={`${styles.MainTitle}`}>
					<div id={`${styles.titleBg}`}>
						<Image src={"/img/campus.jpg"} fill alt="" />
					</div>
					<div id={`${styles.titleWrapper}`}>
						<h1 className="pb-3">NHS Admin</h1>
					</div>
				</section>
				<div className={`${styles.waveWrap}`}>
					<div className={`${styles.wave}`}>
						<Image src={`/img/wave2.svg`} fill alt="" />
					</div>
				</div>
				<div id={`${styles.notTitle}`}>
					<section>
						<input
							type="text"
							placeholder="Name"
							onChange={(e) => setName(e.target.value)}
						/>
						<input
							type="text"
							placeholder="Grade"
							onChange={(e) => setGrade(e.target.value)}
						/>
						<button
							onClick={() => {
								addMember({ name: name, grade: grade });
							}}
						>
							Add Member
						</button>
					</section>
				</div>
			</main>
		</>
	);
}
