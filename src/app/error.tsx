"use client";

export default function ErrorPage({ reset }: { reset: () => void }) {
  return (
    <div className="container-main flex min-h-[50vh] items-center justify-center py-20 text-center">
      <div>
        <h1 className="text-3xl font-bold">Something went wrong</h1>
        <p className="mt-3 text-gray-500">
          We couldn&apos;t load this page right now.
        </p>
        <button
          onClick={reset}
          className="mt-6 rounded-xl bg-green-600 px-6 py-3 font-semibold text-white"
        >
          Try Again
        </button>
      </div>
    </div>
  );
}
