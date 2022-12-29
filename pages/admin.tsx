// Imports
import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import Script from "next/script";
import { Ref, useEffect, useRef, useState } from "react";
import { ExportToCsv } from "export-to-csv";
import {
	checkAdmin,
	getAccounts,
	AccInterface,
	updateMember,
	deleteMember,
	makeMemberAdmin,
	makeMemberNotAdmin,
	eventProps,
	getEvents,
	addEvent,
	deleteEvent,
} from "../firebase";
import { collection, addDoc, updateDoc } from "firebase/firestore";
import { useEffectOnce } from "usehooks-ts";

// CSS imports
import styles from "../styles/pages/Admin.module.css";

// Component imports
import PageTitle from "../components/parts/PageTitle";
import Table from "../components/parts/Table";
import Collapsable from "../components/parts/Collapsable";
import { data } from "jquery";

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
	useEffectOnce(() => {
		getAccAwait().then((res) => {
			setAccounts({ accounts: res });
		});
		getEventAwait().then((res) => {
			setEvents({ events: res });
		});
	});

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
		await refreshAccounts();
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
		await refreshAccounts();
	};

	/* Refresh accounts updating the state
	 * @param {void}
	 * @return {void}
	 */
	const refreshAccounts = async () => {
		return new Promise((resolve, reject) => {
			getAccAwait().then((res) => {
				setAccounts({ accounts: res });
				resolve(res);
			});
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
				VolunteerHours: item.volunteerHours,
				TutoringHours: item.tutoringHours,
			};
		});

		const options = {
			fieldSeparator: ",",
			filename: "MemberInfoList",
			quoteStrings: '"',
			decimalSeparator: ".",
			showLabels: true,
			showTitle: true,
			title: "NHS Member List",
			useTextFile: false,
			useBom: true,
			headers: [
				"First Name",
				"Last Name",
				"Email",
				"Grade",
				"Volunteer Hours",
				"Tutoring Hours",
			],
			// useKeysAsHeaders: true, // headers: ['Column 1', 'Column 2', etc...] <-- Won't work with useKeysAsHeaders present!
		};
		const csvExporter = new ExportToCsv(options);
		csvExporter.generateCsv(betterAccounts);
		alert(
			"Put the file in google drive and it will interpret it as a spreadsheet"
		);
		// console.log(await getAccAwait());
	};

	const makeMemberAdminRemove = async (name: string) => {
		await makeMemberAdmin(name);
		await refreshAccounts();
	};

	const makeMemberNotAdminRemove = async (name: string) => {
		await makeMemberNotAdmin(name);
		await refreshAccounts();
	};

	interface EventsStateProp {
		events: Array<eventProps>;
	}

	const [eventName, setEventName] = useState("");
	const [eventDate, setEventDate] = useState("");
	const [eventLocation, setEventLocation] = useState("");
	const [eventStartTime, setEventStartTime] = useState("");
	const [eventEndTime, setEventEndTime] = useState("");
	const [eventVolunteersNeeded, setEventVolunteersNeeded] = useState("");
	const [eventVolunteersSignedUp, setEventVolunteersSignedUp] = useState([]);
	const [events, setEvents] = useState<EventsStateProp>({ events: [] });
	const [eventIsTutoring, setEventIsTutoring] = useState<boolean>(false);

	/* Refresh accounts updating the state
	 * @param {void}
	 * @return {void}
	 */
	const getEventAwait = async () => {
		return await getEvents();
	};

	const refreshEvents = async () => {
		return new Promise((resolve, reject) => {
			getEventAwait().then((res) => {
				setEvents({ events: res });
				resolve(res);
			});
		});
	};

	const addEventRefresh = async () => {
		// console.log({
		// 	eventName: eventName,
		// 	date: eventDate,
		// 	location: eventLocation,
		// 	startTime: eventStartTime,
		// 	endTime: eventEndTime,
		// 	volunteersNeeded: eventVolunteersNeeded,
		// 	volunteers: eventVolunteersSignedUp,
		// });
		if (
			eventName == "" ||
			eventDate == "" ||
			eventLocation == "" ||
			eventStartTime == "" ||
			eventEndTime == "" ||
			eventVolunteersNeeded == "" ||
			eventName == undefined ||
			eventDate == undefined ||
			eventLocation == undefined ||
			eventStartTime == undefined ||
			eventEndTime == undefined ||
			eventVolunteersNeeded == undefined ||
			eventIsTutoring == undefined
		) {
			alert("Please fill out all fields");
			return;
		}
		if (
			isNaN(parseInt(eventVolunteersNeeded)) ||
			eventVolunteersNeeded == "0"
		) {
			alert("Please enter a number for volunteers needed");
			return;
		}

		addEvent({
			eventName: eventName,
			date: eventDate,
			location: eventLocation,
			startTime: eventStartTime,
			endTime: eventEndTime,
			volunteersNeeded: eventVolunteersNeeded,
			volunteers: eventVolunteersSignedUp,
			isTutoring: eventIsTutoring,
		}).then(async () => {
			setEvents({
				events: [
					...events.events,
					{
						eventName: eventName,
						date: eventDate,
						location: eventLocation,
						startTime: eventStartTime,
						endTime: eventEndTime,
						volunteersNeeded: eventVolunteersNeeded,
						volunteers: eventVolunteersSignedUp,
						isTutoring: eventIsTutoring,
					},
				],
			});
			await refreshEvents();
		});
	};

	const deleteEventRefresh = async (name: string, datee: string) => {
		await deleteEvent(name, datee);
		setEvents({
			events: events.events.filter(
				(event) => event.eventName !== name && event.date !== datee
			),
		});
		await refreshEvents();
	};

	const loadItemsButtonRef = useRef<HTMLButtonElement>(null);
	const deleteRefItem = async (ref: any) => {
		if (ref.current) {
			for (let i = 0; i < ref.current.children.length; i++) {
				ref.current.removeChild(ref.current.children[i]);
			}
			ref.current.remove();
		}
	};

	const [hoursName, setHoursName] = useState("");
	const [hoursNewVolunteerHours, setHoursNewVolunteerHours] = useState("");
	const [hoursNewTutoringHours, setHoursNewTutoringHours] = useState("");

	return (
		<>
			{/* Meta tags */}
			<Head>
				<title>Lyman NHS</title>
			</Head>

			{/* ! Main homepage content */}
			<main>
				{isUserAdmin ? (
					<>
						<PageTitle title="NHS Admin" />
						<div id={`${styles.notTitle}`}>
							<section
								className={`${styles.adminSection} container-sm text-center`}
							>
								<h1>Profile Managment</h1>
								{/* <button
									className="LoadButton-pushable my-2"
									onClick={async () => {
										await refreshAccounts();
										await refreshEvents();
										deleteRefItem(loadItemsButtonRef);
									}}
									ref={loadItemsButtonRef}
								>
									<span className="LoadButton-shadow"></span>
									<span className="LoadButton-edge"></span>
									<span className="LoadButton-front text">Load Items</span>
								</button> */}
								<div className="row">
									<div
										className="col-lg-6 d-flex align-items-center flex-column"
										id={`${styles.pendingMembers}`}
									>
										<h2>Pending Members</h2>
										<p>
											New profiles show below here and require approval before
											being added to the member list
										</p>
										<Table
											maxHeight={"80vh"}
											minHeight={"20vh"}
											bgColor={"rgba(0,0,0,0.2)"}
										>
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
									<div className="col-lg-6 d-flex flex-column align-items-center ">
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
										<Table
											minHeight={"20vh"}
											maxHeight={"80vh"}
											bgColor={"rgba(0,0,0,0.2)"}
										>
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
																			<p>
																				<b>Volunteer Hours:</b>{" "}
																				{account.volunteerHours}
																			</p>
																			<p>
																				<b>Tutoring Hours:</b>{" "}
																				{account.tutoringHours}
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
							<section
								className={`${styles.adminSection} container-sm text-center`}
							>
								<h1>Events</h1>
								<div className="row">
									<div
										className="col-12 col-lg-6 container-md"
										id={`${styles.addEventForm}`}
									>
										<h2>Add Event</h2>
										<div className={`${styles.eventInput}`}>
											<p>Event Name</p>
											<input
												type="text"
												onChange={(e) => setEventName(e.target.value.trim())}
												value={eventName}
											/>
										</div>
										<div className={`${styles.eventInput}`}>
											<p>Date</p>
											<input
												type="date"
												onChange={(e) => setEventDate(e.target.value.trim())}
												value={eventDate}
											/>
										</div>
										<div className={`${styles.eventInput}`}>
											<p>Location</p>
											<input
												type="text"
												onChange={(e) =>
													setEventLocation(e.target.value.trim())
												}
												value={eventLocation}
											/>
										</div>
										<div className={`${styles.eventInput}`}>
											<p>Start Time</p>
											<input
												type="text"
												onChange={(e) =>
													setEventStartTime(e.target.value.trim())
												}
												value={eventStartTime}
											/>
										</div>
										<div className={`${styles.eventInput}`}>
											<p>End Time</p>
											<input
												type="text"
												onChange={(e) => setEventEndTime(e.target.value.trim())}
												value={eventEndTime}
											/>
										</div>
										<div className={`${styles.eventInput} mb-2`}>
											<p>Volunteers Needed</p>
											<input
												type="text"
												onChange={(e) =>
													setEventVolunteersNeeded(e.target.value.trim())
												}
												value={eventVolunteersNeeded}
											/>
										</div>
										<div className={`${styles.eventInput} mb-2`}>
											<p>Is this a tutoring event?</p>
											<input
												type="checkbox"
												onChange={(e) => setEventIsTutoring(e.target.checked)}
											/>
										</div>
										<button
											className="ApproveButton-pushable mb-3"
											onClick={() => {
												addEventRefresh();
											}}
										>
											<span className="ApproveButton-shadow"></span>
											<span className="ApproveButton-edge"></span>

											<span className="ApproveButton-front text">
												Add Event
											</span>
										</button>
									</div>
									<div className="col-12 col-lg-6 d-flex align-items-center justify-content-center flex-column">
										<h2>Events</h2>
										<Table
											minHeight={"20vh"}
											maxHeight={"80vh"}
											bgColor={"rgba(0,0,0,0.2)"}
										>
											{events.events.length > 0 ? (
												events.events.map((event: eventProps) => {
													return (
														<div
															className={`${styles.eventsItem}`}
															key={
																"event" + events.events.indexOf(event as never)
															}
														>
															<div className="d-flex align-items-center justify-content-center flex-row w-100 flex-wrap">
																<Collapsable
																	initText={event.eventName}
																	className="w-100"
																>
																	<p>
																		<b>Date:</b> {event.date}
																	</p>
																	<p>
																		<b>Location:</b> {event.location}
																	</p>
																	<p>
																		<b>Start Time:</b> {event.startTime}
																	</p>
																	<p>
																		<b>End Time:</b> {event.endTime}
																	</p>
																	<p>
																		<b>Volunteers Needed: </b>
																		{event.volunteersNeeded}
																	</p>
																	<p>
																		<b>Volunteers: </b>
																		{event.volunteers}
																	</p>
																</Collapsable>
															</div>
															<div
																className="d-flex align-items-center justify-content-center flex-row"
																id={`${styles.eventDeleteButtonDiv}`}
															>
																<button
																	className="DenyButton-pushable"
																	onClick={() => {
																		deleteEventRefresh(
																			event.eventName,
																			event.date
																		);
																	}}
																>
																	<span className="DenyButton-shadow"></span>
																	<span className="DenyButton-edge"></span>

																	<span className="DenyButton-front text">
																		Delete
																	</span>
																</button>
															</div>
														</div>
													);
												})
											) : (
												<div className="d-flex align-items-center justify-content-center w-100">
													<label className={`${styles.noPending}`}>
														No events
													</label>
												</div>
											)}
										</Table>
									</div>
								</div>
							</section>
							<section
								className={`${styles.adminSection} container-sm text-center`}
							>
								<h1>Hours Managments</h1>
								<p>
									New hours are <b>not</b> additive, it replaces the previous
									value. Ensure all hours are what the member should have after
									clicking submit. Values shown in the dropdown are the members
									current hours{" "}
								</p>
								<div className="w-100 d-flex align-items-center justify-content-center flex-column container">
									<div className={`${styles.eventInput}`}>
										<p>Member: </p>
										<select
											value={hoursName}
											onChange={(v) => setHoursName(v.target.value)}
										>
											{accounts.accounts
												.filter((e) => e.isVerified == true)
												.map((e) => (
													<option
														value={e.firstName + " " + e.lastName}
														key={accounts.accounts.indexOf(e) + "di"}
													>
														{e.firstName +
															" " +
															e.lastName +
															" | Volunteer: " +
															e.volunteerHours +
															" Tutor: " +
															e.tutoringHours}
													</option>
												))}
										</select>
									</div>

									<div className={`${styles.eventInput}`}>
										<p>New Volunteer Hours</p>
										<input
											type="text"
											onChange={(e) =>
												setHoursNewVolunteerHours(e.target.value.trim())
											}
											value={hoursNewVolunteerHours}
										/>
									</div>
									<div className={`${styles.eventInput}`}>
										<p>New Tutoring Hours</p>
										<input
											type="text"
											onChange={(e) =>
												setHoursNewTutoringHours(e.target.value.trim())
											}
											value={hoursNewTutoringHours}
										/>
									</div>
									<button
										className="ApproveButton-pushable mb-3"
										onClick={async () => {
											updateMember(hoursName, {
												volunteerHours: hoursNewVolunteerHours,
												tutoringHours: hoursNewTutoringHours,
											}).then(() => {
												alert("Updated");
											});
										}}
									>
										<span className="ApproveButton-shadow"></span>
										<span className="ApproveButton-edge"></span>

										<span className="ApproveButton-front text">Submit</span>
									</button>
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
									onChange={(e) => setEmail(e.target.value.trim())}
								/>
								<input
									type="password"
									placeholder="Password"
									className={`${styles.passInput}`}
									onChange={(e) => setPassword(e.target.value.trim())}
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
