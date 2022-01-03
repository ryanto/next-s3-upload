import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';

export default function({ children }) {
  return (
    <div className="max-w-screen-lg mx-auto mt-12">
      <Head>
        <title>Next S3 Upload</title>
      </Head>
      <div className="flex">
        <div className="w-56">
          <h6 className="text-sm font-semibold text-gray-900">
            Getting started
          </h6>
          <ul>
            <li className="mt-1 pt-1 pb-1 border-l border-gray-200">
              <DocLink href="/setup">Setup</DocLink>
            </li>
            {/* <li className="mt-1">
              <Link href="/setup">
                <a className="text-gray-600 hover:text-gray-700 hover:underline">
                  Verify your setup
                </a>
              </Link>
            </li> */}
          </ul>
          <h6 className="text-sm font-semibold text-gray-900 mt-8">
            Uploading files
          </h6>
          <ul>
            <li className="mt-1 pt-1 border-l border-gray-200">
              <DocLink href="/basic-example">Basic example</DocLink>
            </li>
            <li className="pt-1 border-l border-gray-200">
              <DocLink href="/next-image">Using next/image</DocLink>
            </li>
            {/* <li className="pt-1 border-l border-gray-200">
              <DocLink href="/tracking-progress">Tracking progress</DocLink>
            </li> */}
            <li className="pt-1 border-l border-gray-200">
              <DocLink href="/multi-file-uploads">Multiple files</DocLink>
            </li>
            {/* <li className="pt-1 pb-1 border-l border-gray-200">
              <DocLink href="/custom-file-input">Custom file input</DocLink>
            </li> */}
          </ul>
          <h6 className="text-sm font-semibold text-gray-900 mt-8">
            S3 configuration
          </h6>
          <ul>
            <li className="mt-1 pt-1 pb-1 border-l border-gray-200">
              <DocLink href="/s3-file-paths">File paths</DocLink>
            </li>
          </ul>
          <h6 className="text-sm font-semibold text-gray-900 mt-8">
            React API
          </h6>
          <ul>
            <li className="mt-1 pt-1 pb-1 border-l border-gray-200">
              <DocLink href="/use-s3-upload">useS3Upload</DocLink>
            </li>
          </ul>
          <h6 className="text-sm font-semibold text-gray-900 mt-8">
            Help & support
          </h6>
          <ul>
            <li className="mt-1 pt-1 pb-1 border-l border-gray-200">
              <DocLink href="/use-s3-upload">About me</DocLink>
            </li>
          </ul>
        </div>
        <div className="grow prose mb-32">{children}</div>
      </div>
    </div>
  );
}

const DocLink = ({ href, children }) => {
  let router = useRouter();

  let isActive = router.pathname === href;

  return (
    <Link href={href}>
      <a
        className={`
        pl-3
        ${
          isActive
            ? 'text-purple-500 hover:text-purple-600 font-semibold'
            : 'text-gray-600 hover:text-gray-700 hover:underline'
        }`}
      >
        {children}
      </a>
    </Link>
  );
};
