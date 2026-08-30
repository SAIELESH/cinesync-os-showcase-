import type { AppProps } from "next/app";
import { AuthProvider } from "@/lib/auth";
import "@/styles/globals.css";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <div className="font-[var(--font-inter)]">
        <Component {...pageProps} />
      </div>
    </AuthProvider>
  );
}
