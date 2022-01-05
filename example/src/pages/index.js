import Head from 'next/head';
import Vimeo from '@u-wave/react-vimeo';
import Snippet from '../snippets/homepage.mdx';
import Link from 'next/link';
import { useState } from 'react';
import { ArrowSmRightIcon } from '@heroicons/react/outline';

export default function Home() {
  let [videoPlayer, setVideoPlayer] = useState();

  return (
    <div>
      <style jsx>{`
        .bg {
          background-color: #ffffff;
          background-image: url("data:image/svg+xml,%3Csvg width='50' height='50' viewBox='0 0 50 50' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%2394a3b8' fill-opacity='0.07' fill-rule='evenodd'%3E%3Ccircle cx='3' cy='3' r='3'/%3E%3Ccircle cx='25' cy='25' r='3'/%3E%3C/g%3E%3C/svg%3E");
        }
      `}</style>

      <div className="bg flex flex-col min-h-screen">
        <Head>
          <title>Next S3 Upload</title>
          <meta name="description" content="Upload files from Next.js to S3" />
        </Head>

        <div className="mt-16 xl:mt-40 mx-auto">
          <h1 className="block text-3xl text-center leading-8 font-extrabold tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
            Next S3 Upload
          </h1>
          <div className="text-center mt-8 text-xl text-gray-500 leading-8 lg:text-2xl lg:mt-12 mx-4 sm:mx-0">
            The{' '}
            <em className="inline-block -rotate-3 px-2 sm:px-4 text-white py-0.5 sm:py-2.5 rounded bg-gradient-to-r from-purple-600 to-sky-600 -skew-x-12">
              <span className="inline-block skew-x-12 rotate-3">easiest</span>
            </em>{' '}
            way to upload files from your Next.js app to S3.
          </div>

          <div className="flex flex-col xl:flex-row shadow mt-12 xl:w-screen 2xl:w-screen 2xl:max-w-[1580px] relative">
            <Vimeo
              video="662325962"
              autoplay
              background
              muted
              dnt
              responsive
              onReady={player => {
                setVideoPlayer(player);
              }}
              onTimeUpdate={t => {
                if (t.seconds > 14) {
                  videoPlayer.pause();
                }
              }}
              className="w-full bg-slate-100 aspect-video grow hidden sm:block"
            />

            <div className="w-100 max-w-[100vw] overflow-scroll xl:overflow-visible xl:w-auto bg-gray-800">
              <div className="bg-gray-800 prose shrink xl:prose-pre:text-[0.78rem] 2xl:prose-pre:text-sm">
                <Snippet />
              </div>
            </div>
          </div>

          <div className="mt-12 md:mt-16 pb-12 md:pb-24 flex items-center justify-center">
            <Link href="/setup">
              <a className="inline-flex items-center px-6 py-3 border border-transparent shadow-sm text-xl font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500">
                Get started
                <ArrowSmRightIcon
                  className="ml-3 -mr-1 h-7 w-7"
                  aria-hidden="true"
                />
              </a>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
