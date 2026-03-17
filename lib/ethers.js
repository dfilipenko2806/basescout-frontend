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
  if (!window.ethereum) {
    throw new Error("MetaMask not installed");
  }

  try {
    const provider = new ethers.BrowserProvider(window.ethereum);

    await provider.send("eth_requestAccounts", []);

    let network = await provider.getNetwork();
    console.log("Connected chainId:", network.chainId.toString());

    if (network.chainId !== REQUIRED_CHAIN_ID) {
      try {
        await window.ethereum.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: REQUIRED_CHAIN_HEX }]
        });

        network = await provider.getNetwork();

        if (network.chainId !== REQUIRED_CHAIN_ID) {
          throw new Error("Failed to switch to Base Mainnet");
        }
      } catch (switchError) {
        throw new Error("Please switch MetaMask to Base Mainnet (chainId 8453)");
      }
    }

    const signer = await provider.getSigner();
    const address = await signer.getAddress();

    // 🔥 АВТО-РЕГИСТРАЦИЯ
    await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ address })
    });

    return { provider, signer, address };

  } catch (err) {
    console.error("Wallet connection error:", err);

    if (err?.code === "ERR_NETWORK") {
      throw new Error("Network connection failed. Check your internet or Base RPC.");
    }

    throw err;
  }
}


// ================= CHECK-IN =================

export async function doCheckIn(signer) {
  const contract = new ethers.Contract(
    CORE_ADDRESS,
    coreAbi,
    signer
  );

  const tx = await contract.checkIn();
  await tx.wait();
}


// ================= MINT BADGE =================

export async function mintBadge(signer, level) {
  const contract = new ethers.Contract(
    CORE_ADDRESS,
    coreAbi,
    signer
  );

  const tx = await contract.mintBadge(level);
  await tx.wait();
}


// ================= GET USER DATA =================

export async function getUserOnchainData(address) {
  const provider = new ethers.BrowserProvider(window.ethereum);

  const coreContract = new ethers.Contract(
    CORE_ADDRESS,
    coreAbi,
    provider
  );

  const pointsBN = await coreContract.points(address);
  const streakBN = await coreContract.streak(address);
  const lastCheckInBN = await coreContract.lastCheckIn(address);

  const badges = [];

  for (let level = 1; level <= 9; level++) {
    const minted = await coreContract.badgeMinted(address, level);
    if (minted) badges.push(level);
  }

  return {
    points: Number(pointsBN),
    streak: Number(streakBN),
    badges,
    lastCheckIn: Number(lastCheckInBN)
  };
}


// ================= LEADERBOARD =================

export async function getLeaderboard() {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/leaderboard`
  );

  if (!res.ok) {
    throw new Error("Failed to fetch leaderboard");
  }

  return res.json();
}
