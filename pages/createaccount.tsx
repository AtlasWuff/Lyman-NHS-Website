// Imports
import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import Script from "next/script";

import { useRef, useState } from "react";

import { app, db, newAccount } from "../firebase";
import { collection, addDoc } from "firebase/firestore";

// CSS imports
import styles from "../styles/pages/CreateAccount.module.css";

// Component imports
import PageTitle from "../components/parts/PageTitle";

// Page
export default function CreateAccount() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");

	const [firstName, setFirstName] = useState("");
	const [lastName, setLastName] = useState("");
	const [grade, setGrade] = useState("");

	let allInputs: Array<string | number> = [
		email,
		password,
		firstName,
		lastName,
		grade,
	];

	return (
		<>
			{/* Meta tags */}
			<Head>
				<title>NHS Admin</title>
			</Head>

			{/* ! Main homepage content */}
			<main>
				{/* <PageTitle title="Create Account"></PageTitle> */}
				<div id={`${styles.notTitle}`}>
					<div id={`${styles.loginBg}`}>
						<Image src={"/img/campus.jpg"} fill alt="" />
					</div>
					<section id={`${styles.loginModal}`}>
						<h1>Create Profile</h1>
						<div id={`${styles.loginForm}`}>
							<h2>Profile info</h2>
							<div className={`${styles.loginInput}`}>
								<p>Email</p>
								<input
									type="text"
									onChange={(e) => setEmail(e.target.value)}
									value={email}
								/>
							</div>
							<div className={`${styles.loginInput}`}>
								<p>Password</p>
								<input
									type="text"
									onChange={(e) => setPassword(e.target.value)}
									value={password}
								/>
							</div>

							<h2>Other</h2>
							<div className={`${styles.loginInput}`}>
								<p>First Name</p>
								<input
									type="text"
									value={firstName}
									onChange={(e) => setFirstName(e.target.value)}
								/>
							</div>
							<div className={`${styles.loginInput}`}>
								<p>Last Name</p>
								<input
									type="text"
									value={lastName}
									onChange={(e) => setLastName(e.target.value)}
								/>
							</div>
							<div className={`${styles.loginInput}`}>
								<p>Grade</p>
								<input
									type="number"
									value={grade}
									onChange={(e) => setGrade(e.target.value)}
								/>
							</div>
							<div className={`${styles.loginButton}`}>
								<button
									className="LoadButton-pushable my-3"
									onClick={() => {
										newAccount({
											email: email,
											password: password,
											firstName: firstName,
											lastName: lastName,
											grade: grade,
											isAdmin: false,
											isVerified: false,
										});
									}}
								>
									<span className="LoadButton-shadow"></span>
									<span className="LoadButton-edge"></span>

									<span className="LoadButton-front text">Create Profile</span>
								</button>
							</div>
						</div>
					</section>
				</div>
			</main>
		</>
	);
}
