import { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Upload, Image as ImageIcon } from 'lucide-react';
import { type Film } from '../../context/AdminFilmContext';

interface FilmModalProps {
  film?: Film | null;
  onClose: () => void;
  onSave: (data: Omit<Film, 'id' | 'createdAt'>) => void;
}

export default function FilmModal({ film, onClose, onSave }: FilmModalProps) {
  const [formData, setFormData] = useState({
    title: film?.title || '',
    poster: film?.poster || '',
    image: film?.image || '',
    rating: film?.rating || 0,
    duration: film?.duration || '',
    genre: film?.genre || '',
    director: film?.director || '',
    description: film?.description || '',
    isNew: film?.isNew || false,
    isExclusive: film?.isExclusive || false,
    cinema: film?.cinema || 'SENEFLIX Abidjan',
    price: film?.price || 3000,
  });

  const [imageUrl, setImageUrl] = useState(film?.poster || '');

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setImageUrl(url);
      setFormData({ ...formData, poster: url, image: url });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-dark-800 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-dark-700"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 border-b border-dark-700 flex items-center justify-between sticky top-0 bg-dark-800 z-10">
          <h2 className="text-xl font-bold text-white">
            {film ? 'Modifier le Film' : 'Ajouter un Nouveau Film'}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-dark-700 rounded-lg transition-colors">
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Image Upload */}
          <div className="flex flex-col items-center">
            <div className="relative w-40 h-56 bg-dark-900 rounded-xl border-2 border-dashed border-dark-600 overflow-hidden">
              {imageUrl ? (
                <img src={imageUrl} alt="Preview" className="w-full h-full object-cover" />
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-gray-500">
                  <ImageIcon className="w-12 h-12 mb-2" />
                  <span className="text-xs">Poster du film</span>
                </div>
              )}
            </div>
            <label className="mt-4 cursor-pointer">
              <input 
                type="file" 
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
              <span className="flex items-center gap-2 bg-dark-700 hover:bg-dark-600 text-white px-4 py-2 rounded-lg transition-colors">
                <Upload className="w-4 h-4" />
                Télécharger l'image
              </span>
            </label>
          </div>

          {/* Image URL */}
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Ou URL de l'image
            </label>
            <input
              type="url"
              value={formData.poster}
              onChange={(e) => {
                setFormData({ ...formData, poster: e.target.value, image: e.target.value });
                setImageUrl(e.target.value);
              }}
              placeholder="https://exemple.com/image.jpg"
              className="w-full bg-dark-900 border border-dark-700 rounded-lg py-3 px-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>

          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Titre du film *
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Ex: Spider Man: Brand New Day"
              className="w-full bg-dark-900 border border-dark-700 rounded-lg py-3 px-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>

          {/* Duration & Rating */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Durée *
              </label>
              <input
                type="text"
                required
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                placeholder="Ex: 2h 30m"
                className="w-full bg-dark-900 border border-dark-700 rounded-lg py-3 px-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Note (0-10)
              </label>
              <input
                type="number"
                min="0"
                max="10"
                step="0.1"
                value={formData.rating}
                onChange={(e) => setFormData({ ...formData, rating: parseFloat(e.target.value) })}
                className="w-full bg-dark-900 border border-dark-700 rounded-lg py-3 px-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>
          </div>

          {/* Genre */}
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Catégorie *
            </label>
            <input
              type="text"
              required
              value={formData.genre}
              onChange={(e) => setFormData({ ...formData, genre: e.target.value })}
              placeholder="Ex: Action / Aventure / Science-Fiction"
              className="w-full bg-dark-900 border border-dark-700 rounded-lg py-3 px-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>

          {/* Director */}
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Réalisateur
            </label>
            <input
              type="text"
              value={formData.director}
              onChange={(e) => setFormData({ ...formData, director: e.target.value })}
              placeholder="Ex: Destin Daniel Cretton"
              className="w-full bg-dark-900 border border-dark-700 rounded-lg py-3 px-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>

          {/* Cinema */}
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Cinéma *
            </label>
            <input
              type="text"
              required
              value={formData.cinema}
              onChange={(e) => setFormData({ ...formData, cinema: e.target.value })}
              placeholder="Ex: SENEFLIX Abidjan"
              className="w-full bg-dark-900 border border-dark-700 rounded-lg py-3 px-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>

          {/* Price */}
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Prix du billet (FCFA) *
            </label>
            <input
              type="number"
              required
              min="0"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: parseInt(e.target.value) })}
              placeholder="Ex: 3500"
              className="w-full bg-dark-900 border border-dark-700 rounded-lg py-3 px-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Description *
            </label>
            <textarea
              required
              rows={4}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Entrez la description du film..."
              className="w-full bg-dark-900 border border-dark-700 rounded-lg py-3 px-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500 resize-none"
            />
          </div>

          {/* Badges */}
          <div className="flex flex-col sm:flex-row gap-4">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.isNew}
                onChange={(e) => setFormData({ ...formData, isNew: e.target.checked })}
                className="w-5 h-5 rounded bg-dark-900 border-dark-700 text-red-500 focus:ring-red-500"
              />
              <span className="text-white">NOUVEAU</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.isExclusive}
                onChange={(e) => setFormData({ ...formData, isExclusive: e.target.checked })}
                className="w-5 h-5 rounded bg-dark-900 border-dark-700 text-red-500 focus:ring-red-500"
              />
              <span className="text-white">EXCLUSIF</span>
            </label>
          </div>

          {/* Actions */}
          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-dark-700 hover:bg-dark-600 text-white font-medium py-3 rounded-xl transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="flex-1 bg-red-600 hover:bg-red-700 text-white font-medium py-3 rounded-xl transition-colors"
            >
              {film ? 'Enregistrer' : 'Ajouter le Film'}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}
