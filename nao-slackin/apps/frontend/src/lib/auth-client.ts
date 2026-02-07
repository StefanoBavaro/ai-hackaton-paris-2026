export const useSession = () => {
	return {
		isPending: false,
		data: {
			user: {
				id: 'local',
				name: 'Local User',
				email: 'local@localhost',
				requiresPasswordReset: false,
			},
		},
	} as const;
};

export const signIn = {
	email: async () => undefined,
	social: async () => undefined,
};

export const signUp = {
	email: async () => undefined,
};

export const signOut = async () => undefined;

export const handleGoogleSignIn = async () => undefined;
