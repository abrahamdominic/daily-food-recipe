import {
  createPublicClient,
  createWalletClient,
  http,
  Address,
  parseAbi,
  Log,
} from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { baseSepolia } from "viem/chains";
import UserPreferencesABI from "../contracts/UserPreferences.json";
 
const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as Address;
if (!contractAddress) {
  throw new Error(
    "NEXT_PUBLIC_CONTRACT_ADDRESS is not defined in environment variables.",
  );
}

const rpcUrl = process.env.BASE_SEPOLIA_RPC_URL;
if (!rpcUrl) {
  throw new Error("BASE_SEPOLIA_RPC_URL is not defined in environment variables.");
}
 
// Initialize Viem clients
const publicClient = createPublicClient({
  chain: baseSepolia,
  transport: http(rpcUrl),
});

const account = privateKeyToAccount(
  `0x${process.env.PRIVATE_KEY as string}`,
);

const walletClient = createWalletClient({
  account,
  chain: baseSepolia,
  transport: http(rpcUrl),
});

const contract =  {
  address: contractAddress,
  abi: UserPreferencesABI.abi,
};

/**
 * @description Reads user preferences from the smart contract.
 * @param fid The Farcaster ID of the user.
 * @returns The user's preferences or null if not found.
 */
export async function readUserPreferences(fid: bigint) {
  try {
    const data = await publicClient.readContract({
      ...contract,
      functionName: "fidToPreferences",
      args: [fid],
    });

    const [country, dietaryRestrictions] = data as [string, string];

    if (!country && !dietaryRestrictions) {
      return null;
    }

    return { country, dietaryRestrictions };
  } catch (error) {
    console.error("Error reading user preferences:", error);
    throw new Error("Failed to read preferences from the blockchain.");
  }
}

/**
 * @description Writes user preferences to the smart contract.
 * @param fid The Farcaster ID of the user.
 * @param country The user's country.
 * @param dietaryRestrictions The user's dietary restrictions.
 * @returns The transaction hash.
 */
export async function writeUserPreferences(
  fid:bigint,
  country: string,
  dietaryRestrictions: string
) {
  try {
    const { request } = await publicClient.simulateContract({
      ...contract,
      functionName: "setUserPreferences",
      args: [fid, country, dietaryRestrictions],
      account,
    });

    const hash = await walletClient.writeContract(request);
    return hash;
  } catch (error) {
    console.error("Error writing user preferences:", error);
    throw new Error("Failed to write preferences to the blockchain.");
  }
}

/**
 * @description Listens for the UserPreferencesUpdated event on the smart contract.
 * @param onUpdate A callback function to execute when an event is received.
 */
export function watchPreferenceUpdates(
  onUpdate:  (logs: Log[]) => void
) {
  console.log("Listening for UserPreferencesUpdated events...");
  publicClient.watchContractEvent({
    ...contract,
    eventName: "UserPreferencesUpdated",
    onLogs: (logs) => {
      console.log("Event received:", logs);
      onUpdate(logs);
    },
    onError: (error) => {
      console.error("Error watching contract events:", error);
    },
  });
}