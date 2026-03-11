import Link from "next/link";
import { useWallet } from "../context/WalletContext";

export default function Header() {
  const { wallet, connect, disconnect } = useWallet();

  function short(addr) {
    return addr.slice(0, 6) + "..." + addr.slice(-4);
  }

  return (
    <header className="bg-zinc-900 border-b border-zinc-800">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">

        <div className="flex items-center gap-6">
          <Link href="/">
            <span className="text-xl font-bold cursor-pointer">
              🚀 BaseScout
            </span>
          </Link>

        </div>

        {wallet ? (
          <div className="flex items-center gap-4">

            <Link href="/profile">
              <span className="text-zinc-400 hover:text-white cursor-pointer">
                Profile
              </span>
            </Link>

            <span className="text-sm text-zinc-400">
              {short(wallet.address)}
            </span>

            <button
              onClick={disconnect}
              className="bg-red-600 hover:bg-red-700 px-4 py-1 rounded-lg text-sm"
            >
              Disconnect
            </button>

          </div>
        ) : (
          <button
            onClick={connect}
            className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg"
          >
            Connect Wallet
          </button>
        )}
      </div>
    </header>
  );
}