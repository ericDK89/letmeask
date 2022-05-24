import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { app } from "../services/firebase";

interface User {
  id: string;
  name: string;
  avatar: string;
  email?: string | null;
}

interface AuthContextTypes {
  user: User | undefined;
  singInWithGoogle: () => Promise<void>;
}

interface AuthContextProviderProps {
  children: React.ReactNode;
}

export const AuthContext = createContext({} as AuthContextTypes);

export function AuthContextProvider({ children }: AuthContextProviderProps) {
  const [user, setUser] = useState<User>();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        const { displayName, photoURL, uid, email } = user;

        if (!displayName || !photoURL) {
          throw new Error("Missing information from Google Account");
        }

        setUser({
          id: uid,
          name: displayName,
          avatar: photoURL,
          email: email,
        });
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const provider = new GoogleAuthProvider();
  const auth = getAuth(app);
  const navigate = useNavigate();

  async function singInWithGoogle() {
    const res = await signInWithPopup(auth, provider);

    if (res.user) {
      const { displayName, photoURL, uid, email } = res.user;
      navigate("/rooms/new", { replace: true });

      if (!displayName || !photoURL) {
        throw new Error("Missing information from Google Account");
      }

      setUser({
        id: uid,
        name: displayName,
        avatar: photoURL,
        email: email,
      });
    }
  }

  return (
    <AuthContext.Provider value={{ user, singInWithGoogle }}>
      {children}
    </AuthContext.Provider>
  );
}
