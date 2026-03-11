import "../styles/globals.css";
import { WalletProvider } from "../context/WalletContext";
import Header from "../components/Header";

export default function App({ Component, pageProps }) {
  return (
    <WalletProvider> 
      <Header />
      <Component {...pageProps} />
    </WalletProvider>
  );
}