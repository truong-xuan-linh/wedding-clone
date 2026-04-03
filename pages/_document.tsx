import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="vi" className="mdl-js">
      <Head>
        <meta name="author" content="Công Tú &amp; Diễm My" />
        <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@linhtruong" />
        <meta name="twitter:creator" content="@linhtruong" />
        <meta property="og:locale" content="vi_VN" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://wedding-groom-side.vercel.app" />
        <meta property="og:title" content="Công Tú & Diễm My Wedding Invitation" />
        <meta property="og:description" content="Kính mời bạn đến chung vui cùng gia đình chúng mình!" />
        <meta
          property="og:image"
          content="https://wedding-groom-side.vercel.app/assets/images/4011796024475880260.webp"
        />
        <meta
          property="twitter:image"
          content="https://wedding-groom-side.vercel.app/assets/images/4011796024475880260.webp"
        />
        <meta property="og:image:alt" content="Công Tú & Diễm My Wedding Invitation" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta name="msapplication-TileColor" content="#da532c" />
        <meta name="theme-color" content="#ffffff" />
        <link rel="icon" href="/assets/images/favicon.ico" />
        {/* All page styles served as a static file to avoid PostCSS processing overhead */}
        <link rel="stylesheet" href="/css/globals.css" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
