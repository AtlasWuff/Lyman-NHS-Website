// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore, deleteDoc } from "firebase/firestore";
import {
	collection,
	addDoc,
	setDoc,
	doc,
	getDocs,
	updateDoc,
} from "firebase/firestore";
import * as EmailValidator from "email-validator";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
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
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

// All DBs
const eventsDb = collection(db, "Events");
export const accountsDb = collection(db, "Accounts");

export interface eventProps {
	eventName: string;
	date: string;
	location: string;
	startTime: string;
	endTime: string;
	volunteersNeeded: string;
	volunteers: string[];
	isTutoring: boolean;
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
		} catch (err) {
			console.log(err);
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
			reject(err);
		}
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
		} else {
			try {
				let voluns = await getEventVolunteers(eventName);
				let namee = await getNameFromEmail(email, querySnapshot);

				await updateDoc(doc(db, "Events", eventName.toLowerCase()), {
					volunteers: [...voluns, namee],
				});
				resolve(true);
			} catch (err) {
				console.log("bad here");
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
			reject(err);
		}
		let name = await getNameFromEmail(email, querySnapshot);
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

				await updateDoc(doc(db, "Events", eventName.toLowerCase()), {
					volunteers: voluns.filter((volun) => volun !== namee),
				});
				resolve(true);
			} catch (err) {
				console.log(err);
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
			console.log(err);
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
}: eventProps) => {
	return new Promise<any>(async (resolve, reject) => {
		try {
			let newEventDoc = doc(db, "Events", eventName.toLowerCase());

			const docRef = await setDoc(newEventDoc, {
				eventName,
				date,
				location,
				startTime,
				endTime,
				volunteersNeeded,
				volunteers,
				isTutoring,
			}).then((res) => {
				alert(`Success!\nEvent ${eventName} has been added to the database.`);
				resolve(true);
			});
		} catch (err) {
			console.log(err);
		}
	});
};

export const deleteEvent = async (eventName: string, date: string) => {
	return new Promise<any>(async (resolve, reject) => {
		try {
			await deleteDoc(doc(db, "Events", eventName.toLowerCase()));
			resolve(true);
		} catch (err) {
			console.log(err);
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
			resolve();
		} catch (err) {
			console.log(err);
		}
	});
};

export const makeMemberNotAdmin = async (name: string) => {
	return new Promise<void>(async (resolve, reject) => {
		try {
			await updateDoc(doc(db, "Accounts", name.toLowerCase()), {
				isAdmin: false,
			});
			resolve();
		} catch (err) {
			console.log(err);
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
		} catch (err) {
			console.log(err);
		}
	});
};

export const deleteMember = async (name: string) => {
	return new Promise<void>(async (resolve, reject) => {
		try {
			await deleteDoc(doc(db, "Accounts", name.toLowerCase()));
			resolve();
		} catch (err) {
			console.log(err);
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
		alert("Please fill out all fields.");
		return;
	} else if (grade > 12 || grade < 9) {
		alert("Please enter a valid grade.");
		return;
	} else if (!(await EmailValidator.validate(email))) {
		alert("Please enter a valid email.");
		return;
	} else if (password.length < 8) {
		alert("Please enter a password with at least 8 characters.");
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
	];
	for (let i = 0; i < specialChars.length; i++) {
		if (password.includes(specialChars[i])) {
			alert("Please enter a password without any special characters.");
			return;
		}
	}
	let newAccDoc = doc(
		db,
		"Accounts",
		(firstName + " " + lastName).toLowerCase()
	);

	const docRef = await setDoc(newAccDoc, {
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
		console.log("Document written with ID: ", res);
		alert(`Success!\nEmail: ${email}\nPassword: ${password}`);
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
			alert("Error: " + err);
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
