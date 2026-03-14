import Link from "next/link";
import { useWallet } from "../context/WalletContext";
import Head from "next/head"; // для favicon

export default function Header() {
  const { wallet, connect, disconnect } = useWallet();

  function short(addr) {
    return addr.slice(0, 6) + "..." + addr.slice(-4);
  }

  return (
    <>
      {/* Head с favicon */}
      <Head>
        <title>BaseScout 2026</title>
        <link rel="icon" href="/favicon.png" />
      </Head>

      <header className="bg-zinc-900 border-b border-zinc-800">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">

          {/* Левый блок: название + документация + bug report */}
          <div className="flex items-center gap-6">
            <Link href="/">
              <div className="flex items-center gap-2 cursor-pointer">
                <img
                  src="/favicon.png"
                  alt="BaseScout Icon"
                  className="w-6 h-6"
                />
                <span className="text-xl font-bold">BaseScout</span>
              </div>
            </Link>

            <Link href="/documentation">
              <span className="text-zinc-400 hover:text-white cursor-pointer text-sm">
                Documentation
              </span>
            </Link>

            <a
              href="https://docs.google.com/forms/d/e/1FAIpQLSfejQVKCNsqaUftZ5vS7DL3UOP6e0tGtzTTBpFwUBgTNOw0aA/viewform?usp=publish-editor"
              target="_blank"
              rel="noopener noreferrer"
            >
              <span className="text-zinc-400 hover:text-white cursor-pointer text-sm">
                Report a Bug
              </span>
            </a>
          </div>

          {/* Правый блок: профиль / кошелек */}
          {wallet ? (
            <div className="flex items-center gap-4">
              <Link href="/profile">
                <span className="text-zinc-400 hover:text-white cursor-pointer">
                  Profile
                </span>
              </Link>

              <span className="text-sm text-zinc-400">{short(wallet.address)}</span>

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
    </>
  );
}
