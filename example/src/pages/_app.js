import Head from 'next/head';
import 'tailwindcss/tailwind.css';
import '../styles/main.css';

function MyApp({ Component, pageProps }) {
  return (
    <div>
      <Head>
        <link rel="stylesheet" href="https://rsms.me/inter/inter.css"></link>
      </Head>

      <Component {...pageProps} />
    </div>
  );
}

export default MyApp;
