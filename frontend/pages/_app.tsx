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

        {/* Open Graph / LinkedIn / Discord / WhatsApp / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://cinesync-os.vercel.app/" />
        <meta property="og:site_name" content="CineSync OS" />
        <meta property="og:title" content="CineSync OS — AI Director & Screenplay Video Platform" />
        <meta property="og:description" content="Turn raw screenplays into structured multi-shot scene coverage with Claude 3.5 Sonnet and Wan2.2 generative video rendering." />
        <meta property="og:image" content="https://cinesync-os.vercel.app/og-image.png" />
        <meta property="og:image:secure_url" content="https://cinesync-os.vercel.app/og-image.png" />
        <meta property="og:image:type" content="image/png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content="CineSync OS — AI Director Studio & Screenplay Pipeline" />

        {/* Twitter / X Social Preview Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="CineSync OS — AI Director & Screenplay Video Platform" />
        <meta name="twitter:description" content="Turn raw screenplays into structured multi-shot scene coverage with Claude 3.5 Sonnet and Wan2.2 generative video rendering." />
        <meta name="twitter:image" content="https://cinesync-os.vercel.app/og-image.png" />

        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="font-[var(--font-inter)]">
        <Component {...pageProps} />
      </div>
    </AuthProvider>
  );
}
