// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { collection, addDoc } from "firebase/firestore";
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
export const membersDb = collection(db, "Members");
export const eventsDb = collection(db, "Events");
export const announcementsDb = collection(db, "Announcements");
export const accountsDb = collection(db, "Accounts");

interface newAccountProps {
	email: string;
	password: string;
	firstName: string;
	lastName: string;
	grade: string | number;
	db: any;
}

export const newAccount = async ({
	email,
	password,
	firstName,
	lastName,
	grade,
	db,
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
	} else if (!email.includes("@")) {
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

	const docRef = await addDoc(db, {
		email: email,
		password: password,
		firstName: firstName,
		lastName: lastName,
		grade: grade,
	}).then((res) => {
		console.log("Document written with ID: ", res.id);
		alert(
			`Success!\nEmail: ${email}\nPassword: ${password}
			\nNote: All passwords are encrypted and cannot be seen by anyone.`
		);
	});
};

// interface addMemberProps {
// 	name: String;
// 	grade: String | Number;
// 	email: String;
// 	db: any;
// }

// export const addMember = async ({ name, grade, email, db }: addMemberProps) => {
// 	if (
// 		name == "" ||
// 		grade == "" ||
// 		email == "" ||
// 		name == null ||
// 		grade == null ||
// 		email == null
// 	) {
// 		alert("Please fill out all fields.");
// 		return;
// 	} else if (grade > 12 || grade < 9) {
// 		alert("Please enter a valid grade.");
// 		return;
// 	} else if (!email.includes("@")) {
// 		alert("Please enter a valid email.");
// 		return;
// 	}

// 	const docRef = await addDoc(db, {
// 		name: name,
// 		grade: grade,
// 		email: email,
// 	}).then((res) => {
// 		console.log("Document written with ID: ", res.id);
// 		alert(`Success!\nName: ${name}\nGrade: ${grade}\nEmail: ${email}`);
// 	});
// };
