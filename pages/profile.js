import { useEffect, useState } from "react";
import { useWallet } from "../context/WalletContext";
import Link from "next/link";

export default function Profile() {
  const { wallet } = useWallet();

  const [profile, setProfile] = useState(null);
  const [history, setHistory] = useState([]);

  const [nickname, setNickname] = useState("");
  const [avatar, setAvatar] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);

  const [saving, setSaving] = useState(false);
  const [editOpen, setEditOpen] = useState(false);

  const BACKEND = process.env.NEXT_PUBLIC_BACKEND_URL;

  useEffect(() => {
    if (!wallet) return;

    const ref = new URLSearchParams(window.location.search).get("ref");

    if (ref) {
      fetch(`${BACKEND}/referral/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          address: wallet.address,
          referrer: ref
        })
      }).catch(() => {});
    }

    loadProfile();
  }, [wallet]);

  async function loadProfile() {
    try {
      const profileRes = await fetch(`${BACKEND}/profile/${wallet.address}`);
      const profileData = await profileRes.json();

      const historyRes = await fetch(`${BACKEND}/points-history/${wallet.address}`);
      const historyData = await historyRes.json();

      setProfile({ ...profileData, badges: profileData.badges || [] });
      setNickname(profileData.nickname || "");
      setHistory(historyData || []);
      setAvatarPreview(profileData.avatar || null);
    } catch (e) {
      console.log("Profile load error", e);
    }
  }

  async function saveProfile() {
    try {
      setSaving(true);

      let avatarUrl = profile.avatar || "";

      if (avatar) {
        const form = new FormData();
        form.append("file", avatar);

        const uploadRes = await fetch(`${BACKEND}/upload-avatar`, {
          method: "POST",
          body: form
        });

        if (!uploadRes.ok) {
          throw new Error("Avatar upload failed");
        }

        const uploadData = await uploadRes.json();

        if (!uploadData.url) {
          throw new Error("Invalid upload response");
        }

        avatarUrl = uploadData.url;
      }

      const res = await fetch(`${BACKEND}/profile`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          address: wallet.address,
          nickname,
          avatar: avatarUrl
        })
      });

      if (!res.ok) throw new Error("Update failed");

      setEditOpen(false);
      setAvatar(null);
      setAvatarPreview(avatarUrl);

      await loadProfile();

    } catch (err) {
      console.error(err);
      alert("Failed to update profile");
    } finally {
      setSaving(false);
    }
  }

  function handleAvatar(e) {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 2_000_000) {
      alert("File too large (max 2MB)");
      return;
    }

    if (!file.type.startsWith("image/")) {
      alert("Invalid file type");
      return;
    }

    setAvatar(file);
    setAvatarPreview(URL.createObjectURL(file));
  }

  function formatDate(dateStr) {
    const d = new Date(dateStr);
    return d.toLocaleString("ru-RU", {
      day: "numeric",
      month: "long",
      hour: "2-digit",
      minute: "2-digit"
    });
  }

  if (!wallet) return (
    <div className="min-h-screen flex items-center justify-center text-zinc-400">
      Connect wallet
    </div>
  );

  if (!profile) return (
    <div className="min-h-screen flex items-center justify-center text-zinc-400">
      Loading...
    </div>
  );

  return (
    <div className="min-h-screen bg-zinc-950 text-white py-12 px-6">
      <div className="max-w-3xl mx-auto">

        <Link href="/">
          <button className="mb-6 bg-zinc-800 px-4 py-2 rounded-lg hover:bg-zinc-700">
            ← Back to Home
          </button>
        </Link>

        {/* PROFILE CARD */}
        <div className="bg-zinc-900 p-6 rounded-xl mb-8">
          <div className="flex items-center justify-between">

            <div className="flex items-center gap-4">
              <img
                src={avatarPreview || "/default-avatar.png"}
                className="w-16 h-16 rounded-full object-cover"
              />

              <div>
                <div className="text-xl font-bold">
                  {profile.nickname || "Anonymous"}
                </div>
                <div className="text-zinc-400 text-sm break-all">
                  {wallet.address}
                </div>
              </div>
            </div>

            <button
              onClick={() => setEditOpen(true)}
              className="bg-blue-600 px-4 py-2 rounded-lg"
            >
              Edit Profile
            </button>

          </div>

          <div className="grid grid-cols-4 gap-4 mt-6">

            <div className="text-center">
              <div className="text-xl font-bold">{profile.points}</div>
              <div className="text-xs text-zinc-400">Points</div>
            </div>

            <div className="text-center">
              <div className="text-xl font-bold">{profile.streak}</div>
              <div className="text-xs text-zinc-400">Streak</div>
            </div>

            <div className="text-center">
              <div className="text-xl font-bold">{profile.referralsCount || 0}</div>
              <div className="text-xs text-zinc-400">Referrals</div>
            </div>

            <div className="text-center">
              <div className="text-xl font-bold">{profile.predictionsWon || 0}</div>
              <div className="text-xs text-zinc-400">Predictions</div>
            </div>

          </div>
        </div>

        {/* BADGES */}
        {/* BADGES */}
<div className="bg-zinc-900 p-6 rounded-xl mb-8">
  <h2 className="text-xl font-semibold mb-4">Badges</h2>

  <div className="flex gap-3 flex-wrap">
    {profile.badges.length === 0 ? (
      <div className="text-zinc-400">No badges yet</div>
    ) : (
      profile.badges.map((b, i) => {
        // маппинг номера бейджа в картинку
        const badgeImages = {
          1: "https://gateway.pinata.cloud/ipfs/bafybeicgavnhwcixxryqg2sidq4shzz7b463xpvakojlcpns6obhczffjq/1.png",
          2: "https://gateway.pinata.cloud/ipfs/bafybeicgavnhwcixxryqg2sidq4shzz7b463xpvakojlcpns6obhczffjq/2.png",
          3: "https://gateway.pinata.cloud/ipfs/bafybeicgavnhwcixxryqg2sidq4shzz7b463xpvakojlcpns6obhczffjq/3.png",
          4: "https://gateway.pinata.cloud/ipfs/bafybeicgavnhwcixxryqg2sidq4shzz7b463xpvakojlcpns6obhczffjq/4.png",
          5: "https://gateway.pinata.cloud/ipfs/bafybeicgavnhwcixxryqg2sidq4shzz7b463xpvakojlcpns6obhczffjq/5.png",
          6: "https://gateway.pinata.cloud/ipfs/bafybeicgavnhwcixxryqg2sidq4shzz7b463xpvakojlcpns6obhczffjq/6.png",
          7: "https://gateway.pinata.cloud/ipfs/bafybeicgavnhwcixxryqg2sidq4shzz7b463xpvakojlcpns6obhczffjq/7.png",
          8: "https://gateway.pinata.cloud/ipfs/bafybeicgavnhwcixxryqg2sidq4shzz7b463xpvakojlcpns6obhczffjq/8.png",
          9: "https://gateway.pinata.cloud/ipfs/bafybeicgavnhwcixxryqg2sidq4shzz7b463xpvakojlcpns6obhczffjq/9.png",
        };

        return (
          <img
            key={i}
            src={badgeImages[b] || "/default-badge.png"}
            alt={`Badge ${b}`}
            title={`Badge ${b}`}
            className="w-12 h-12 rounded"
          />
        );
      })
    )}
  </div>
</div>

        {/* REFERRAL */}
        <div className="bg-zinc-900 p-6 rounded-xl mb-8">
          <h2 className="text-xl font-semibold mb-4">Referral</h2>

          <div className="flex items-center gap-4">

            <input
              type="text"
              readOnly
              value={`https://basescout2026.vercel.app/?ref=${wallet.address}`}
              className="flex-1 bg-zinc-800 px-3 py-2 rounded text-sm text-zinc-400"
            />

            <button
              onClick={() => {
                navigator.clipboard.writeText(
                  `https://basescout2026.vercel.app/?ref=${wallet.address}`
                );
                alert("Referral link copied!");
              }}
              className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-700"
            >
              Copy link
            </button>

          </div>
        </div>

        {/* POINT HISTORY */}
        <div className="bg-zinc-900 p-6 rounded-xl">

          <h2 className="text-xl font-semibold mb-4">
            Points History
          </h2>

          <div className="space-y-3">

            {history.length === 0 ? (
              <div className="text-zinc-400 text-sm">
                No history yet
              </div>
            ) : (
              history.map((h, i) => (
                <div
                  key={i}
                  className="flex justify-between border-b border-zinc-800 pb-2 text-sm text-zinc-400"
                >
                  <div>{formatDate(h.createdAt)}</div>
                  <div className="text-green-400 font-semibold">
                    +{h.points}
                  </div>
                </div>
              ))
            )}

          </div>
        </div>

        {/* EDIT PROFILE MODAL */}
        {editOpen && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">

            <div className="bg-zinc-900 p-8 rounded-xl w-full max-w-md">

              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">Edit Profile</h2>
                <button
                  onClick={() => setEditOpen(false)}
                  className="text-zinc-400"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-5">

                <div>
                  <label className="text-sm text-zinc-400">
                    Nickname
                  </label>

                  <input
                    value={nickname}
                    onChange={(e) => setNickname(e.target.value)}
                    className="w-full mt-1 bg-zinc-800 px-3 py-2 rounded"
                  />
                </div>

                <div>

                  <label className="text-sm text-zinc-400 block mb-2">
                    Avatar
                  </label>

                  {avatarPreview && (
                    <img
                      src={avatarPreview}
                      className="w-16 h-16 rounded-full mb-3 object-cover"
                    />
                  )}

                  <label className="bg-zinc-800 hover:bg-zinc-700 px-4 py-2 rounded cursor-pointer inline-block">
                    Upload Avatar

                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleAvatar}
                      className="hidden"
                    />
                  </label>

                  {avatar && (
                    <div className="text-xs text-zinc-400 mt-2">
                      {avatar.name}
                    </div>
                  )}

                </div>

                <button
                  onClick={saveProfile}
                  disabled={saving}
                  className="w-full bg-blue-600 py-3 rounded-lg"
                >
                  Save Changes
                </button>

              </div>

            </div>

          </div>
        )}

      </div>
    </div>
  );
}
