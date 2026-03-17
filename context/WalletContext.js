import { createContext, useContext, useState, useEffect } from "react";
import { connectWallet, getUserData } from "../lib/ethers";

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
    try {
      const data = await connectWallet(); // подключаем кошелёк
      setWallet(data);

      // 🔹 Получаем сумму поинтов из истории на бекенде
      try {
        const userData = await getUserData(data.address);
        setWallet((prev) => ({ ...prev, points: userData.points }));
      } catch (err) {
        console.log("Failed to load user points:", err);
      }

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
      console.error("Wallet connection error:", err);
      throw err;
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
