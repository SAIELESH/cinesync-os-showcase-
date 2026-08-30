import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en" className="dark">
      <Head>
        <meta charSet="utf-8" />
        
        {/* Open Graph Meta Tags for LinkedIn, Twitter, WhatsApp, Discord */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://cinesync-os.vercel.app/" />
        <meta property="og:site_name" content="CineSync OS" />
        <meta property="og:title" content="CineSync OS — AI Director & Screenplay Video Platform" />
        <meta property="og:description" content="Turn raw screenplays into structured multi-shot scene coverage with Claude 3.5 Sonnet and Wan2.2 generative video rendering." />
        <meta property="og:image" content="https://cinesync-os.vercel.app/og-hero.png" />
        <meta property="og:image:secure_url" content="https://cinesync-os.vercel.app/og-hero.png" />
        <meta property="og:image:type" content="image/png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content="CineSync OS — AI Director Studio & Screenplay Pipeline" />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="CineSync OS — AI Director & Screenplay Video Platform" />
        <meta name="twitter:description" content="Turn raw screenplays into structured multi-shot scene coverage with Claude 3.5 Sonnet and Wan2.2 generative video rendering." />
        <meta name="twitter:image" content="https://cinesync-os.vercel.app/og-hero.png" />
        
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <body className="bg-background text-foreground antialiased selection:bg-accent/30 selection:text-white">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
