import Navbar from "@/components/global/layout/navbar";
import "@/styles/globals.css";

export default function App({ Component, pageProps }) {
  return <div>
    <Navbar />
    <Component {...pageProps} />
  </div>;
}
