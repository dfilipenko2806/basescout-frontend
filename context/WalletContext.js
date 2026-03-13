import { createContext, useContext, useState, useEffect } from "react";
import { connectWallet } from "../lib/ethers";

const WalletContext = createContext();

export function WalletProvider({ children }) {
  const [wallet, setWallet] = useState(null);

  const BACKEND = process.env.NEXT_PUBLIC_BACKEND_URL;

  // При монтировании проверяем, есть ли ?ref в URL и сохраняем в localStorage
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const ref = params.get("ref");
    if (ref) {
      localStorage.setItem("basescout_ref", ref.toLowerCase());
    }
  }, []);

  async function connect() {
    const data = await connectWallet();
    setWallet(data);

    try {
      const ref = localStorage.getItem("basescout_ref");

      if (ref && data?.address && ref !== data.address.toLowerCase()) {
        // Отправляем на бекенд для привязки реферала
        await fetch(`${BACKEND}/referral/register`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            address: data.address.toLowerCase(),
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
