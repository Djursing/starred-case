import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en" className="h-full text-zinc-950 antialiased lg:bg-zinc-100 dark:bg-zinc-900 dark:text-white">
      <Head />
      <body className="h-full antialiased">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
