import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, Send } from 'lucide-react';

export default function ResetPassword() {
  return (
    <div className="flex-grow flex">
      <div className="w-full lg:w-1/2 flex items-center justify-center p-4 sm:p-8">
        <div className="w-full max-w-md bg-dark-800 rounded-2xl p-8 border border-dark-700 shadow-xl">
        <div className="mb-6">
          <Link to="/login" className="inline-flex items-center text-sm text-gray-400 hover:text-white transition-colors">
            <ArrowLeft className="w-4 h-4 mr-1" />
            Retour à la connexion
          </Link>
        </div>
        
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Réinitialiser le mot de passe</h1>
          <p className="text-gray-400">Entrez votre email et nous vous enverrons un lien pour réinitialiser votre mot de passe</p>
        </div>

        <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
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
                placeholder="vous@exemple.com"
              />
            </div>
          </div>

          <button 
            type="submit" 
            className="w-full bg-brand-500 hover:bg-brand-600 text-white font-medium py-2.5 rounded-lg flex items-center justify-center gap-2 transition-all group"
          >
            Envoyer le lien de réinitialisation
            <Send className="w-4 h-4 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </form>
      </div>
      </div>
      
      <div className="hidden lg:block lg:w-1/2 relative bg-dark-900 border-l border-dark-700">
        <img 
          src="https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&q=80&w=2070" 
          alt="Expérience cinéma" 
          className="w-full h-full object-cover opacity-80 grayscale-[20%]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-dark-900 via-dark-900/40 to-transparent"></div>
        <div className="absolute bottom-12 left-12 right-12 text-white">
          <h2 className="text-4xl font-bold mb-4">Sécurisez Votre Compte</h2>
          <p className="text-xl text-gray-300">Regagnez l'accès à vos réservations et à vos prochaines expériences cinématographiques.</p>
        </div>
      </div>
    </div>
  );
}
