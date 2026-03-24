import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, ArrowRight, Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';
import { UserService } from '../services/UserService';

export default function RegisterPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.name || !formData.email || !formData.password) {
      setError('Veuillez remplir tous les champs');
      return;
    }

    const newUser = UserService.register({
      name: formData.name,
      email: formData.email,
      password: formData.password
    });

    if (newUser) {
      navigate('/login', { state: { message: 'Compte créé ! Veuillez vous connecter.' } });
    } else {
      setError('Cet email existe déjà');
    }
  };

  return (
    <div className="flex-grow flex">
      <div className="w-full lg:w-1/2 flex items-center justify-center p-4 sm:p-8">
        <div className="w-full max-w-md bg-dark-800 rounded-2xl p-8 border border-dark-700 shadow-xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Créer un Compte</h1>
          <p className="text-gray-400">Rejoignez-nous pour réserver des billets et gérer vos réservations</p>
        </div>

        <form className="space-y-5" onSubmit={handleAuth}>
          {error && (
            <div className="bg-red-500/10 border border-red-500/50 text-red-500 text-sm p-3 rounded-lg">
              {error}
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5" htmlFor="name">Nom Complet</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-gray-500" />
              </div>
              <input 
                type="text" 
                id="name" 
                className="w-full bg-dark-900 border border-dark-700 rounded-lg py-2.5 pl-10 pr-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all"
                placeholder="Nom"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5" htmlFor="email">Email</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-gray-500" />
              </div>
              <input 
                type="email" 
                id="email" 
                className="w-full bg-dark-900 border border-dark-700 rounded-lg py-2.5 pl-10 pr-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all"
                placeholder="you@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5" htmlFor="password">Mot de passe</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-500" />
              </div>
              <input 
                type={showPassword ? "text" : "password"} 
                id="password" 
                className="w-full bg-dark-900 border border-dark-700 rounded-lg py-2.5 pl-10 pr-10 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
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
            Créer un Compte
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-gray-400">
          Vous avez déjà un compte ?{' '}
          <Link to="/login" className="text-brand-500 hover:text-brand-400 font-medium tracking-wide">
            Se connecter
          </Link>
        </p>
      </div>
      </div>
      
      <div className="hidden lg:block lg:w-1/2 relative bg-dark-900 border-l border-dark-700">
        <img 
          src="https://images.unsplash.com/photo-1440404653325-ab127d49abc1?auto=format&fit=crop&q=80&w=2070" 
          alt="Cinema experience" 
          className="w-full h-full object-cover opacity-80 grayscale-[20%]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-dark-900 via-dark-900/40 to-transparent"></div>
        <div className="absolute bottom-12 left-12 right-12 text-white">
          <h2 className="text-4xl font-bold mb-4">Rejoignez le Club</h2>
          <p className="text-xl text-gray-300">Débloquez des avantages exclusifs, un accès anticipé aux billets et des événements cinématographiques spéciaux.</p>
        </div>
      </div>
    </div>
  );
}
