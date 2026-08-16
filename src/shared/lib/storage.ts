const jsonParse = (text: string): unknown => {
	try {
		return JSON.parse(text);
	} catch {
		return text;
	}
};

export const Storage = {
	get: (storeProp: string): unknown => {
		try {
			const store = window.localStorage.getItem(storeProp);
			return store ? jsonParse(store) : undefined;
		} catch {
			return undefined;
		}
	},
	set: (storeProp: string, value: unknown): void => {
		try {
			const store = JSON.stringify(value);
			window.localStorage.setItem(storeProp, store);
		} catch {
			return;
		}
	},
	clear: (storeProp: string | null = null): void => {
		try {
			if (storeProp) {
				window.localStorage.removeItem(storeProp);
				return;
			}
			window.localStorage.clear();
		} catch {
			return;
		}
	},
};
