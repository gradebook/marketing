export interface CompilerBackendOptions {
	watch: boolean;
	cachebust: boolean;
}

export interface CompilerBackend {
	subscribe(handler: (error?: unknown) => any): void;
	#emit(error?: unknown): void;
	init(): void;
	initAsync(): Promise<void>;
}
