// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore, deleteDoc, getDoc } from "firebase/firestore";
import {
	collection,
	setDoc,
	doc,
	getDocs,
	updateDoc,
} from "firebase/firestore";
import * as EmailValidator from "email-validator";
import { uuid } from "uuidv4";
var HTTPS = require("https");

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const thingyNoScrapers = {
	// ! Use this for production
	// apiKey: process.env.fbApiKey as string,
	// authDomain: process.env.fbAuthDomain as string,
	// databaseURL: process.env.fbDatabaseURL as string,
	// projectId: process.env.fbProjectId as string,
	// storageBucket: process.env.fbStorageBucket as string,
	// messagingSenderId: process.env.fbMessagingSenderId as string,
	// appId: process.env.fbAppId as string,
	// measurementId: process.env.fbMeasurementId as string,
	// ! Use this for local testing
	apiKey: "AIzaSyB58NIHafzDPAIk1bSCyLcVw6rGF5a3K94",
	authDomain: "lyman-nhs-website.firebaseapp.com",
	databaseURL: "https://lyman-nhs-website-default-rtdb.firebaseio.com",
	projectId: "lyman-nhs-website",
	storageBucket: "lyman-nhs-website.appspot.com",
	messagingSenderId: "533934587284",
	appId: "1:533934587284:web:f1963deddd80d3cafe6381",
	measurementId: "G-NFHGDK9N6V",
};

// Initialize Firebase
export const app = initializeApp(thingyNoScrapers);
export const db = getFirestore(app);

// Mailjet
import emailjs from "@emailjs/browser";
emailjs.init("uq4kVKFRDwE7pFfsW");

// All DBs
const eventsDb = collection(db, "Events");
console.log("Events db line 50");
export const accountsDb = collection(db, "Accounts");
console.log("Accounts db line 52");
const messagesDb = collection(db, "Messages");
const requestsDb = collection(db, "Requests");

export interface eventProps {
	eventName: string;
	date: string;
	location: string;
	startTime: string;
	endTime: string;
	volunteersNeeded: string;
	volunteers: string[];
	isTutoring: boolean;
	tutorHost: string;
	teachers: string;
}

export const didAccLogin = async (
	eventName: string,
	email: string,
	password: string,
	querySnapshot: any
) => {
	return new Promise<boolean>(async (resolve, reject) => {
		querySnapshot.forEach((doc: any) => {
			if (
				doc.data().email.toLowerCase() === email.toLowerCase() &&
				doc.data().password === password
			) {
				resolve(true);
			}
		});
		resolve(false);
	});
};

export const getEventVolunteers = async (eventName: string) => {
	return new Promise<string[]>(async (resolve, reject) => {
		let querySnapshot: any;
		try {
			querySnapshot = await getDocs(eventsDb);
			console.log(querySnapshot.docs);
		} catch (err) {
			console.log(err);
			alert(
				"Error: The database is likely at read capacity, please try again tomorrow."
			);
			reject(err);
		}

		querySnapshot.forEach((doc: any) => {
			if (doc.data().eventName.toLowerCase() == eventName.toLowerCase()) {
				resolve(doc.data().volunteers);
			}
		});
	});
};

export const getNameFromEmail = async (email: string, querySnapshot: any) => {
	return new Promise<string>(async (resolve, reject) => {
		querySnapshot.forEach((doc: any) => {
			if (doc.data().email.toLowerCase() == email.toLowerCase()) {
				resolve(doc.data().firstName + " " + doc.data().lastName);
			}
		});
	});
};

export const getIsVerfiedFromEmail = async (
	email: string,
	querySnapshot: any
) => {
	return new Promise<boolean>(async (resolve, reject) => {
		querySnapshot.forEach((doc: any) => {
			if (doc.data().email.toLowerCase() == email.toLowerCase()) {
				resolve(doc.data().isVerified);
			}
		});
	});
};

export const isPersonInVolunteers = async (
	email: string,
	name: string,
	eventName: string
) => {
	return new Promise<boolean>(async (resolve, reject) => {
		let querySnapshot: any;
		try {
			querySnapshot = await getDocs(eventsDb);
		} catch (err) {
			console.log(err);
			alert(
				"Error: The database is likely at read capacity, please try again tomorrow."
			);
			reject(err);
		}
		if (querySnapshot.empty) {
			alert("No events found");
			resolve(false);
			return;
		}

		for (let i = 0; i < querySnapshot.size; i++) {
			if (
				querySnapshot.docs[i].data().eventName.toLowerCase() ==
				eventName.toLowerCase()
			) {
				let volunteers = querySnapshot.docs[i].data().volunteers;
				for (let j = 0; j < volunteers.length; j++) {
					if (volunteers[j] == name) {
						resolve(true);
						return;
					}
				}
			}
		}
		resolve(false);
	});
};

export const getEventDateFromName = async (eventName: string) => {
	return new Promise<string>(async (resolve, reject) => {
		let querySnapshot: any;
		try {
			querySnapshot = await getDocs(eventsDb);
		} catch (err) {
			console.log(err);
			alert(
				"Error: The database is likely at read capacity, please try again tomorrow."
			);
			reject(err);
		}
		if (querySnapshot.empty) {
			alert("No events found");
			resolve("");
			return;
		}

		for (let i = 0; i < querySnapshot.size; i++) {
			if (
				querySnapshot.docs[i].data().eventName.toLowerCase() ==
				eventName.toLowerCase()
			) {
				resolve(querySnapshot.docs[i].data().date);
				return;
			}
		}
		resolve("");
	});
};

export const addEventVolunteers = async (
	eventName: string,
	email: string,
	password: string
) => {
	return new Promise<any>(async (resolve, reject) => {
		let querySnapshot: any;
		try {
			querySnapshot = await getDocs(accountsDb);
		} catch (err) {
			console.log(err);
			alert(
				"Error: The database is likely at read capacity, please try again tomorrow."
			);
			reject(err);
		}
		let name = await getNameFromEmail(email, querySnapshot);
		let resolveThing: any;
		let rejectThing: any;
		let promise = new Promise((resolve, reject) => {
			resolveThing = resolve;
			rejectThing = reject;
		});

		if (eventName.length <= 0) {
			console.log("its short");
			getEvents().then((events) => {
				eventName = events[0].eventName;
				console.log("thingy->" + eventName);
				resolveThing(true);
			});
		} else {
			console.log("its long");
			resolveThing(true);
		}
		await promise;
		if (!(await didAccLogin(eventName, email, password, querySnapshot))) {
			alert("Incorrect email or password.");
			resolve(false);
			return;
		} else if (!(await getIsVerfiedFromEmail(email, querySnapshot))) {
			alert(
				"Your account must first be approved by an admin to sign up for events."
			);
			resolve(false);
			return;
		} else if (await isPersonInVolunteers(email, name, eventName)) {
			alert("You are already signed up for this event.");
			resolve(false);
			return;
		} else {
			try {
				let voluns: Array<string>;
				if (eventName.length > 0) {
					console.log("here");
					voluns = await getEventVolunteers(eventName);
				} else {
					eventName = await getDocs(eventsDb).then((querySnapshott) => {
						return querySnapshott.docs[0].data().eventName;
					});
					voluns = [];
				}

				await updateDoc(
					doc(
						db,
						"Events",
						eventName.toLowerCase() +
							" " +
							(await getEventDateFromName(eventName.toLowerCase()))
					),
					{
						volunteers: [...voluns, name],
					}
				);
				console.log("Update doc line 234");

				resolve(true);
			} catch (err) {
				alert(
					"Error: The database is likely at read capacity, please try again tomorrow."
				);
				console.log(err);
			}
		}
	});
};

export const removeEventVolunteers = async (
	eventName: string,
	email: string,
	password: string
) => {
	return new Promise<any>(async (resolve, reject) => {
		let querySnapshot: any;
		try {
			querySnapshot = await getDocs(accountsDb);
		} catch (err) {
			console.log(err);
			alert(
				"Error: The database is likely at read capacity, please try again tomorrow."
			);
			reject(err);
		}
		let name = await getNameFromEmail(email, querySnapshot);
		let resolveThing: any;
		let rejectThing: any;
		let promise = new Promise((resolve, reject) => {
			resolveThing = resolve;
			rejectThing = reject;
		});
		if (eventName.length <= 0) {
			console.log("its short");
			getEvents().then((events) => {
				eventName = events[0].eventName;
				console.log("thingy->" + eventName);
				resolveThing(true);
			});
		} else {
			console.log("its long");
			resolveThing(true);
		}
		await promise;
		if (!(await didAccLogin(eventName, email, password, querySnapshot))) {
			alert("Incorrect email or password.");
			resolve(false);
			return;
		} else if (!(await isPersonInVolunteers(email, name, eventName))) {
			alert("You are not signed up for this event currently.");
			resolve(false);
			return;
		} else {
			try {
				let voluns = await getEventVolunteers(eventName);
				let namee = await getNameFromEmail(email, querySnapshot);

				await updateDoc(
					doc(
						db,
						"Events",
						eventName.toLowerCase() +
							" " +
							(await getEventDateFromName(eventName.toLowerCase()))
					),
					{
						volunteers: voluns.filter((volun) => volun !== namee),
					}
				);
				console.log("Update doc line 298");
				resolve(true);
			} catch (err) {
				console.log(err);
				alert(
					"Error: The database is likely at read capacity, please try again tomorrow."
				);
				reject(err);
			}
		}
	});
};

export const getEvents = async () => {
	return new Promise<eventProps[]>(async (resolve, reject) => {
		let querySnapshot: any;
		try {
			querySnapshot = await getDocs(eventsDb);
			querySnapshot = querySnapshot.docs;
			querySnapshot = querySnapshot.map((doc: any) => {
				return doc.data();
			});

			querySnapshot = querySnapshot.sort((a: any, b: any) => {
				return ((a.date.replaceAll("-", "") as number) -
					b.date.replaceAll("-", "")) as number;
			});
			console.log("Getting events...");
		} catch (err) {
			alert(
				"Error: The database is likely at read capacity, please try again tomorrow."
			);
			reject(err);
		}
		let events: eventProps[] = [];
		querySnapshot.forEach((doc: any) => {
			events.push(doc);
		});
		resolve(events);
	});
};

export const addEvent = async ({
	eventName,
	date,
	location,
	startTime,
	endTime,
	volunteersNeeded,
	volunteers,
	isTutoring,
	tutorHost,
	teachers,
}: eventProps) => {
	return new Promise<any>(async (resolve, reject) => {
		try {
			// for every parameter replace all _ with spaces
			eventName = eventName.replaceAll("_", " ");
			location = location.replaceAll("_", " ");
			startTime = startTime.replaceAll("_", " ");
			endTime = endTime.replaceAll("_", " ");
			tutorHost = tutorHost.replaceAll("_", " ");
			teachers = teachers.replaceAll("_", " ");
			eventName = eventName.replaceAll("-", " ");
			location = location.replaceAll("-", " ");
			tutorHost = tutorHost.replaceAll("-", " ");
			teachers = teachers.replaceAll("-", " ");
			let newEventDoc = doc(db, "Events", eventName.toLowerCase() + " " + date);
			console.log("Make doc 353");

			const docRef = await setDoc(newEventDoc, {
				eventName,
				date,
				location,
				startTime,
				endTime,
				volunteersNeeded,
				volunteers,
				isTutoring,
				tutorHost,
				teachers,
			}).then((res) => {
				console.log("Add event line 362");
				alert(`Success!\nEvent ${eventName} has been added to the database.`);
				resolve(true);
			});

			// ! GroupMe send message
			if (isTutoring) {
				reject();
				return;
			}

			let messagee = `A new volunteering event has been added!\n\nEvent Name: ${eventName}\nDate: ${date}\nLocation: ${location}\nStart Time: ${startTime}\nEnd Time: ${endTime}\nVolunteers Needed: ${volunteersNeeded}\n\nTo sign up for this event, go to https://lymannhs.netlify.app/`;
			let url = `https://api.groupme.com/v3/groups/93971222/messages?text=${messagee}&source_guid=${uuid()}`;
			let botId = "bab5899a1b58b4e354baae79d8";
			let options = {
				hostname: "api.groupme.com",
				path: "/v3/bots/post",
				method: "POST",
			};
			let body = {
				bot_id: botId,
				text: messagee,
			};
			var botReq = HTTPS.request(options, function (res: any) {
				if (res.statusCode == 202) {
					//neat
				} else {
					console.log("rejecting bad status code " + res.statusCode);
				}
			});

			botReq.on("error", function (err: any) {
				console.log("error posting message " + JSON.stringify(err));
			});
			botReq.on("timeout", function (err: any) {
				console.log("timeout posting message " + JSON.stringify(err));
			});
			botReq.end(JSON.stringify(body));
		} catch (err) {
			console.log(err);
			alert(
				"Error: The database is likely at read capacity, please try again tomorrow."
			);
			reject(err);
		}
	});
};

export const deleteEvent = async (eventName: string, date: string) => {
	return new Promise<any>(async (resolve, reject) => {
		try {
			await deleteDoc(doc(db, "Events", eventName.toLowerCase() + " " + date));
			console.log("Delete doc line 383");
			resolve(true);
		} catch (err) {
			console.log(err);
			alert(
				"Error: The database is likely at read capacity, please try again tomorrow."
			);
			reject(err);
		}
	});
};

export interface AccInterface {
	email: string;
	password: string;
	firstName: string;
	lastName: string;
	grade: string | number;
	isAdmin: boolean;
	isVerified: boolean;
	volunteerHours: number;
	tutoringHours: number;
}

interface newAccountProps {
	email: string;
	password: string;
	firstName: string;
	lastName: string;
	grade: string | number;
	isAdmin: boolean;
	isVerified: boolean;
	volunteerHours: number;
	tutoringHours: number;
}

export const checkMemberHours = async (email: string, password: string) => {
	return new Promise<Array<string>>(async (resolve, reject) => {
		let querySnapshot: any;
		try {
			querySnapshot = await getDocs(accountsDb);
		} catch (err) {
			console.log(err);
			alert(
				"Error: The database is likely at read capacity, please try again tomorrow."
			);
			reject(err);
		}
		let hours: Array<string> = [];
		let itemsProcessed = 0;
		let foundAccount = false;
		querySnapshot.forEach((doc: any) => {
			itemsProcessed++;
			if (
				doc.data().email.trim().toLowerCase() == email.trim().toLowerCase() &&
				doc.data().password.trim() == password.trim()
			) {
				foundAccount = true;
				hours.push(doc.data().volunteerHours.toString());
				hours.push(doc.data().tutoringHours.toString());
				getNameFromEmail(email.toLowerCase(), querySnapshot).then((name) => {
					hours.push(name);
					resolve(hours);
					return;
				});
			} else if (querySnapshot.size === itemsProcessed && !foundAccount) {
				alert("Incorrect email or password.");
				reject("Incorrect email or password.");
				return;
			}
		});
	});
};

export const makeMemberAdmin = async (name: string) => {
	return new Promise<void>(async (resolve, reject) => {
		try {
			await updateDoc(doc(db, "Accounts", name.toLowerCase()), {
				isAdmin: true,
			});
			console.log("Update doc line 463");
			resolve();
		} catch (err) {
			console.log(err);
			alert(
				"Error: The database is likely at read capacity, please try again tomorrow."
			);
			reject();
		}
	});
};

export const makeMemberNotAdmin = async (name: string) => {
	return new Promise<void>(async (resolve, reject) => {
		try {
			await updateDoc(doc(db, "Accounts", name.toLowerCase()), {
				isAdmin: false,
			});
			console.log("Update doc line 481");
			resolve();
		} catch (err) {
			console.log(err);
			alert(
				"Error: The database is likely at read capacity, please try again tomorrow."
			);
			reject();
		}
	});
};

export const updateMember = async (name: string, modifiedField: object) => {
	return new Promise<void>(async (resolve, reject) => {
		try {
			updateDoc(doc(db, "Accounts", name.toLowerCase()), modifiedField).then(
				() => {
					resolve();
				}
			);
			console.log("Update doc line 501");
		} catch (err) {
			console.log(err);
			alert(
				"Error: The database is likely at read capacity, please try again tomorrow."
			);
			reject();
		}
	});
};

export const deleteMember = async (name: string) => {
	return new Promise<void>(async (resolve, reject) => {
		try {
			await deleteDoc(doc(db, "Accounts", name.toLowerCase()));
			console.log("Delete doc line 516");
			resolve();
		} catch (err) {
			console.log(err);
			alert(
				"Error: The database is likely at read capacity, please try again tomorrow."
			);
			reject();
		}
	});
};

export const getAccounts = async () => {
	return new Promise<AccInterface[]>(async (resolve, reject) => {
		let querySnapshot: any;
		console.log("Getting accounts...");
		try {
			querySnapshot = await getDocs(accountsDb);
		} catch (err) {
			console.log(err);
			alert(
				"Error: The database is likely at read capacity, please try again tomorrow."
			);
			reject(err);
		}
		let ret: AccInterface[] = [];
		querySnapshot.forEach((doc: any) => {
			ret.push(doc.data() as AccInterface);
			if (ret.length == querySnapshot.size) {
				resolve(ret);
			}
		});
	});
};

export const newAccount = async ({
	email,
	password,
	firstName,
	lastName,
	grade,
	isAdmin,
	isVerified,
	volunteerHours,
	tutoringHours,
}: newAccountProps) => {
	return new Promise<boolean>(async (resolve, reject) => {
		email = email.trim();
		password = password.trim();
		firstName = firstName.trim();
		lastName = lastName.trim();
		grade = grade.toString().trim();

		if (
			email == "" ||
			password == "" ||
			firstName == "" ||
			lastName == "" ||
			grade == "" ||
			email == null ||
			password == null ||
			firstName == null ||
			lastName == null ||
			grade == null
		) {
			reject(false);
			alert("Please fill out all fields.");

			return;
		} else if (parseInt(grade) > 12 || parseInt(grade) < 9) {
			reject(false);
			alert("Please enter a valid grade.");

			return;
		} else if (!(await EmailValidator.validate(email))) {
			reject(false);
			alert("Please enter a valid email.");

			return;
		} else if (password.length < 8) {
			reject(false);
			alert("Please enter a password with at least 8 characters.");
			return;
		} else if (email.includes("@student")) {
			reject(false);
			alert("Please enter a non-student email.");
			return;
		}
		// give me what is said above but all in one if statement and a alert saying "Please enter a password without any special characters."
		const specialChars = [
			" ",
			"\t",
			"\n",
			"\r",
			"\v",
			"\f",
			"\0",
			"\x1a",
			"\\",
			"'",
			'"',
			"`",
			"$",
			"&",
			"(",
			")",
			"*",
			"+",
			",",
			"/",
			":",
			";",
			"<",
			"=",
			">",
			"?",
			"@",
			"[",
			"]",
			"^",
			"{",
			"|",
			"}",
			"~",
			".",
			" ",
		];
		for (let i = 0; i < specialChars.length; i++) {
			if (password.includes(specialChars[i])) {
				alert("Please enter a password without any special characters.");
				return;
			}
		}
		let newAccDoc = await doc(
			db,
			"Accounts",
			(firstName + " " + lastName).toLowerCase()
		);
		console.log("New doc line 635");

		await setDoc(newAccDoc, {
			email: email,
			password: password,
			firstName: firstName,
			lastName: lastName,
			grade: grade,
			isAdmin: isAdmin,
			isVerified: false,
			volunteerHours: 0,
			tutoringHours: 0,
		}).then((res) => {
			resolve(true);
			// alert(`Success!\nEmail: ${email}\nPassword: ${password}`);
			emailjs
				.send(
					"service_o3m7mlh",
					"template_9ggmcoq",
					{
						email_acc: email,
						from_name: firstName + " " + lastName,
					},
					"uq4kVKFRDwE7pFfsW"
				)
				.then(
					function (response) {
						console.log("Email sent!");
						resolve(true);
					},
					function (error) {
						console.log(error);
						resolve(true);
					}
				);
		});
	});
};

interface checkAdminProps {
	email: string;
	password: string;
}

export const checkAdmin = ({ email, password }: checkAdminProps) => {
	return new Promise<boolean>(async (resolve, reject) => {
		let foundAccount = false;
		let querySnapshot: any;
		try {
			querySnapshot = await getAccounts();
		} catch (err) {
			console.log(err);
			alert(
				"Error: The database is likely at read capacity, please try again tomorrow."
			);
			resolve(false);
		}
		let resForPromise: Function;
		let forPromise = new Promise<void>(async (resolve, reject) => {
			resForPromise = resolve;
		});

		querySnapshot.forEach((doc: AccInterface) => {
			if (
				doc.email.toLowerCase() == email.toLowerCase() &&
				doc.password == password
			) {
				foundAccount = true;
				if (doc.isAdmin) {
					resolve(true);
				} else {
					alert("You are not an admin.");
					resolve(false);
				}
			}
			if (
				querySnapshot.map((doc: any) => doc).indexOf(doc) ==
				querySnapshot.map((doc: any) => doc).length - 1
			) {
				resForPromise();
			}
		});
		await forPromise;
		if (!foundAccount) {
			alert("Incorrect email or password.");
			resolve(false);
		}
	});
};

export const deleteCollectionData = async (collectionName: string) => {
	return new Promise<void>(async (resolve, reject) => {
		var collectionRef = collection(db, collectionName);
		let querySnapshot = await getDocs(collectionRef);
		querySnapshot.forEach(async (docy: any) => {
			// if doc name includes stone dont delete
			if (docy.id.includes("brittany stone")) {
				alert("Account with last name 'stone' found. Skipping.");
				return;
			}
			await deleteDoc(doc(db, collectionName, docy.id));
		});

		alert("Collection deleted. Click 'Refresh items' to see changes.");
		resolve();
	});
};

export interface messageInterface {
	name: string;
	text: string;
}

export const newMessage = async (
	email: string,
	password: string,
	messageText: string
) => {
	return new Promise<void>(async (resolve, reject) => {
		let querySnapshot: any;
		try {
			querySnapshot = await getDocs(accountsDb);
		} catch (err) {
			console.log(err);
			alert(
				"Error: The database is likely at read capacity, please try again tomorrow."
			);
		}
		if ((await didAccLogin("", email, password, querySnapshot)) == false) {
			alert("Incorrect email or password.");
			reject();
			return;
		}
		console.log(querySnapshot);
		let name = await getNameFromEmail(email, querySnapshot);
		console.log(name);
		try {
			let newMessageDoc = await doc(db, "Messages", name);
			await setDoc(newMessageDoc, {
				name: name,
				text: messageText,
			});
			resolve();
		} catch (err) {
			console.log(err);
			alert(
				"Error: The database is likely at capacity, please try again tomorrow or message an officer."
			);
			reject();
		}
	});
};

export const getMessagesArray = async () => {
	return new Promise<messageInterface[]>(async (resolve, reject) => {
		let messages: messageInterface[] = [];
		let querySnapshot = await getDocs(collection(db, "Messages"));
		querySnapshot.forEach((doc: any) => {
			messages.push({
				name: doc.data().name,
				text: doc.data().text,
			});
		});
		resolve(messages);
	});
};

export const deleteMessage = async (name: string) => {
	return new Promise<void>(async (resolve, reject) => {
		await deleteDoc(doc(db, "Messages", name));
		resolve();
	});
};

interface newHoursRequestProps {
	email: string;
	password: string;
	eventName: string;
	arriveTime: string;
	leaveTime: string;
	addVolunteerHours: number;
	addTutoringHours: number;
}

export const newHoursRequest = async ({
	email,
	password,
	eventName,
	arriveTime,
	leaveTime,
	addVolunteerHours,
	addTutoringHours,
}: newHoursRequestProps) => {
	return new Promise<void>(async (resolve, reject) => {
		if (
			email == "" ||
			password == "" ||
			eventName == "" ||
			arriveTime == "" ||
			leaveTime == ""
		) {
			alert("Please fill out all fields.");
			reject();
			return;
		}
		let querySnapshot: any;
		try {
			querySnapshot = await getDocs(accountsDb);
		} catch (err) {
			console.log(err);
			alert(
				"Error: The database is likely at read capacity, please try again tomorrow."
			);
		}
		if ((await didAccLogin("", email, password, querySnapshot)) == false) {
			alert("Incorrect email or password.");
			reject();
			return;
		}
		let name = await getNameFromEmail(email, querySnapshot);
		let newHoursRequestDoc = await doc(
			db,
			"Hours Requests",
			name + " - " + eventName
		);
		await setDoc(newHoursRequestDoc, {
			name: name,
			eventName: eventName,
			arriveTime: arriveTime,
			leaveTime: leaveTime,
			addVolunteerHours: addVolunteerHours,
			addTutoringHours: addTutoringHours,
		});
		resolve();
	});
};

export interface mapableHoursRequestProps {
	name: string;
	eventName: string;
	arriveTime: string;
	leaveTime: string;
	addVolunteerHours: number;
	addTutoringHours: number;
}

export const getHoursRequestsArray = async () => {
	return new Promise<mapableHoursRequestProps[]>(async (resolve, reject) => {
		let hoursRequests: mapableHoursRequestProps[] = [];
		let querySnapshot = await getDocs(collection(db, "Hours Requests"));
		querySnapshot.forEach((doc: any) => {
			hoursRequests.push({
				name: doc.data().name,
				eventName: doc.data().eventName,
				arriveTime: doc.data().arriveTime,
				leaveTime: doc.data().leaveTime,
				addVolunteerHours: doc.data().addVolunteerHours,
				addTutoringHours: doc.data().addTutoringHours,
			});
		});
		resolve(hoursRequests);
	});
};

export const approveHoursRequest = async (name: string, eventName: string) => {
	return new Promise<void>(async (resolve, reject) => {
		let querySnapshot: any;
		try {
			querySnapshot = await getDocs(accountsDb);
		} catch (err) {
			console.log(err);
			alert(
				"Error: The database is likely at read capacity, please try again tomorrow."
			);
		}
		let hoursRequests = await getHoursRequestsArray();
		let hoursRequest: mapableHoursRequestProps;
		console.log(hoursRequests);
		for (let i = 0; i < hoursRequests.length; i++) {
			if (
				hoursRequests[i].name == name &&
				hoursRequests[i].eventName == eventName
			) {
				// console.log("found");
				hoursRequest = hoursRequests[i];
				let nameOfPerson = hoursRequest.name;
				let hoursToAdd = hoursRequest.addVolunteerHours as unknown as number;
				let tutoringHoursToAdd =
					hoursRequest.addTutoringHours as unknown as number;
				let foundAccount = false;
				let count = 0;
				querySnapshot.forEach(async (docc: any) => {
					if (
						docc.data().firstName + " " + docc.data().lastName ==
						nameOfPerson
					) {
						// console.log("found");
						foundAccount = true;
						let newHours = Number(
							parseInt(docc.data().volunteerHours) + Number(hoursToAdd)
						);
						let newTutoringHours = Number(
							parseInt(docc.data().tutoringHours) + Number(tutoringHoursToAdd)
						);
						console.log(newHours);
						console.log(newTutoringHours);
						await updateDoc(
							doc(
								db,
								"Accounts",
								(
									docc.data().firstName +
									" " +
									docc.data().lastName
								).toLowerCase()
							),
							{
								volunteerHours: newHours,
								tutoringHours: newTutoringHours,
							}
						);
						await deleteDoc(
							doc(db, "Hours Requests", name + " - " + eventName)
						);
						alert("Hours Request Approved");

						resolve();
					}
					count++;

					if (count == querySnapshot.size && !foundAccount) {
						alert("Error: Account not found.");
						reject();
					}
				});
				// if (!foundAccount) {
				// 	alert("Error: Account not found.");
				// 	reject();
				// }
				break;
			}
		}
	});
};

export const denyHoursRequest = async (name: string, eventName: string) => {
	return new Promise<void>(async (resolve, reject) => {
		await deleteDoc(doc(db, "Hours Requests", name + " - " + eventName));
		resolve();
	});
};
