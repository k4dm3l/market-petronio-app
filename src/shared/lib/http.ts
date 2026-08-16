import axios, { type AxiosError, type InternalAxiosRequestConfig } from "axios";
import { STORAGE_KEYS } from "@/shared/config";
import { emitSessionSync } from "./session-sync";
import { Storage } from "./storage";

export const http = axios.create({
	baseURL: import.meta.env.VITE_API_URL,
});

http.interceptors.request.use((config) => {
	const token = getStoredSessionField("accessToken");
	if (token) {
		config.headers.set("Authorization", `Bearer ${token}`);
	}
	return config;
});

// Requests where a 401 must never trigger a refresh attempt: wrong
// credentials on login/register aren't an expired-token situation, and the
// refresh call itself must not try to refresh on its own failure.
const REFRESH_PATH = "/api/auth/refresh";
const NO_REFRESH_PATHS = ["/api/auth/login", "/api/auth/register", REFRESH_PATH];

interface RetryableConfig extends InternalAxiosRequestConfig {
	_retry?: boolean;
}

// Shared across concurrent 401s so they all await the same refresh call
// instead of each firing their own (single-flight).
let refreshPromise: Promise<string> | null = null;

http.interceptors.response.use(
	(response) => response,
	async (error: AxiosError) => {
		const config = error.config as RetryableConfig | undefined;

		if (
			error.response?.status !== 401 ||
			!config ||
			config._retry ||
			isNoRefreshPath(config.url)
		) {
			throw error;
		}

		const refreshToken = getStoredSessionField("refreshToken");
		if (!refreshToken) {
			handleRefreshFailure();
			throw error;
		}

		config._retry = true;

		try {
			refreshPromise ??= refreshAccessToken(refreshToken).finally(() => {
				refreshPromise = null;
			});
			const accessToken = await refreshPromise;
			config.headers.set("Authorization", `Bearer ${accessToken}`);
			return http(config);
		} catch {
			handleRefreshFailure();
			throw error;
		}
	},
);

async function refreshAccessToken(refreshToken: string): Promise<string> {
	// A plain axios call, deliberately bypassing the `http` instance so this
	// request never runs back through these same interceptors.
	const { data } = await axios.post<{
		accessToken: string;
		refreshToken?: string;
	}>(`${import.meta.env.VITE_API_URL}${REFRESH_PATH}`, { refreshToken });

	const session = Storage.get(STORAGE_KEYS.session);
	if (typeof session === "object" && session !== null) {
		Storage.set(STORAGE_KEYS.session, {
			...session,
			accessToken: data.accessToken,
			refreshToken: data.refreshToken ?? refreshToken,
		});
	}
	emitSessionSync();

	return data.accessToken;
}

function handleRefreshFailure(): void {
	Storage.clear(STORAGE_KEYS.session);
	emitSessionSync();
}

function isNoRefreshPath(url: string | undefined): boolean {
	if (!url) return false;
	return NO_REFRESH_PATHS.some((path) => url.includes(path));
}

function getStoredSessionField(
	field: "accessToken" | "refreshToken",
): string | null {
	const session = Storage.get(STORAGE_KEYS.session);
	if (typeof session !== "object" || session === null) return null;
	const value = (session as Record<string, unknown>)[field];
	return typeof value === "string" ? value : null;
}
