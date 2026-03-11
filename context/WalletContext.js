import { createContext, useContext, useState } from "react";
import { connectWallet } from "../lib/ethers";

const WalletContext = createContext();

export function WalletProvider({ children }) {
  const [wallet, setWallet] = useState(null);

  async function connect() {
    const data = await connectWallet();
    setWallet(data);
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