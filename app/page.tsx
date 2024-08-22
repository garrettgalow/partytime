import { getUser } from '@workos-inc/authkit-nextjs';
import LandingPage from './components/LandingPage';
import AuthButtons from './components/AuthButtons';

export default async function Home() {
  const { user } = await getUser();

  if (!user) {
    return <AuthButtons />;
  }

  return <LandingPage />;
}