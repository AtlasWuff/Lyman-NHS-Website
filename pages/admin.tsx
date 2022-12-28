// Imports
import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import Script from "next/script";
import { useEffect, useRef, useState } from "react";
import { ExportToCsv } from "export-to-csv";
import {
	checkAdmin,
	getAccounts,
	AccInterface,
	updateMember,
	deleteMember,
	makeMemberAdmin,
	makeMemberNotAdmin,
} from "../firebase";
import { collection, addDoc, updateDoc } from "firebase/firestore";

// CSS imports
import styles from "../styles/pages/Admin.module.css";

// Component imports
import PageTitle from "../components/parts/PageTitle";
import Table from "../components/parts/Table";
import Collapsable from "../components/parts/Collapsable";

// Interface for function
interface AdminProps {
	email: string;
	password: string;
}

// Page
export default function Admin() {
	// Basically says that the accounts state is an array of the AccInterface type
	interface Accounts {
		accounts: Array<AccInterface>;
	}

	// States for the page
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [isUserAdmin, setIsUserAdmin] = useState(false);
	const [showLoading, setShowLoading] = useState(false);
	const [accounts, setAccounts] = useState<Accounts>({ accounts: [] });

	// Table Loading states
	const [pendingMemberTableLoading, setPendingMemberTableLoading] =
		useState(false);

	/* Check if user is admin changing state to true if they are
	 * @param {AdminProps} email, password
	 * @return {void}
	 */
	const adminButtonClicked = async ({ email, password }: AdminProps) => {
		await setShowLoading(true);
		let res = await checkAdmin({ email, password });
		setIsUserAdmin(res);
		setShowLoading(false);
	};

	/* Get accounts
	 * @param {void}
	 * @return {Promise}
	 */
	const getAccAwait = async () => {
		return await getAccounts();
	};

	/* Get accounts on page load
	 * @param {void}
	 * @return {void}
	 */
	useEffect(() => {
		getAccAwait().then((res) => {
			setAccounts({ accounts: res });
		});
	}, []);

	/* Approve pending member removing them from the state and database
	 * @param {number} index
	 * @return {void}
	 */
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
		refreshAccounts();
	};

	/* Deny pending member removing them from the state and database
	 * @param {number} index
	 * @return {void}
	 */
	const denyPendingMember = async (index: number) => {
		const accs: any = accounts.accounts;
		await deleteMember(
			accounts.accounts[index].firstName +
				" " +
				accounts.accounts[index].lastName
		);

		let thing = accs.filter(
			(item: any) =>
				item.firstName + " " + item.lastName !=
				accs[index].firstName + " " + accs[index].lastName
		) as any;

		setAccounts({
			accounts: thing,
		});
		refreshAccounts();
	};

	/* Refresh accounts updating the state
	 * @param {void}
	 * @return {void}
	 */
	const refreshAccounts = async () => {
		getAccAwait().then((res) => {
			setAccounts({ accounts: res });
		});
	};

	/* Export member list to spreadsheet
	 * @param {accounts}
	 * @return {void}
	 * TODO: Implement
	 */
	const exportMemberListToSpreadsheet = async (accounts: Array<object>) => {
		let betterAccounts = accounts.map((item: any) => {
			return {
				First_Name: item.firstName,
				Last_Name: item.lastName,
				Email: item.email,
				Grade: item.grade,
			};
		});

		const options = {
			fieldSeparator: ",",
			filename: "VerifiedMembers",
			quoteStrings: '"',
			decimalSeparator: ".",
			showLabels: true,
			showTitle: true,
			title: "NHS Member List",
			useTextFile: false,
			useBom: true,
			headers: ["First Name", "Last Name", "Email", "Grade"],
			// useKeysAsHeaders: true, // headers: ['Column 1', 'Column 2', etc...] <-- Won't work with useKeysAsHeaders present!
		};
		const csvExporter = new ExportToCsv(options);
		csvExporter.generateCsv(betterAccounts);
		// console.log(await getAccAwait());
	};

	const makeMemberAdminRemove = async (name: string) => {
		await makeMemberAdmin(name);
		refreshAccounts();
	};

	const makeMemberNotAdminRemove = async (name: string) => {
		await makeMemberNotAdmin(name);
		refreshAccounts();
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
										<p>
											New profiles show below here and require approval before
											being added to the member list
										</p>
										<Table maxHeight={"80vh"} minHeight={"20vh"}>
											{/* Maps through all accounts that are pending and displays them */}
											{/* If there are no pending accounts, display a message */}
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
																	<div className={`${styles.MemberItemText}`}>
																		<Collapsable
																			initText={
																				account.firstName +
																				" " +
																				account.lastName
																			}
																			className="w-100"
																		>
																			<p>
																				<b>Email:</b> {account.email}
																			</p>
																			<p>
																				<b>Grade:</b> {account.grade}
																			</p>
																		</Collapsable>
																	</div>

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
																				denyPendingMember(
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
										</Table>
									</div>
									<div className="col-md-6 d-flex flex-column align-items-center ">
										<h2>Member List</h2>
										<button
											className="LoadButton-pushable mb-2"
											onClick={() =>
												exportMemberListToSpreadsheet(accounts.accounts)
											}
										>
											<span className="LoadButton-shadow"></span>
											<span className="LoadButton-edge"></span>

											<span className="LoadButton-front text">
												Export to CSV
											</span>
										</button>
										<Table minHeight={"20vh"} maxHeight={"80vh"}>
											{/* Maps through the accounts array and displays the accounts that are approved */}
											{/* If there are no approved accounts, it will display a message */}
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
																	<div className={`${styles.MemberItemText}`}>
																		<Collapsable
																			initText={
																				account.firstName +
																				" " +
																				account.lastName
																			}
																			className="w-100"
																		>
																			<p>
																				<b>Email:</b> {account.email}
																			</p>
																			<p>
																				<b>Grade:</b> {account.grade}
																			</p>
																		</Collapsable>
																	</div>
																	<div
																		className="d-flex align-items-center justify-content-center flex-row"
																		id={`${styles.adminOptionsDiv}`}
																	>
																		{account.isAdmin != true ? (
																			<button
																				className="ApproveButton-pushable me-2"
																				onClick={(e) => {
																					makeMemberAdminRemove(
																						account.firstName +
																							" " +
																							account.lastName
																					);
																				}}
																			>
																				<span className="ApproveButton-shadow"></span>
																				<span className="ApproveButton-edge"></span>

																				<span className="ApproveButton-front text">
																					Make Admin
																				</span>
																			</button>
																		) : (
																			<button
																				className="DenyButton-pushable me-2"
																				onClick={(e) => {
																					makeMemberNotAdminRemove(
																						account.firstName +
																							" " +
																							account.lastName
																					);
																				}}
																			>
																				<span className="DenyButton-shadow"></span>
																				<span className="DenyButton-edge"></span>

																				<span className="DenyButton-front text">
																					Remove Admin
																				</span>
																			</button>
																		)}
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
										</Table>
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
