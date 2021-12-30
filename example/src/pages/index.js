import Head from 'next/head';
import { CloudUploadIcon } from '@heroicons/react/outline';
import Snippet from '../snippets/homepage.mdx';

export default function Home() {
  return (
    <div className=" flex flex-col h-screen">
      <Head>
        <title>Next S3 Upload</title>
        <meta name="description" content="Upload files from Next.js to S3" />
      </Head>

      <div className="mt-32 mx-auto w-[768px]">
        <div className="p-4 border border-gray-200 shadow-sm bg-white">
          <h1 className="mt-8 block text-3xl text-center leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            Next S3 Upload
          </h1>
          <p className="text-center mt-8 text-xl text-gray-500 leading-8">
            The easiest way to upload files from your Next.js app to S3.
          </p>
          <div className="bg-blue-800 prose">
            <Snippet />
          </div>
          <div className="mt-8 pb-12 flex items-center justify-center">
            <button
              type="button"
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <CloudUploadIcon
                className="-ml-1 mr-3 h-5 w-5"
                aria-hidden="true"
              />
              Get started
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
