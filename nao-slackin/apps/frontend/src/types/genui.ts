export interface ChaosState {
	rotation?: number;
	fontFamily?: string;
	animation?: string | null;
	theme?: string;
}

export interface Block {
	type: string;
	props: Record<string, unknown>;
}

export interface DashboardSpec {
	blocks: Block[];
	chaos?: ChaosState;
}
