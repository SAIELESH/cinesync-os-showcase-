import type { AppProps } from "next/app";
import Head from "next/head";
import { AuthProvider } from "@/lib/auth";
import "@/styles/globals.css";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <Head>
        <title>CineSync OS — AI Director & Screenplay Video Platform</title>
        <meta name="description" content="Turn raw screenplays into structured multi-shot scene coverage with Claude 3.5 Sonnet and Wan2.2 generative video rendering." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />

        {/* LinkedIn Exact Preferred Specification */}
        <meta name="image" property="og:image" content="https://cinesync-os.vercel.app/og-hero.png" />
        <meta property="og:image:secure_url" content="https://cinesync-os.vercel.app/og-hero.png" />
        <meta property="og:image:type" content="image/png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content="CineSync OS — AI Director Studio & Screenplay Pipeline" />
        <link rel="image_src" href="https://cinesync-os.vercel.app/og-hero.png" />

        {/* Twitter / X Social Preview Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="CineSync OS — AI Director & Screenplay Video Platform" />
        <meta name="twitter:description" content="Turn raw screenplays into structured multi-shot scene coverage with Claude 3.5 Sonnet and Wan2.2 generative video rendering." />
        <meta name="twitter:image" content="https://cinesync-os.vercel.app/og-hero.png?v=3" />

        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="font-[var(--font-inter)]">
        <Component {...pageProps} />
      </div>
    </AuthProvider>
  );
}
