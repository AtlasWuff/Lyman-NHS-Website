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

interface addMemberProps {
	name: String;
	grade: String | Number;
	email: String;
	db: any;
}

export const addMember = async ({ name, grade, email, db }: addMemberProps) => {
	if (
		name == "" ||
		grade == "" ||
		email == "" ||
		name == null ||
		grade == null ||
		email == null
	) {
		alert("Please fill out all fields.");
		return;
	} else if (grade > 12 || grade < 9) {
		alert("Please enter a valid grade.");
		return;
	} else if (!email.includes("@")) {
		alert("Please enter a valid email.");
		return;
	}

	const docRef = await addDoc(db, {
		name: name,
		grade: grade,
		email: email,
	}).then((res) => {
		console.log("Document written with ID: ", res.id);
		alert(`Success!\nName: ${name}\nGrade: ${grade}\nEmail: ${email}`);
	});
};
