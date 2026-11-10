import { createContext, useContext, useMemo, useReducer } from "react";

const AuthContext = createContext(null);

const initialState = { user: null };

function authReducer(state, action) {
  switch (action.type) {
    case "LOGGED_IN":
      return { ...state, user: action.payload };
    case "LOGGED_OUT":
      return { ...state, user: null };
    default:
      throw new Error(`Unknown auth action: ${action.type}`);
  }
}

export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Memoised so consumers only re-render when the user actually changes.
  const value = useMemo(
    () => ({
      user: state.user,
      loggedIn: (user) => dispatch({ type: "LOGGED_IN", payload: user }),
      logout: () => dispatch({ type: "LOGGED_OUT" }),
    }),
    [state.user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === null) {
    throw new Error("useAuth must be used inside an <AuthProvider>. Wrap your app with <AuthProvider>.");
  }
  return context;
}