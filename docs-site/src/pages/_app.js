import Head from 'next/head';
import 'tailwindcss/tailwind.css';
import '../styles/main.css';

function MyApp({ Component, pageProps }) {
  return (
    <div>
      <Head>
        <link rel="stylesheet" href="https://rsms.me/inter/inter.css"></link>
        <title>Next S3 Upload</title>
        <link rel="shortcut icon" href="/icon.png" />
        <meta
          name="description"
          content="The easiest way to upload files from your Next.js app to S3.
"
        />
        <meta property="og:title" content="Next S3 Upload" />
        <meta
          property="og:description"
          content="The easiest way to upload files from your Next.js app to S3.
"
        />
        <meta property="og:image" content="/og-image.png" />
      </Head>

      <Component {...pageProps} />
    </div>
  );
}

export default MyApp;
