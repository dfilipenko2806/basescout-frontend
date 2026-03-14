import { useEffect, useState } from "react";
import Link from "next/link";
import { useWallet } from "../context/WalletContext";

export default function Home() {

  const { wallet } = useWallet();

  const [stats, setStats] = useState({
    users: 0,
    points: 0,
    transactions: 0
  });

  const BACKEND = process.env.NEXT_PUBLIC_BACKEND_URL;

  useEffect(() => {

    async function loadStats() {

      try {

        const res = await fetch(`${BACKEND}/stats`);
        const data = await res.json();

        setStats(data);

      } catch {}

    }

    loadStats();

    const interval = setInterval(loadStats, 5000);

    return () => clearInterval(interval);

  }, []);

  const shareProject = () => {

    const text =
      "I just joined BaseScout 🚀 Earn points, badges and climb the leaderboard!";

    const url =
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=http://basescout2026.xyz`;

    window.open(url, "_blank");

  };

  return (

    <div className="min-h-screen bg-zinc-950 text-white py-12 px-6">

      <div className="max-w-4xl mx-auto">

        <h1 className="text-4xl font-bold text-center mb-4">
          🚀 BaseScout
        </h1>

        <p className="text-center text-zinc-400 mb-10">
          Social onchain activity tracker on Base
        </p>

        {/* MAIN NAV */}

        <div className="grid md:grid-cols-3 gap-6 mb-12">

          <Link href="/dashboard">
            <div className="bg-zinc-900 p-6 rounded-xl cursor-pointer hover:bg-zinc-800">
              <h2 className="text-xl font-semibold">
                Dashboard
              </h2>
              <p className="text-zinc-400 text-sm">
                Daily check-in & badges
              </p>
            </div>
          </Link>

          <Link href="/leaderboard">
            <div className="bg-zinc-900 p-6 rounded-xl cursor-pointer hover:bg-zinc-800">
              <h2 className="text-xl font-semibold">
                Leaderboard
              </h2>
              <p className="text-zinc-400 text-sm">
                Top BaseScout users
              </p>
            </div>
          </Link>

          <Link href="/predictions">
            <div className="bg-zinc-900 p-6 rounded-xl cursor-pointer hover:bg-zinc-800">
              <h2 className="text-xl font-semibold">
                Prediction Game
              </h2>
              <p className="text-zinc-400 text-sm">
                Predict & earn points
              </p>
            </div>
          </Link>

        </div>


        {/* GLOBAL STATS */}

        <h2 className="text-xl font-semibold mb-6 text-center">
          Global Stats
        </h2>

        <div className="grid grid-cols-3 gap-6 mb-12">

          <div className="bg-zinc-900 p-6 rounded-xl text-center">
            <div className="text-3xl font-bold">
              {stats.users}
            </div>
            <div className="text-zinc-400 text-sm">
              Users
            </div>
          </div>

          <div className="bg-zinc-900 p-6 rounded-xl text-center">
            <div className="text-3xl font-bold">
              {stats.transactions}
            </div>
            <div className="text-zinc-400 text-sm">
              Transactions
            </div>
          </div>

          <div className="bg-zinc-900 p-6 rounded-xl text-center">
            <div className="text-3xl font-bold text-green-400">
              {stats.points}
            </div>
            <div className="text-zinc-400 text-sm">
              Points Earned
            </div>
          </div>

        </div>


        {/* SHARE */}

        <div className="text-center">

          <button
            onClick={shareProject}
            className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg"
          >
            Share BaseScout on X
          </button>

        </div>

      </div>

    </div>

  );

}
