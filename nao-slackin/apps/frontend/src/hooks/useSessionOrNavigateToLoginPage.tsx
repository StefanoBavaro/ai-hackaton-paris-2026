import { useSession } from '@/lib/auth-client';

export const useSessionOrNavigateToLoginPage = () => {
	const session = useSession();
	return session;
};
