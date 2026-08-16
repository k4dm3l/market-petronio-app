const SESSION_SYNC_EVENT = "petroneo:session-sync";

/** Notifies listeners that the stored session changed outside React (e.g. from the http interceptor). */
export function emitSessionSync(): void {
	window.dispatchEvent(new Event(SESSION_SYNC_EVENT));
}

export function onSessionSync(listener: () => void): () => void {
	window.addEventListener(SESSION_SYNC_EVENT, listener);
	return () => window.removeEventListener(SESSION_SYNC_EVENT, listener);
}
