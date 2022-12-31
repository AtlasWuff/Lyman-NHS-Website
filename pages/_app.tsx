// The order of css imports determines the order of css rules
// The last imported css file has the highest priority
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/global.css";

// Layout component defining global components
import Layout from "../components/_layout";
import Script from "next/script";
import type { AppProps } from "next/app";
import { AnimatePresence } from "framer-motion";

export default function App({ Component, pageProps }: AppProps) {
	return (
		// Inside the layout is the corresponding page
		// Layout applies any components that are common to all pages
		<>
			<Script
				src="https://code.jquery.com/jquery-3.5.1.slim.min.js"
				crossOrigin="anonymous"
			></Script>

			<Layout>
				<AnimatePresence mode="wait" exitBeforeEnter>
					<Component {...pageProps} />
				</AnimatePresence>
			</Layout>
		</>
	);
}
