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
import PageTitle from "../components/parts/PageTitle";

// Interface for addMember function
interface addMemberProps {
	name: String;
	grade: String | Number;
	email: String;
}

// Page
export default function Home() {
	const [name, setName] = useState("");
	const [grade, setGrade] = useState("");
	const [email, setEmail] = useState("");

	const dbInstance = collection(db, "Members");
	const addMember = async ({ name, grade, email }: addMemberProps) => {
		if (
			name == "" ||
			grade == "" ||
			email == "" ||
			name == null ||
			grade == null ||
			email == null
		) {
			alert("Please fill out all fields.");
			return;
		} else if (grade > 12 || grade < 9) {
			alert("Please enter a valid grade.");
			return;
		} else if (!email.includes("@")) {
			alert("Please enter a valid email.");
			return;
		}

		const docRef = await addDoc(dbInstance, {
			name: name,
			grade: grade,
			email: email,
		}).then((r) => {
			console.log("Document written with ID: ", r.id);
			alert(`Success!\nName: ${name}\nGrade: ${grade}\nEmail: ${email}`);
		});
	};

	return (
		<>
			{/* Meta tags */}
			<Head>
				<title>NHS Admin</title>
			</Head>

			{/* ! Main homepage content */}
			<main>
				<PageTitle title="NHS Admin" />
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
						<input
							type="text"
							placeholder="Email"
							onChange={(e) => setEmail(e.target.value)}
						/>
						<button
							className="LoadButton-pushable GameRequest"
							onClick={() => {
								addMember({ name: name, grade: grade, email: email });
							}}
						>
							<span className="LoadButton-shadow"></span>
							<span className="LoadButton-edge"></span>
							<span className="LoadButton-front text">Add Member</span>
						</button>
					</section>
				</div>
			</main>
		</>
	);
}
