import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Mail, Lock, ArrowRight, Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { UserService } from '../services/UserService';

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const message = (location.state as any)?.message;

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const user = UserService.login(email, password);
    if (user) {
      login(user);
      navigate('/dashboard');
    } else {
      setError('Email ou mot de passe invalide');
    }
  };

  return (
    <div className="flex-grow flex">
      <div className="w-full lg:w-1/2 flex items-center justify-center p-4 sm:p-8">
        <div className="w-full max-w-md bg-dark-800 rounded-2xl p-6 sm:p-8 border border-dark-700 shadow-xl">
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold mb-2">Bon Retour</h1>
          <p className="text-sm sm:text-base text-gray-400">Connectez-vous à votre compte pour gérer vos réservations</p>
        </div>

        <form className="space-y-5" onSubmit={handleAuth}>
          {message && (
            <div className="bg-green-500/10 border border-green-500/50 text-green-500 text-sm p-3 rounded-lg text-center">
              {message}
            </div>
          )}
          {error && (
            <div className="bg-red-500/10 border border-red-500/50 text-red-500 text-sm p-3 rounded-lg text-center">
              {error}
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5" htmlFor="email">Email</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-gray-400" />
              </div>
              <input 
                type="email" 
                id="email" 
                className="w-full bg-dark-900 border border-dark-700 rounded-lg py-2.5 pl-10 pr-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-sm font-medium text-gray-300" htmlFor="password">Mot de passe</label>
              <Link to="/reset-password" className="text-sm font-medium text-brand-500 hover:text-brand-400">
                Mot de passe oublié ?
              </Link>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <input 
                type={showPassword ? "text" : "password"} 
                id="password" 
                className="w-full bg-dark-900 border border-dark-700 rounded-lg py-2.5 pl-10 pr-10 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-200 transition-colors"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>

          <button 
            type="submit" 
            className="w-full bg-brand-500 hover:bg-brand-600 text-white font-medium py-2.5 rounded-lg flex items-center justify-center gap-2 transition-all group"
          >
            Se Connecter
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-gray-400">
          Vous n'avez pas de compte ?{' '}
          <Link to="/register" className="text-brand-500 hover:text-brand-400 font-medium tracking-wide">
            Inscrivez-vous maintenant
          </Link>
        </p>
      </div>
      </div>
      
      <div className="hidden lg:block lg:w-1/2 relative bg-dark-900 border-l border-dark-700">
        <img 
          src="https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&q=80&w=2070" 
          alt="Cinema experience" 
          className="w-full h-full object-cover opacity-80 grayscale-[20%]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-dark-900 via-dark-900/40 to-transparent"></div>
        <div className="absolute bottom-12 left-12 right-12 text-white">
          <h2 className="text-4xl font-bold mb-4">Votre Voyage Cinématographique</h2>
          <p className="text-xl text-gray-300">Vivez le cinéma comme jamais auparavant avec des sièges et un son de qualité premium.</p>
        </div>
      </div>
    </div>
  );
}
