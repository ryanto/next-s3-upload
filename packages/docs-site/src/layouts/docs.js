import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';

export default function({ children, tableOfContents }) {
  return (
    <div className="flex flex-col max-w-screen-xl mx-auto">
      <Head>
        <title>Next S3 Upload</title>
      </Head>
      <div className="mx-auto px-4 mt-10 md:px-0 w-full md:w-[65ch] lg:w-[calc(14rem+65ch)] xl:w-[calc(14rem+14rem+65ch)]">
        <div className="flex items-center justify-between">
          <Link href="/">
            <a className="-skew-x-[9deg] -rotate-0 inline-block text-sm sm:text-base px-2 sm:px-4 text-white font-semibold py-1.5 sm:py-2.5 rounded bg-gradient-to-r from-purple-600 to-sky-600">
              <span className="skew-x-[9deg] rotate-0 flex justify-center items-center px-1 py-1">
                <UploadIcon className="w-5 h-5 mr-1" />
                Next S3 Upload
              </span>
            </a>
          </Link>
          <a href="https://github.com/ryanto/next-s3-upload">
            <GithubIcon className="w-6 h-6 text-gray-700 hover:text-gray-800" />
          </a>
        </div>
      </div>
      <div className="flex max-w-screen-xl px-4 mx-auto md:px-0 mt-14">
        <div className="hidden w-56 pr-12 lg:block">
          <h6 className="text-sm font-semibold text-gray-900">
            Getting started
          </h6>
          <ul>
            <li className="pt-1 pb-1 mt-1 border-l border-gray-200">
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
          <h6 className="mt-8 text-sm font-semibold text-gray-900">
            Uploading files
          </h6>
          <ul>
            <li className="pt-1 mt-1 border-l border-gray-200">
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
            <li className="pt-1 pb-1 border-l border-gray-200">
              <DocLink href="/custom-file-input">Custom file input</DocLink>
            </li>
          </ul>
          <h6 className="mt-8 text-sm font-semibold text-gray-900">
            S3 configuration
          </h6>
          <ul>
            <li className="pt-1 pb-1 mt-1 border-l border-gray-200">
              <DocLink href="/s3-file-paths">File paths</DocLink>
            </li>
            {/* <li className="pt-1 pb-1 border-l border-gray-200">
              <DocLink href="/custom-file-input">Deleting files</DocLink>
            </li> */}
          </ul>
          <h6 className="mt-8 text-sm font-semibold text-gray-900">
            React API
          </h6>
          <ul>
            <li className="pt-1 pb-1 mt-1 border-l border-gray-200">
              <DocLink href="/use-s3-upload">useS3Upload</DocLink>
            </li>
          </ul>
          <h6 className="mt-8 text-sm font-semibold text-gray-900">
            Help & support
          </h6>
          <ul>
            <li className="pt-1 pb-1 mt-1 border-l border-gray-200">
              <DocLink href="https://github.com/ryanto/next-s3-upload/issues">
                Github issues
              </DocLink>
            </li>
          </ul>
        </div>
        <div className="grow prose prose-pre:rounded-none md:prose-pre:rounded prose-code:text-purple-600 mb-32 md:min-w-[65ch] max-w-[calc(100vw-2rem)] md:max-w-prose mx-auto lg:mx-0">
          {children}
        </div>
        <div className="hidden w-56 pl-12 text-xs xl:block">
          <div className="font-semibold uppercase">On this page</div>
          <TOC tableOfContents={tableOfContents} />
        </div>
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

function GithubIcon(props) {
  return (
    <svg viewBox="0 0 16 16" fill="currentColor" {...props}>
      <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
    </svg>
  );
}

function UploadIcon(props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="currentColor"
      viewBox="0 0 2048 2048"
      {...props}
    >
      <path d="M1374 1004q-8 20-30 20h-192v352q0 14-9 23t-23 9H928q-14 0-23-9t-9-23v-352H704q-14 0-23-9t-9-23q0-12 10-24l319-319q11-9 23-9t23 9l320 320q15 16 7 35zm-350-524q-148 0-273 73T553 751t-73 273 73 273 198 198 273 73 273-73 198-198 73-273-73-273-198-198-273-73zm768 544q0 209-103 385.5T1409.5 1689 1024 1792t-385.5-103T359 1409.5 256 1024t103-385.5T638.5 359 1024 256t385.5 103T1689 638.5t103 385.5z" />
    </svg>
  );
}

function TOC({ tableOfContents, level = 1 }) {
  let router = useRouter();

  return tableOfContents.map(({ title, slug, children }) => (
    <ul key={slug} className={`${level > 2 ? 'pl-2' : ''}`}>
      <li className="pt-2">
        <Link href={`${router.pathname}#${slug}`}>
          <a>{title}</a>
        </Link>
      </li>

      {children?.length > 0 ? (
        <li>
          <TOC tableOfContents={children} level={level + 1} />
        </li>
      ) : (
        <></>
      )}
    </ul>
  ));
}
