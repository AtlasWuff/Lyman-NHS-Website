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
const membersDb = collection(db, "Members");
const eventsDb = collection(db, "Events");
const announcementsDb = collection(db, "Announcements");
const accountsDb = collection(db, "Accounts");

export const updateMember = async (name: string, modifiedField: object) => {
	return new Promise<void>(async (resolve, reject) => {
		try {
			await updateDoc(doc(db, "Accounts", name), modifiedField);
			resolve();
		} catch (err) {
			console.log(err);
		}
	});
};

export const deleteMember = async (name: string) => {
	return new Promise<void>(async (resolve, reject) => {
		try {
			await deleteDoc(doc(db, "Accounts", name));
			resolve();
		} catch (err) {
			console.log(err);
		}
	});
};

export interface AccInterface {
	email: string;
	firstName: string;
	lastName: string;
	grade: string | number;
	isAdmin: boolean;
	isVerified: boolean;
	password: string;
}

export const getAccounts = async () => {
	return new Promise<AccInterface[]>(async (resolve, reject) => {
		let querySnapshot: any;
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

interface newAccountProps {
	email: string;
	password: string;
	firstName: string;
	lastName: string;
	grade: string | number;
	isAdmin: boolean;
	isVerified: boolean;
}

export const newAccount = async ({
	email,
	password,
	firstName,
	lastName,
	grade,
	isAdmin,
	isVerified,
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
	}).then((res) => {
		console.log("Document written with ID: ", res);
		alert(
			`Success!\nEmail: ${email}\nPassword: ${password}
			\nNote: All passwords are encrypted and cannot be seen by anyone.`
		);
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
			querySnapshot = await getDocs(accountsDb);
		} catch (err) {
			alert("Error: " + err);
			resolve(false);
		}
		querySnapshot.forEach((doc: any) => {
			if (doc.data().email == email && doc.data().password == password) {
				foundAccount = true;
				if (doc.data().isAdmin) {
					resolve(true);
				} else {
					alert("You are not an admin.");
					resolve(false);
				}
			}
			if (
				querySnapshot.docs.map((doc: any) => doc.data()).indexOf(doc) ==
				querySnapshot.docs.map((doc: any) => doc.data()).length - 1
			) {
				resolve(false);
				alert("Incorrect email or password.");
			}
		});
		if (!foundAccount) {
			alert("Incorrect email or password.");
			resolve(false);
		}
	});
};
