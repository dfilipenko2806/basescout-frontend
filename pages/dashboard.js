import { useEffect, useState } from "react";
import { useWallet } from "../context/WalletContext";
import { getUserOnchainData, doCheckIn, mintBadge } from "../lib/ethers";
import Link from "next/link";

function Toast({ message, type, onClose }) {
  const colors = {
    error: "bg-red-600",
    success: "bg-green-600",
    info: "bg-blue-600"
  };

  useEffect(() => {
    const timer = setTimeout(() => onClose(), 4000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={`fixed top-6 right-6 z-50 text-white px-5 py-3 rounded-xl shadow-xl ${colors[type]}`}>
      <div className="flex items-center gap-4">
        <span>{message}</span>
        <button onClick={onClose} className="font-bold">✕</button>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const { wallet } = useWallet();

  const [userData, setUserData] = useState(null);
  const [toast, setToast] = useState(null);
  const [loading, setLoading] = useState(false);

  // 🔥 NEW
  const [timeLeft, setTimeLeft] = useState(0);
  const [canCheckIn, setCanCheckIn] = useState(true);

  const BACKEND = process.env.NEXT_PUBLIC_BACKEND_URL;

  const BADGE_LEVELS = [
    { level: 1, days: 1 },
    { level: 2, days: 5 },
    { level: 3, days: 10 },
    { level: 4, days: 15 },
    { level: 5, days: 30 },
    { level: 6, days: 60 },
    { level: 7, days: 90 },
    { level: 8, days: 180 },
    { level: 9, days: 360 }
  ];

  useEffect(() => {
    if (!wallet) return;

    async function load() {
      try {
        const data = await getUserOnchainData(wallet.address);
        setUserData(data);
      } catch {
        setToast({ message: "Failed loading user data", type: "error" });
      }
    }

    load();
  }, [wallet]);

  // 🔥 TIMER LOGIC
  useEffect(() => {
    if (!userData?.lastCheckIn) return;

    const interval = setInterval(() => {
      const now = Math.floor(Date.now() / 1000);
      const nextCheckIn = userData.lastCheckIn + 86400;

      const diff = nextCheckIn - now;

      if (diff <= 0) {
        setCanCheckIn(true);
        setTimeLeft(0);
      } else {
        setCanCheckIn(false);
        setTimeLeft(diff);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [userData]);

  // 🔥 FORMAT TIME
  function formatTime(seconds) {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;

    return `${h}h ${m}m ${s}s`;
  }

  const refreshUser = async () => {
    if (!wallet) return;
    const data = await getUserOnchainData(wallet.address);
    setUserData(data);
  };

  const addPointsHistory = async (points) => {
    if (!wallet || points <= 0) return;
    try {
      await fetch(`${BACKEND}/points-history/add-points`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ address: wallet.address, points })
      });
    } catch (err) {
      console.error("Failed to add points history:", err);
    }
  };

  // 🔥 FIXED CHECK-IN
  const handleCheckIn = async () => {
    try {
      setLoading(true);

      const oldPoints = userData?.points || 0;

      await doCheckIn(wallet.signer);

      const newData = await getUserOnchainData(wallet.address);
      setUserData(newData);

      const gained = (newData.points || 0) - oldPoints;
      if (gained > 0) {
        await addPointsHistory(gained);
      }

      setToast({ message: "Check-In successful 🎉", type: "success" });
    } catch (err) {
      setToast({ message: err?.reason || "Check-In unavailable", type: "error" });
    }
    setLoading(false);
  };

  const handleMint = async (level) => {
    try {
      setLoading(true);

      const oldPoints = userData?.points || 0;

      await mintBadge(wallet.signer, level);

      const newData = await getUserOnchainData(wallet.address);
      setUserData(newData);

      const gained = (newData.points || 0) - oldPoints;
      if (gained > 0) {
        await addPointsHistory(gained);
      }

      setToast({ message: `Badge ${level} minted 🏆`, type: "success" });
    } catch (err) {
      setToast({ message: err?.reason || "Mint failed", type: "error" });
    }
    setLoading(false);
  };

  if (!wallet) {
    return (
      <div className="min-h-screen bg-zinc-950 text-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-4">Wallet not connected</h2>
          <p className="text-zinc-400">Connect your wallet to access the dashboard</p>
        </div>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="min-h-screen bg-zinc-950 text-white flex items-center justify-center">
        Loading...
      </div>
    );
  }

  const badges = userData.badges || [];
  const nextBadge = BADGE_LEVELS.find((b) => userData.streak < b.days);

  return (
    <div className="min-h-screen bg-zinc-950 text-white py-12 px-6">
      <div className="max-w-4xl mx-auto">
        <Link href="/">
          <button className="mb-6 bg-zinc-800 px-4 py-2 rounded-lg hover:bg-zinc-700">← Back to Home</button>
        </Link>

        <h1 className="text-3xl font-bold mb-8">🚀 Dashboard</h1>

        <div className="bg-zinc-900 p-6 rounded-2xl mb-8 border border-zinc-800 space-y-2">
          <p><span className="text-zinc-400">Address:</span> {wallet.address}</p>
          <p><span className="text-zinc-400">Points:</span> {userData.points}</p>
          <p><span className="text-zinc-400">Streak:</span> 🔥 {userData.streak}</p>
          <p><span className="text-zinc-400">Badges:</span> {badges.length ? badges.join(", ") : "None"}</p>
        </div>

        {/* 🔥 UPDATED BUTTON */}
        <button
          disabled={!canCheckIn || loading}
          onClick={handleCheckIn}
          className={`px-6 py-3 rounded-xl mb-10 font-semibold transition ${
            canCheckIn
              ? "bg-green-600 hover:bg-green-700"
              : "bg-zinc-700 cursor-not-allowed"
          }`}
        >
          {canCheckIn
            ? "Daily Check-In"
            : `Next check-in in ${formatTime(timeLeft)}`}
        </button>

        {nextBadge && (
          <div className="mb-12">
            <p className="mb-2 text-zinc-400">🎯 Next badge at {nextBadge.days} days</p>
            <div className="h-3 bg-zinc-800 rounded overflow-hidden">
              <div
                className="h-full bg-green-500 transition-all"
                style={{ width: `${Math.min((userData.streak / nextBadge.days) * 100, 100)}%` }}
              />
            </div>
          </div>
        )}

        <h2 className="text-xl font-semibold mb-4">🎖 Badge Levels</h2>
        <div className="grid md:grid-cols-2 gap-4">
          {BADGE_LEVELS.map((badge) => {
            const earned = badges.includes(badge.level);
            const available = userData.streak >= badge.days && !earned;

            return (
              <div
                key={badge.level}
                className={`p-4 rounded-xl flex justify-between items-center border ${
                  earned ? "bg-black border-green-500" : "bg-zinc-900 border-zinc-800"
                }`}
              >
                <div><b>Level {badge.level}</b> — {badge.days} days</div>
                {earned ? (
                  <span className="text-green-400">Minted</span>
                ) : (
                  <button
                    disabled={!available || loading}
                    onClick={() => handleMint(badge.level)}
                    className={`px-4 py-1 rounded-lg ${available ? "bg-green-600 hover:bg-green-700" : "bg-zinc-700 cursor-not-allowed"}`}
                  >
                    {available ? "Mint" : "Locked"}
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}
