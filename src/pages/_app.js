import Navbar from "@/components/global/layout/navbar";
import "@/styles/globals.css";
import { GoogleTagManager, GoogleAnalytics } from '@next/third-parties/google'


export default function App({ Component, pageProps }) {
  return <div>
    <GoogleTagManager gtmId={"G-1EJENG5NXJ"} />
    <GoogleAnalytics gaId={"G-1EJENG5NXJ"} />
    <Navbar />
    <Component {...pageProps} />
  </div>;
}
