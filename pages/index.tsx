// Imports
import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import Script from "next/script";
import { use, useEffect, useRef, useState } from "react";
import {
	eventProps,
	getEvents,
	addEvent,
	addEventVolunteers,
	removeEventVolunteers,
} from "../firebase";
import { useEffectOnce } from "usehooks-ts";
import { InstagramEmbed } from "react-social-media-embed";
import * as EmailValidator from "email-validator";

// CSS imports
import styles from "../styles/pages/Home.module.css";

// Component imports
import ReactTypingEffect from "react-typing-effect";
import PageTitle from "../components/parts/PageTitle";
import Table from "../components/parts/Table";

// Page
export default function Home() {
	const getEventsAwait = async () => {
		return await getEvents();
	};

	const [events, setEvents] = useState<Array<eventProps>>([]);
	const [showSignUpModal, setShowSignUpModal] = useState(false);
	const [showLeaveEventModal, setShowLeaveEventModal] = useState(false);
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [eventInput, setEventInput] = useState("");

	useEffectOnce(() => {
		getEventsAwait().then((e) => setEvents(e as Array<eventProps>));
	});

	const displayModal = async () => {
		setShowSignUpModal(!showSignUpModal);
	};

	const displayLeaveEventModal = async () => {
		setShowLeaveEventModal(!showLeaveEventModal);
	};

	const addVolunteerDb = async () => {
		if (
			email === "" ||
			password === "" ||
			email === undefined ||
			password === undefined ||
			eventInput === undefined
		) {
			alert("Please fill out all fields");
		} else if (!EmailValidator.validate(email)) {
			alert("Please enter a valid email");
		} else if (password.length < 8) {
			alert("Password must be at least 8 characters");
		} else {
			addEventVolunteers(eventInput, email, password).then((e) => {
				if (e == true) {
					alert("Successfully signed up for event");
					setShowSignUpModal(!showSignUpModal);
				} else {
					console.log(e);
				}
			});
		}
	};

	const removeVolunteerDb = async () => {
		if (email === "" || email === undefined || eventInput === undefined) {
			alert("Please fill out all fields");
		} else if (!EmailValidator.validate(email)) {
			alert("Please enter a valid email");
		} else {
			removeEventVolunteers(eventInput, email, password).then((e) => {
				if (e == true) {
					alert("Successfully left event");
					setShowLeaveEventModal(!showLeaveEventModal);
				} else {
					console.log(e);
				}
			});
		}
	};

	return (
		<>
			{/* Meta tags */}
			<Head>
				<title>Lyman NHS</title>
			</Head>

			{/* ! Main homepage content */}
			<main>
				<PageTitle title="Lyman NHS">
					<p id={`${styles.motto}`}>
						<ReactTypingEffect
							text={["Character", "Scholarship", "Leadership", "Service"]}
							eraseSpeed={70}
							typingDelay={1000}
							speed={180}
							eraseDelay={2000}
							cursor="_"
						/>
					</p>
				</PageTitle>
				<div id={`${styles.notTitle}`}>
					<section id={`${styles.AboutUs}`} className="container-lg">
						<h1 className="mb-0">About Us</h1>
						<p className="mt-0 container">
							Lyman NHS is a club that focuses on community service and
							leadership. We are a group of students who are passionate about
							helping others and making a difference in our community. We
							provide opportunities for students to get involved in the
							community and to make a difference in the lives of others.
						</p>
					</section>

					<section id={`${styles.UpcomingEvents}`} className="container-lg">
						<h1 className="mb-0">Upcoming Events</h1>
						<div className="d-flex flex-row align-items-center justify-content-center">
							<button
								className="ApproveButton-pushable mb-3 mt-3 me-3"
								onClick={(a) => displayModal()}
							>
								<span className="ApproveButton-shadow"></span>
								<span className="ApproveButton-edge"></span>
								<span className="ApproveButton-front text">
									Sign up for event
								</span>
							</button>
							<button
								className="DenyButton-pushable mb-3 mt-3"
								onClick={(a) => displayLeaveEventModal()}
							>
								<span className="DenyButton-shadow"></span>
								<span className="DenyButton-edge"></span>
								<span className="DenyButton-front text">Leave event</span>
							</button>
						</div>
						{showSignUpModal ? (
							<div id={`${styles.signUpModal}`}>
								<div id={`${styles.signUpModalContent}`}>
									<Image
										src={"/img/close.svg"}
										width={30}
										height={30}
										onClick={() => setShowSignUpModal(!showSignUpModal)}
										id={`${styles.closeModal}`}
										alt="Close modal"
									/>
									<h1>Sign Up</h1>
									<p className="mb-2">
										Enter email & password for member verification
									</p>
									<input
										type="text"
										placeholder="Email"
										value={email}
										onChange={(v) => setEmail(v.target.value)}
									/>
									<input
										type="text"
										placeholder="Password"
										value={password}
										onChange={(v) => setPassword(v.target.value)}
									/>
									<p className="mb-2">Select event to sign up for</p>
									<select
										value={eventInput}
										onChange={(v) => setEventInput(v.target.value)}
									>
										{events.map((e) => (
											<option
												value={e.eventName}
												key={events.indexOf(e) + "di"}
											>
												{e.eventName}
											</option>
										))}
									</select>
									<button
										className="LoadButton-pushable my-2"
										onClick={() => addVolunteerDb()}
									>
										<span className="LoadButton-shadow"></span>
										<span className="LoadButton-edge"></span>
										<span className="LoadButton-front text">Submit</span>
									</button>
								</div>
							</div>
						) : (
							<></>
						)}
						{showLeaveEventModal ? (
							<div id={`${styles.signUpModal}`}>
								<div id={`${styles.signUpModalContent}`}>
									<Image
										src={"/img/close.svg"}
										width={30}
										height={30}
										onClick={() => setShowLeaveEventModal(!showLeaveEventModal)}
										id={`${styles.closeModal}`}
										alt="Close modal"
									/>
									<h1>Leave Event</h1>
									<p className="mb-2">
										Enter email & password for member verification
									</p>
									<input
										type="text"
										placeholder="Email"
										value={email}
										onChange={(v) => setEmail(v.target.value)}
									/>
									<input
										type="text"
										placeholder="Password"
										value={password}
										onChange={(v) => setPassword(v.target.value)}
									/>
									<p className="mb-2">Select event to leave</p>
									<select
										value={eventInput}
										onChange={(v) => setEventInput(v.target.value)}
									>
										{events.map((e) => (
											<option
												value={e.eventName}
												key={events.indexOf(e) + "di"}
											>
												{e.eventName}
											</option>
										))}
									</select>
									<button
										className="LoadButton-pushable my-2"
										onClick={() => removeVolunteerDb()}
									>
										<span className="LoadButton-shadow"></span>
										<span className="LoadButton-edge"></span>
										<span className="LoadButton-front text">Submit</span>
									</button>
								</div>
							</div>
						) : (
							<></>
						)}

						<Table
							minHeight={"20vh"}
							maxHeight={"85vh"}
							bgColor={"rgba(0,0,0,0.2)"}
							widthVal={"90%"}
						>
							<div className="d-flex justify-content-center w-100">
								<div className={`row w-100 ${styles.tableUpcomingEventsItem}`}>
									<div className=" d-lg-flex justify-content-lg-center w-100">
										<div className={`col-lg-6`}>
											{events
												.filter((ee) => events.indexOf(ee) % 2 == 0)
												.map((e) => {
													return (
														<div
															className={`${styles.event} mb-2`}
															key={events.indexOf(e) + "event"}
														>
															<h2>{e.eventName}</h2>
															<Table widthVal={"95%"} bgColor="rgba(0,0,0,0.2)">
																<div className="d-flex justify-content-center w-100 align-items-center">
																	<div className={`${styles.eventCard} row`}>
																		<div className="col-sm-6">
																			<label>Date</label>
																			<p>{e.date}</p>
																			<label>Location</label>
																			<p>{e.location}</p>
																			<label>Start Time</label>
																			<p>{e.startTime}</p>
																		</div>

																		<div className="col-sm-6">
																			<label>End Time</label>
																			<p>{e.endTime}</p>
																			<label>Volunteers Needed</label>
																			<p>{e.volunteersNeeded}</p>
																			<label>Currently Signed Up</label>
																			<p>
																				{/* map volunteers array */}
																				{e.volunteers.map((v) => {
																					return (
																						<span key={v + "volunteer"}>
																							{v}
																							<br />
																						</span>
																					);
																				})}
																			</p>
																		</div>
																	</div>
																</div>
															</Table>
														</div>
													);
												})}
										</div>
										<div className={`col-lg-6`}>
											{events
												.filter((ee) => events.indexOf(ee) % 2 != 0)
												.map((e) => {
													return (
														<div
															className={`${styles.event} mb-2`}
															key={events.indexOf(e) + "event"}
														>
															<h2>{e.eventName}</h2>
															<Table widthVal={"95%"} bgColor="rgba(0,0,0,0.2)">
																<div className="d-flex justify-content-center w-100 align-items-center">
																	<div className={`${styles.eventCard} row`}>
																		<div className="col-sm-6">
																			<label>Date</label>
																			<p>{e.date}</p>
																			<label>Location</label>
																			<p>{e.location}</p>
																			<label>Start Time</label>
																			<p>{e.startTime}</p>
																		</div>

																		<div className="col-sm-6">
																			<label>End Time</label>
																			<p>{e.endTime}</p>
																			<label>Volunteers Needed</label>
																			<p>{e.volunteersNeeded}</p>
																			<label>Currently Signed Up</label>
																			<p>
																				{/* map volunteers array */}
																				{e.volunteers.map((v) => {
																					return (
																						<span key={v + "volunteer"}>
																							{v}
																							<br />
																						</span>
																					);
																				})}
																			</p>
																		</div>
																	</div>
																</div>
															</Table>
														</div>
													);
												})}
										</div>
									</div>
								</div>
							</div>
						</Table>
					</section>
					<section id={`${styles.RecentEvents}`}></section>
					<section id={`${styles.SocialMedia}`} className="container-lg">
						<h1 className="mb-3">Recent Posts</h1>
						<Table
							minHeight={"20vh"}
							maxHeight={"85vh"}
							bgColor={"rgba(0,0,0,0.2)"}
							widthVal={"90%"}
						>
							<div className="row d-flex justify-content-center w-100">
								<div className="d-xl-flex justify-content-xl-center col-xl-6">
									<div style={{ display: "flex", justifyContent: "center" }}>
										<InstagramEmbed
											url="https://www.instagram.com/p/Cl6g18quwVd/"
											width={328}
											captioned
										/>
									</div>
								</div>
								<div className="d-xl-flex justify-content-xl-center col-xl-6">
									<div style={{ display: "flex", justifyContent: "center" }}>
										<InstagramEmbed
											url="https://www.instagram.com/p/ClOorpmOs-8/"
											width={328}
											captioned
										/>
									</div>
								</div>
							</div>
						</Table>
					</section>
					<section id={`${styles.People}`}></section>
				</div>
			</main>
		</>
	);
}
