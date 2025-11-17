# Farcaster Food Recipe Miniapp

## Getting Started
A Farcaster Miniapp that provides traditional food recipe suggestions based on a user's country and meal type preference. It leverages Google's Gemini AI for content generation and stores user preferences on the Base blockchain.

First, run the development server:
## Features

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```
- **Interactive Farcaster Miniapp**: A multi-step UI flow entirely within a Farcaster client.
- **AI-Powered Suggestions**: Uses Google's Gemini AI to generate unique dish ideas, including ingredients and preparation time.
- **OnChain Preferences**: Allows users to connect their wallet and save their preferences to a smart contract on Base Sepolia.
- **Wallet Integration**: Uses Wagmi, WalletConnect, and Coinbase Wallet for seamless wallet connections on the frontend.
- **YouTube Integration**: Provides direct links to search for recipe videos on YouTube.

Open http://localhost:3000 with your browser to see the result.
## Tech Stack

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.
- **Framework**: Next.js (App Router)
- **Styling**: Tailwind CSS
- **Blockchain**: Base Sepolia
- **Smart Contracts**: Solidity, Hardhat
- **Backend Web3 Lib**: viem
- **Frontend Web3 Lib**: wagmi
- **AI**: Google Gemini

This project uses `next/font` to automatically optimize and load Geist, a new font family for Vercel.
## Prerequisites

## Learn More
Before you begin, ensure you have the following installed:
- Node.js (v18 or later)
- Yarn or npm
- A crypto wallet like MetaMask

To learn more about Next.js, take a look at the following resources:
## Getting Started

- Next.js Documentation - learn about Next.js features and API.
- Learn Next.js - an interactive Next.js tutorial.
Follow these steps to get your development environment set up.

You can check out the Next.js GitHub repository - your feedback and contributions are welcome!
### 1. Clone the Repository

## Deploy on Vercel
```bash
git clone https://github.com/abrahamdominic/daily-food-recipe.git
cd daily-food-recipe
```

The easiest way to deploy your Next.js app is to use the Vercel Platform from the creators of Next.js.
### 2. Install Dependencies

Check out our Next.js deployment documentation for more details.
```bash
npm install
```

### 3. Set Up Environment Variables

Create a `.env.local` file in the root of the project by copying the example file:

```bash
cp .env.example .env.local
```

Now, fill in the values in `.env.local`:

- **`GEMINI_API_KEY`**: Get your API key from Google AI Studio.
- **`BASE_SEPOLIA_RPC_URL`**: Get an RPC URL from a node provider like Alchemy or Infura.
- **`PRIVATE_KEY`**: Export the private key from your development wallet. **Warning**: This is for development only. Never commit a private key to version control.
- **`NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID`**: Create a project on WalletConnect Cloud to get a Project ID.

The `NEXT_PUBLIC_CONTRACT_ADDRESS` will be filled in after deploying the smart contract.

### 4. Compile and Deploy the Smart Contract

First, compile the Solidity contract:

```bash
npm run compile
```

Next, deploy the contract to the Base Sepolia testnet. Make sure your wallet (associated with `PRIVATE_KEY`) is funded with Base Sepolia ETH.

```bash
npm run deploy
```

After a successful deployment, the script will print the contract address to the console. Copy this address and paste it into your `.env.local` file:

```env
NEXT_PUBLIC_CONTRACT_ADDRESS="0xYourDeployedContractAddress"
```

### 5. Run the Development Server

You are now ready to start the application.

```bash
npm run dev
```

Open http://localhost:3000 with your browser to see the result.

To test the Farcaster Miniapp, you can use a tool like the Farcaster Validator or simply share your `localhost` URL (exposed via a tool like ngrok) in a Farcaster client.

## Project Structure

```
├── app/                # Next.js pages and API routes
├── components/         # Shared React components (e.g., WagmiProvider)
├── contracts/          # Solidity smart contracts
├── hooks/              # Custom React hooks (e.g., for Wagmi)
├── lib/                # Core application logic (blockchain services, Wagmi config)
├── public/             # Static assets (images for frames)
├── scripts/            # Deployment scripts (e.g., deploy.js)
├── utils/              # Helper functions and services (e.g., Gemini AI client)
├── hardhat.config.js   # Hardhat configuration
├── next.config.js      # Next.js configuration
└── package.json        # Project scripts and dependencies
```

## Deployment

This project is configured for deployment on Vercel.

1.  Push your code to a Git repository (e.g., GitHub).
2.  Import the repository into Vercel.
3.  Add all the environment variables from your `.env.local` file to the Vercel project settings.
4.  Deploy! Vercel will automatically build and deploy your Next.js application.
