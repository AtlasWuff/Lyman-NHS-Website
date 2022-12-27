// Imports
import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import Script from "next/script";

import { useEffect, useRef, useState } from "react";

import {
	checkAdmin,
	getAccounts,
	AccInterface,
	updateMember,
	deleteMember,
} from "../firebase";
import { collection, addDoc, updateDoc } from "firebase/firestore";

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
	const [showLoading, setShowLoading] = useState(false);

	interface Accounts {
		accounts: Array<AccInterface>;
	}
	const [accounts, setAccounts] = useState<Accounts>({ accounts: [] });

	const adminButtonClicked = async ({ email, password }: AdminProps) => {
		await setShowLoading(true);
		let res = await checkAdmin({ email, password });
		setIsUserAdmin(res);
		setShowLoading(false);
	};

	const getAccAwait = async () => {
		return await getAccounts();
	};

	useEffect(() => {
		getAccAwait().then((res) => {
			setAccounts({ accounts: res });
		});
		console.log("Fetched accounts");
	}, []);

	const approvePendingMember = async (index: number) => {
		const accs: any = accounts.accounts;
		console.log(accs);
		await updateMember(accs[index].firstName + " " + accs[index].lastName, {
			isVerified: true,
		});

		let thing = accs.filter(
			(item: any) =>
				item.firstName + " " + item.lastName !=
				accs[index].firstName + " " + accs[index].lastName
		) as any;

		setAccounts({
			accounts: thing,
		});
	};

	const denyPendingMember = async (index: number) => {
		await deleteMember(
			accounts.accounts[index].firstName +
				" " +
				accounts.accounts[index].lastName
		);
	};

	const refreshAccounts = async () => {
		getAccAwait().then((res) => {
			setAccounts({ accounts: res });
		});
		console.log("Fetched accounts");
		console.log(accounts);
	};

	const expandMember = (index: number) => {
		console.log(index);
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
								<h1>Profile Managment</h1>
								<div className="row">
									<div
										className="col-md-6 d-flex align-items-center flex-column"
										id={`${styles.pendingMembers}`}
									>
										<h2>Pending Members</h2>
										<button onClick={() => refreshAccounts()}>Refresh</button>
										<p>
											New profiles show below here and require approval before
											being added to the member list
										</p>
										<div className={`${styles.MembersWrap}`}>
											<div className={`${styles.Members}`}>
												{accounts.accounts.filter(
													(item) => item.isVerified == false
												).length > 0 ? (
													accounts.accounts
														.filter((item) => item.isVerified == false)
														.map((account) => {
															return (
																<div
																	key={accounts.accounts.indexOf(account)}
																	className={`${styles.pendingMember} w-100`}
																>
																	<div className="d-flex justify-content-between w-100 flex-row">
																		<button
																			className={`${styles.pendingPWrap}`}
																			onClick={(e) => {
																				expandMember(
																					accounts.accounts.indexOf(account)
																				);
																			}}
																		>
																			<p>
																				{account.firstName +
																					" " +
																					account.lastName}
																			</p>
																		</button>
																		<div className="d-flex align-items-center justify-content-center flex-row">
																			<button
																				className="ApproveButton-pushable me-2"
																				onClick={(e) => {
																					approvePendingMember(
																						accounts.accounts.indexOf(account)
																					);
																				}}
																			>
																				<span className="ApproveButton-shadow"></span>
																				<span className="ApproveButton-edge"></span>

																				<span className="ApproveButton-front text">
																					Approve
																				</span>
																			</button>
																			<button
																				className="DenyButton-pushable"
																				onClick={(e) => {
																					approvePendingMember(
																						accounts.accounts.indexOf(account)
																					);
																				}}
																			>
																				<span className="DenyButton-shadow"></span>
																				<span className="DenyButton-edge"></span>

																				<span className="DenyButton-front text">
																					Deny
																				</span>
																			</button>
																		</div>
																	</div>
																</div>
															);
														})
												) : (
													<div className="d-flex align-items-center justify-content-center w-100">
														<label className={`${styles.noPending}`}>
															No pending members
														</label>
													</div>
												)}
											</div>
										</div>
									</div>
									<div className="col-md-6 d-flex flex-column align-items-center ">
										<h2>Member List</h2>
										<div className={`${styles.MembersWrap}`}>
											<div className={`${styles.Members}`}>
												{accounts.accounts.filter(
													(item) => item.isVerified == true
												).length > 0 ? (
													accounts.accounts
														.filter((item) => item.isVerified == true)
														.map((account) => {
															return (
																<div
																	key={accounts.accounts.indexOf(account)}
																	className={`${styles.pendingMember} w-100`}
																>
																	<div className="d-flex justify-content-between w-100 flex-row">
																		<button
																			className={`${styles.pendingPWrap}`}
																			onClick={(e) => {
																				expandMember(
																					accounts.accounts.indexOf(account)
																				);
																			}}
																		>
																			<p>
																				{account.firstName +
																					" " +
																					account.lastName}
																			</p>
																		</button>
																	</div>
																</div>
															);
														})
												) : (
													<div className="d-flex align-items-center justify-content-center w-100">
														<label className={`${styles.noPending}`}>
															No pending members
														</label>
													</div>
												)}
											</div>
										</div>
									</div>
								</div>
							</section>
						</div>
					</>
				) : (
					<>
						{showLoading ? (
							<div className="w-100 vh-100 d-flex justify-content-center align-items-center flex-column">
								<div
									className="snake position-relative"
									id={styles.snake}
								></div>
							</div>
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
					</>
				)}
			</main>
		</>
	);
}
