import { Metadata } from "next";

const APP_URL = process.env.NEXT_PUBLIC_URL || "http://localhost:3000";

export const metadata: Metadata = {
  title: "Food Suggestions Miniapp",
  description: "Find traditional recipes from around the world.",
  openGraph: {
    title: "Food Suggestions Miniapp",
    description: "Find traditional recipes from around the world.",
    images: [`${APP_URL}/frame-welcome.png`],
  },
  other: {
    "fc:frame": "vNext",
    "fc:frame:image": `${APP_URL}/frame-welcome.png`,
    "fc:frame:button:1": "Let's find a recipe!",
    "fc:frame:post_url": `${APP_URL}/api/miniapp`,
  },
};

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100 p-8">
      <main className="w-full max-w-2xl rounded-lg bg-white p-8 shadow-md">
        <h1 className="mb-4 text-center text-3xl font-bold text-gray-800">
          Food Recipe Miniapp
        </h1>
        <p className="mb-6 text-center text-lg text-gray-600">
          This is a Farcaster Dapp. To use it, share this page's
          on different channels.
        </p>
        <div className="flex justify-center">
          <a
            href={`https://farcaster.xyz/~/compose?text=Check%20out%20this%20cool%20recipe%20finder%20on%20Farcaster!&embeds[]=${APP_URL}`}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full bg-purple-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-purple-700"
          >
            Share on Farcaster
          </a>
        </div>
      </main>
    </div>
  );
}
