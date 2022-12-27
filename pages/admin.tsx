// Imports
import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import Script from "next/script";

import { useRef, useState } from "react";

import { app, db, checkAdmin } from "../firebase";
import { collection, addDoc } from "firebase/firestore";

// CSS imports
import styles from "../styles/pages/Admin.module.css";

// Component imports
import PageTitle from "../components/parts/PageTitle";

// Interface for function
interface AdminProps {
	email: string;
	password: string;
}

// Page
export default function Admin() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [isUserAdmin, setIsUserAdmin] = useState(false);

	const adminButtonClicked = async ({ email, password }: AdminProps) => {
		console.log("clicked");
		let res = await checkAdmin({ email, password });
		console.log("resssss: " + res);
		setIsUserAdmin(res);
		console.log("isUserAdmin: " + isUserAdmin);
	};

	return (
		<>
			{/* Meta tags */}
			<Head>
				<title>NHS Admin</title>
			</Head>

			{/* ! Main homepage content */}
			<main>
				{isUserAdmin ? (
					<>
						<PageTitle title="NHS Admin" />
						<div id={`${styles.notTitle}`}>
							<section className="container-sm text-center">
								<div className="row">
									<div className="col-md-6 d-flex align-items-center justify-content-center">
										<h2>Pending Member Requests</h2>
									</div>
									<div className="col-md-6 d-flex flex-column align-items-center justify-content-center">
										<h2>Member List</h2>
									</div>
								</div>
							</section>
						</div>
					</>
				) : (
					<div className="w-100 vh-100 d-flex align-items-center justify-content-center flex-column">
						<h1>Sign in</h1>
						<input
							type="email"
							placeholder="Email"
							className={`${styles.passInput}`}
							onChange={(e) => setEmail(e.target.value)}
						/>
						<input
							type="password"
							placeholder="Password"
							className={`${styles.passInput}`}
							onChange={(e) => setPassword(e.target.value)}
						/>

						<button
							className="LoadButton-pushable my-2"
							onClick={() => {
								adminButtonClicked({ email, password });
							}}
						>
							<span className="LoadButton-shadow"></span>
							<span className="LoadButton-edge"></span>
							<span className="LoadButton-front text">Login</span>
						</button>
					</div>
				)}
			</main>
		</>
	);
}
