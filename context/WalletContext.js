import { createContext, useContext, useState } from "react";
import { connectWallet } from "../lib/ethers";

const WalletContext = createContext();

export function WalletProvider({ children }) {

  const [wallet, setWallet] = useState(null);

  const BACKEND = process.env.NEXT_PUBLIC_BACKEND_URL;

  async function connect() {

    const data = await connectWallet();
    setWallet(data);

    try {

      let ref = new URLSearchParams(window.location.search).get("ref");

      if (ref) {
        localStorage.setItem("basescout_ref", ref.toLowerCase());
      }

      ref = localStorage.getItem("basescout_ref");

      if (ref && data?.address && ref !== data.address.toLowerCase()) {

        await fetch(`${BACKEND}/referral/register`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            address: data.address,
            referrer: ref
          })
        });

      }

    } catch (err) {
      console.log("Referral register error", err);
    }

  }

  function disconnect() {
    setWallet(null);
  }

  return (
    <WalletContext.Provider value={{ wallet, connect, disconnect }}>
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet() {
  return useContext(WalletContext);
}
