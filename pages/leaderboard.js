import { useEffect, useState } from "react";
import Link from "next/link";

export default function Leaderboard() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const BACKEND = process.env.NEXT_PUBLIC_BACKEND_URL;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`${BACKEND}/leaderboard`);
        const json = await res.json();

        // 🔥 ВАЖНО: гарантируем что это массив
        if (Array.isArray(json)) {
          setData(json);
        } else if (Array.isArray(json.users)) {
          setData(json.users);
        } else {
          setData([]);
        }

        setError(null);
      } catch (err) {
        setError("Failed to load leaderboard");
        setData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, [BACKEND]);

  function shortAddress(addr) {
    if (!addr) return "";
    return addr.slice(0, 6) + "..." + addr.slice(-4);
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white py-12 px-6">
      <div className="max-w-3xl mx-auto">

        <h1 className="text-3xl font-bold text-center mb-10">
          🏆 Leaderboard
        </h1>

        {loading && (
          <p className="text-center text-zinc-400">
            Loading...
          </p>
        )}

        {error && (
          <p className="text-center text-red-400">
            {error}
          </p>
        )}

        {!loading && !error && data.length === 0 && (
          <p className="text-center text-zinc-400">
            No users yet
          </p>
        )}

	<Link href="/">
	<button className="mb-6 bg-zinc-800 px-4 py-2 rounded">
	← Back to Home
	</button>
	</Link>

        <div className="space-y-4">
          {Array.isArray(data) &&
            data.map((user, idx) => (
              <div
                key={user.address || idx}
                className="flex items-center justify-between bg-zinc-900 p-4 rounded-2xl shadow-lg border border-zinc-800"
              >
                <div className="flex items-center gap-4">

                  <div className="text-xl font-bold w-10">
                    #{idx + 1}
                  </div>

                  <img
                    src={user.avatar || "/default-avatar.png"}
                    alt="avatar"
                    className="w-12 h-12 rounded-full object-cover"
                  />

                  <div>
                    <Link href={`/profile/${user.address}`}>
                      <div className="font-semibold hover:text-green-400 cursor-pointer">
                        {user.nickname || "Anonymous"}
                      </div>
                    </Link>

                    <div className="text-sm text-zinc-400">
                      {shortAddress(user.address)}
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div>🔥 {user.streak || 0}</div>
                  <div className="text-green-400 font-semibold">
                    {user.points || 0} pts
                  </div>
		  <div className="text-sm text-zinc-400">
		    👥 {user.referralsCount || 0}
		  </div>
                </div>
              </div>
            ))}
        </div>

      </div>
    </div>
  );
}