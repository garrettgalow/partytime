import Link from 'next/link';
import { getSignInUrl, getSignUpUrl } from '@workos-inc/authkit-nextjs';

export default async function AuthButtons() {
  const signInUrl = await getSignInUrl();
  const signUpUrl = await getSignUpUrl();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-4xl font-bold mb-8">Welcome to Party Time</h1>
      <div className="space-x-4">
        <Link href={signInUrl} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Sign In
        </Link>
        <Link href={signUpUrl} className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
          Sign Up
        </Link>
      </div>
    </div>
  );
}
