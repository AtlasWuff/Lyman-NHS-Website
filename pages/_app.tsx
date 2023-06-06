// The order of css imports determines the order of css rules
// The last imported css file has the highest priority
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/global.css";

// Layout component defining global components
import Layout from "../components/_layout";
import SecLayout from "../components/_seclayout";
import Script from "next/script";
import type { AppProps } from "next/app";
import { AnimatePresence } from "framer-motion";
import Footer from "../components/parts/Footer";

export default function App({ Component, pageProps, router }: AppProps) {
	return (
		// Inside the layout is the corresponding page
		// Layout applies any components that are common to all pages
		<>
			<Script
				src="https://code.jquery.com/jquery-3.5.1.slim.min.js"
				crossOrigin="anonymous"
			></Script>

			<Layout>
				<AnimatePresence mode="wait" initial={true}>
					{/* <SecLayout> */}
					<Component {...pageProps} key={router.asPath} />
					<Footer />
					{/* </SecLayout> */}
				</AnimatePresence>
			</Layout>
		</>
	);
}
