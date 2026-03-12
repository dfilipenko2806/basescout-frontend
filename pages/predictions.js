import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { useWallet } from "../context/WalletContext";
import Link from "next/link";

const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_PREDICT_CONTRACT;
const ABI = [
  "function playPrediction(uint256 predictionId,uint8 choice) external",
  "function played(address,uint256) view returns(bool)",
  "function userChoice(address,uint256) view returns(uint8)",
  "function results(uint256) view returns(bool resolved,uint8 correctChoice,uint8 pType)"
];

export default function Predictions() {
  const { wallet } = useWallet();
  const [predictions, setPredictions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [txLoading, setTxLoading] = useState(false);

  const BACKEND = process.env.NEXT_PUBLIC_BACKEND_URL;

  useEffect(() => {
    loadPredictions();
    const interval = setInterval(loadPredictions, 10000);
    return () => clearInterval(interval);
  }, [wallet]);

  async function loadPredictions() {
    try {
      const res = await fetch(`${BACKEND}/predictions`);
      const data = await res.json();
      const now = new Date();

      const provider = new ethers.BrowserProvider(window.ethereum);
      const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, provider);

      const enriched = await Promise.all(
        data.map(async (p) => {
          const expired = now > new Date(p.endDate);
          let status = "Active";
          let userPlayed = false;
          let userChoice;

          // Проверяем сыграл ли пользователь только если кошелёк подключен
          if (wallet?.address) {
            try {
              userPlayed = await contract.played(wallet.address, p.contractId);
              if (userPlayed) {
                const choice = await contract.userChoice(
                  wallet.address,
                  p.contractId
                );
                userChoice = Number(choice); // 🔥 FIX: приведение BigInt к Number
              }
            } catch (err) {
              console.error("Contract played check error:", err);
            }
          }

          // Получаем результат с контракта
          let resolved = false;
          let correctChoice;
          try {
            const result = await contract.results(p.contractId);
            resolved = result.resolved;
            correctChoice = Number(result.correctChoice);
          } catch (err) {
            console.error("Contract results check error:", err);
          }

          // ---- Логика отображения статуса ----
          if (resolved) {
            if (userChoice != null) {
              status = userChoice === correctChoice ? "Win" : "Lose";
            } else {
              status = "Resolved";
            }
          } else if (wallet?.address && userPlayed) {
            // Статус Waiting только если кошелёк подключен
            status = "Waiting";
          }

          return {
            ...p,
            status,
            expired,
            userPlayed,
            userChoice,
            userWon: status === "Win",
            resolved
          };
        })
      );

      setPredictions(
        enriched.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      );
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  }

  async function play(id, choice) {
    if (!wallet?.address) return alert("Connect wallet");

    try {
      setTxLoading(true);
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);

      const tx = await contract.playPrediction(id, choice);
      await tx.wait();

      alert("Prediction submitted");

      setPredictions((prev) =>
        prev.map((p) =>
          p.contractId === id
            ? { ...p, userPlayed: true, userChoice: choice, status: "Waiting" }
            : p
        )
      );
    } catch (err) {
      console.error(err);
      alert(err.reason || err.message || "Transaction failed");
    }
    setTxLoading(false);
  }

  function getTimeLeft(endDate) {
    const diff = new Date(endDate) - new Date();
    if (diff <= 0) return "Finished";

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff / (1000 * 60)) % 60);

    return `${hours}h ${minutes}m`;
  }

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center text-zinc-400">
        Loading predictions...
      </div>
    );

  return (
    <div className="min-h-screen bg-zinc-950 text-white py-12 px-6">
      <div className="max-w-4xl mx-auto">
        <Link href="/">
          <button className="mb-6 bg-zinc-800 px-4 py-2 rounded">
            ← Back to Home
          </button>
        </Link>

        <h1 className="text-3xl font-bold mb-8">🔮 Prediction Game</h1>

        {predictions.length === 0 && (
          <div className="text-zinc-400">No active predictions</div>
        )}

        <div className="space-y-6">
          {predictions.map((p) => {
            let bg = "bg-zinc-900";
            if (p.status === "Waiting") bg = "bg-yellow-900";
            if (p.status === "Win") bg = "bg-green-700";
            if (p.status === "Lose") bg = "bg-red-700";

            return (
              <div
                key={p._id}
                className={`${bg} p-6 rounded-xl transition-all duration-300`}
              >
                <div className="text-lg font-semibold mb-2">{p.question}</div>
                <div className="text-sm text-zinc-400 mb-3">
                  {p.resolved
                    ? "Result resolved"
                    : `Ends in: ${getTimeLeft(p.endDate)}`}
                </div>

                {!p.userPlayed && !p.resolved && wallet?.address && (
                  <div className="flex gap-4">
                    <button
                      disabled={txLoading}
                      onClick={() => play(p.contractId, 1)}
                      className="bg-green-600 hover:bg-green-700 px-6 py-2 rounded"
                    >
                      YES
                    </button>
                    <button
                      disabled={txLoading}
                      onClick={() => play(p.contractId, 2)}
                      className="bg-red-600 hover:bg-red-700 px-6 py-2 rounded"
                    >
                      NO
                    </button>
                  </div>
                )}

                {p.status === "Waiting" && (
                  <div className="text-yellow-400 font-medium">
                    ⏳ Waiting for result
                  </div>
                )}

                {p.status === "Win" && (
                  <div className="font-medium text-green-300">🎉 You won!</div>
                )}

                {p.status === "Lose" && (
                  <div className="font-medium text-red-300">❌ You lost</div>
                )}

                {p.status === "Resolved" && (
                  <div className="font-medium text-zinc-400">
                    ✅ Prediction resolved
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
