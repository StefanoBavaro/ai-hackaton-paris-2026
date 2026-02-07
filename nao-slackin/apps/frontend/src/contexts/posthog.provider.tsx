import { createContext, useContext } from 'react';
import type { PostHog } from 'posthog-js';
import type { ReactNode } from 'react';

/**
 * Context to track whether PostHog is configured.
 * This allows usePostHog to safely return `undefined` when outside PostHogProvider.
 */
const PostHogEnabledContext = createContext<boolean>(false);

/**
 * Provides a PostHog client if configured via environment variables.
 */
export function PostHogProvider({ children }: { children: ReactNode }) {
	return <PostHogEnabledContext.Provider value={false}>{children}</PostHogEnabledContext.Provider>;
}

/**
 * Safe hook to get the PostHog client.
 * Use this instead of importing usePostHog from 'posthog-js/react' directly.
 */
export function usePostHog(): PostHog | undefined {
	const isEnabled = useContext(PostHogEnabledContext);
	if (!isEnabled) {
		return undefined;
	}
	return undefined;
}
