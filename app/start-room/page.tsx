import Link from 'next/link';

export default function StartRoom() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-3xl font-bold mb-8">Connect to Spotify</h1>
      <Link href="#" className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
        Connect Spotify Account
      </Link>
    </div>
  );
}