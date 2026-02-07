export const useChatQuery = ({ chatId }: { chatId?: string }) => {
	return { data: chatId ? null : null, isFetching: false };
};
