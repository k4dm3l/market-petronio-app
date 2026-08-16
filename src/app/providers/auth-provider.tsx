import type { ReactNode } from "react";
import {
	createContext,
	useCallback,
	useContext,
	useEffect,
	useMemo,
	useState,
} from "react";
import {
	clearSession,
	readSession,
	writeSession,
} from "@/entities/session/model/storage";
import type { Role, Session, User } from "@/entities/session/model/types";
import { onSessionSync } from "@/shared/lib/session-sync";

type AuthStatus = "authenticated" | "unauthenticated";

interface AuthContextValue {
	status: AuthStatus;
	user: User | null;
	token: string | null;
	role: Role | null;
	signIn: (session: Session) => void;
	signOut: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
	const [session, setSession] = useState<Session | null>(() => readSession());

	const signIn = useCallback((next: Session) => {
		writeSession(next);
		setSession(next);
	}, []);

	const signOut = useCallback(() => {
		clearSession();
		setSession(null);
	}, []);

	// The http interceptor mutates the stored session directly (token
	// refresh, or clearing it when refresh fails) outside of React state.
	useEffect(() => onSessionSync(() => setSession(readSession())), []);

	const value = useMemo<AuthContextValue>(
		() => ({
			status: session ? "authenticated" : "unauthenticated",
			user: session?.user ?? null,
			token: session?.accessToken ?? null,
			role: session?.user.role ?? null,
			signIn,
			signOut,
		}),
		[session, signIn, signOut],
	);

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
	const context = useContext(AuthContext);
	if (!context) {
		throw new Error("useAuth must be used within an AuthProvider");
	}
	return context;
}
