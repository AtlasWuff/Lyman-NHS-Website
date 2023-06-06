// Imports
import Head from "next/head";
import Script from "next/script";
import * as React from "react";
import { useAnimation, motion } from "framer-motion";

// Component imports
import Navbar from "./parts/Navbar";
import Footer from "./parts/Footer";

// Interface to define props
interface Props {
	children: React.ReactNode;
}

// Page
export default function SecLayout({ children }: Props) {
	return (
		<>
			<motion.div
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				exit={{ opacity: 0 }}
			>
				{children}
			</motion.div>
		</>
	);
}
