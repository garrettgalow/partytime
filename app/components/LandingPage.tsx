import Link from 'next/link';

export default function LandingPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-4xl font-bold mb-8">Welcome to Music Rooms</h1>
      <div className="space-x-4">
        <Link href="/start-room" className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded">
          Start a Room
        </Link>
        <Link href="/join-room" className="bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded">
          Join a Room
        </Link>
      </div>
    </div>
  );
}