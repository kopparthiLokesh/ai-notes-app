import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto max-w-md p-8 text-center">
      <h2 className="text-xl font-semibold">Page not found</h2>
      <Link href="/" className="mt-4 inline-block text-blue-600 underline">
        Back to notes
      </Link>
    </main>
  );
}
