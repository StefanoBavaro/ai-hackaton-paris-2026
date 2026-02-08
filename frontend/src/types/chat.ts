export type UIMessagePart = {
	type: 'text';
	text: string;
	state?: 'streaming' | 'done';
};

export type UIMessage = {
	id: string;
	role: 'user' | 'assistant';
	parts: UIMessagePart[];
};

export type ChatListItem = {
	id: string;
	title: string;
	createdAt: number;
	updatedAt: number;
};
