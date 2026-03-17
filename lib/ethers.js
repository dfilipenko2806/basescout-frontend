import { ethers } from "ethers";

const CORE_ADDRESS = process.env.NEXT_PUBLIC_CORE_ADDRESS;

// 🔵 Base Mainnet
const REQUIRED_CHAIN_ID = 8453n;
const REQUIRED_CHAIN_HEX = "0x2105"; // 8453 в hex
console.log("CORE ADDRESS:", CORE_ADDRESS);

const coreAbi = [
  "function checkIn() external",
  "function mintBadge(uint256 level) external",
  "function points(address user) view returns(uint256)",
  "function streak(address user) view returns(uint256)",
  "function badgeMinted(address user, uint256 level) view returns(bool)",
  "function lastCheckIn(address user) view returns(uint256)"
];

// ================= CONNECT WALLET =================
export async function connectWallet() {
  if (!window.ethereum) throw new Error("MetaMask not installed");

  try {
    const provider = new ethers.BrowserProvider(window.ethereum);
    await provider.send("eth_requestAccounts", []);

    let network = await provider.getNetwork();
    console.log("Connected chainId:", network.chainId.toString());

    if (network.chainId !== REQUIRED_CHAIN_ID) {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: REQUIRED_CHAIN_HEX }]
      });

      network = await provider.getNetwork();
      if (network.chainId !== REQUIRED_CHAIN_ID) {
        throw new Error("Failed to switch to Base Mainnet");
      }
    }

    const signer = await provider.getSigner();
    const address = await signer.getAddress();

    // 🔹 Авто-регистрация пользователя
    await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ address })
    });

    return { provider, signer, address };
  } catch (err) {
    console.error("Wallet connection error:", err);
    throw err;
  }
}

// ================= CHECK-IN =================
export async function doCheckIn(signer) {
  const contract = new ethers.Contract(CORE_ADDRESS, coreAbi, signer);
  const tx = await contract.checkIn();
  await tx.wait();
}

// ================= MINT BADGE =================
export async function mintBadge(signer, level) {
  const contract = new ethers.Contract(CORE_ADDRESS, coreAbi, signer);
  const tx = await contract.mintBadge(level);
  await tx.wait();
}

// ================= GET USER DATA =================
// 🔹 Получаем сумму поинтов из истории на бекенде
export async function getUserData(address) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/points-history/${address}`);
  const history = await res.json();

  const points = history.reduce((sum, h) => sum + (h.points || 0), 0);

  return { points };
}

// ================= LEADERBOARD =================
export async function getLeaderboard() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/leaderboard`);
  if (!res.ok) throw new Error("Failed to fetch leaderboard");
  return res.json();
}
