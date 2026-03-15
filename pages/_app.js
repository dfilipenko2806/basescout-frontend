import "../styles/globals.css";
import { WalletProvider } from "../context/WalletContext";
import Header from "../components/Header";
import Head from "next/head";

export default function App({ Component, pageProps }) {
  return (
    <>
      <Head>
        <meta
          name="talentapp:project_verification"
          content="0ac5244b4df85e4a19f0b256f030a624297b2f3897b7ca89f7150c73b730d35b7581b16ef2f1d309624008313ade1e713608e4b4bb282c9b153540109b771ac6"
        />
      </Head>

      <WalletProvider>
        <Header />
        <Component {...pageProps} />
      </WalletProvider>
    </>
  );
}
