import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';

interface AuthContextType {
  isAuthenticated: boolean;
  user: { name: string; email: string } | null;
  login: (email: string, password: string, name?: string) => void;
  logout: () => void;
  updateUser: (name: string, email: string) => void;
  updatePassword: (password: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);

  useEffect(() => {
    
    const stored = localStorage.getItem('seneflix_user');
    if (stored) {
      const userData = JSON.parse(stored);
      setUser(userData);
      setIsAuthenticated(true);
    }
  }, []);

  const login = (email: string, _password: string, name?: string) => {
    // Simuler une base de données d'utilisateurs
    const storedUsers = localStorage.getItem('seneflix_users_db');
    const usersDb = storedUsers ? JSON.parse(storedUsers) : {};
    
    let finalName = name;
    
    if (name) {
      // Si on s'inscrit, on enregistre l'utilisateur
      usersDb[email] = name;
      localStorage.setItem('seneflix_users_db', JSON.stringify(usersDb));
    } else {
      // Si on se connecte sans nom, on cherche dans notre "base"
      finalName = usersDb[email] || email.split('@')[0];
    }

    const userData = {
      name: finalName,
      email: email
    };
    localStorage.setItem('seneflix_user', JSON.stringify(userData));
    setUser(userData);
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem('seneflix_user');
    setUser(null);
    setIsAuthenticated(false);
  };

  const updateUser = (name: string, email: string) => {
    if (user) {
      // Mettre à jour la "base de données" simulée
      const storedUsers = localStorage.getItem('seneflix_users_db');
      const usersDb = storedUsers ? JSON.parse(storedUsers) : {};
      
      // Si l'email a changé, on gère l'ancienne et la nouvelle entrée
      if (user.email !== email) {
        delete usersDb[user.email];
      }
      usersDb[email] = name;
      localStorage.setItem('seneflix_users_db', JSON.stringify(usersDb));

      // Mettre à jour l'utilisateur courant
      const updatedUser = { name, email };
      localStorage.setItem('seneflix_user', JSON.stringify(updatedUser));
      setUser(updatedUser);
    }
  };

  const updatePassword = (password: string) => {
    if (user) {
      // Simuler la mise à jour du mot de passe dans la base de données
      const storedPasswords = localStorage.getItem('seneflix_passwords_db');
      const passwordsDb = storedPasswords ? JSON.parse(storedPasswords) : {};
      passwordsDb[user.email] = password;
      localStorage.setItem('seneflix_passwords_db', JSON.stringify(passwordsDb));
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout, updateUser, updatePassword }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function ProtectedRoute({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      
      localStorage.setItem('redirect_after_login', window.location.pathname);
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}
