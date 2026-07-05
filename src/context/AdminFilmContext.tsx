import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

// Types pour les films
export interface Film {
  id: number;
  title: string;
  image: string;
  poster: string;
  rating: number;
  duration: string;
  genre: string;
  director: string;
  description: string;
  isNew: boolean;
  isExclusive: boolean;
  cinema: string;
  price: number;
  createdAt: string;
}

interface AdminFilmContextType {
  films: Film[];
  addFilm: (film: Omit<Film, 'id' | 'createdAt'>) => void;
  updateFilm: (id: number, film: Partial<Film>) => void;
  deleteFilm: (id: number) => void;
  getFilm: (id: number) => Film | undefined;
}

const AdminFilmContext = createContext<AdminFilmContextType | undefined>(undefined);

// Données initiales pour l'admin
const initialFilms: Film[] = [
  {
    id: 1,
    title: "Gladiator II",
    image: "https://image.tmdb.org/t/p/w1280/2cxhvwyEwRlysAmRH4iodkvo0z5.jpg",
    poster: "https://image.tmdb.org/t/p/w500/2cxhvwyEwRlysAmRH4iodkvo0z5.jpg",
    rating: 6.5,
    duration: "2h 28m",
    genre: "Action / Drame / Historique",
    director: "Ridley Scott",
    description: "Des années après avoir assisté à la mort du héros vénéré Maximus, Lucius est forcé d'entrer dans le Colisée pour affronter les empereurs tyranniques qui dirigent Rome.",
    isNew: true,
    isExclusive: true,
    cinema: "SENEFLIX Abidjan",
    price: 3500,
    createdAt: new Date().toISOString()
  },
  {
    id: 2,
    title: "Deadpool & Wolverine",
    image: "https://image.tmdb.org/t/p/w1280/8cdWjvZQUExUUTzyp4t6EDMubfO.jpg",
    poster: "https://image.tmdb.org/t/p/w500/8cdWjvZQUExUUTzyp4t6EDMubfO.jpg",
    rating: 7.6,
    duration: "2h 7m",
    genre: "Action / Comédie / Science-Fiction",
    director: "Shawn Levy",
    description: "L'existence paisible de Deadpool s'effondre lorsque la Time Variance Authority le recrute pour aider à sauvegarder l'intégrité du multivers.",
    isNew: true,
    isExclusive: true,
    cinema: "SENEFLIX Abidjan",
    price: 4000,
    createdAt: new Date().toISOString()
  },
  {
    id: 3,
    title: "Wicked",
    image: "https://image.tmdb.org/t/p/w1280/xDGbZ0JJ3mYaGKy4Nzd9Kph6M9L.jpg",
    poster: "https://image.tmdb.org/t/p/w500/xDGbZ0JJ3mYaGKy4Nzd9Kph6M9L.jpg",
    rating: 7.4,
    duration: "2h 40m",
    genre: "Fantastique / Musical",
    director: "Jon M. Chu",
    description: "L'extraordinaire sorcière de l'Ouest et Glinda la Bonne occupent le devant de la scène.",
    isNew: true,
    isExclusive: false,
    cinema: "SENEFLIX Abidjan",
    price: 3500,
    createdAt: new Date().toISOString()
  }
];

export function AdminFilmProvider({ children }: { children: ReactNode }) {
  const [films, setFilms] = useState<Film[]>(() => {
    const saved = localStorage.getItem('seneflix_admin_films');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return initialFilms;
      }
    }
    return initialFilms;
  });

  useEffect(() => {
    localStorage.setItem('seneflix_admin_films', JSON.stringify(films));
  }, [films]);

  const addFilm = (film: Omit<Film, 'id' | 'createdAt'>) => {
    const newFilm: Film = {
      ...film,
      id: Date.now(),
      createdAt: new Date().toISOString()
    };
    setFilms(prev => [newFilm, ...prev]);
  };

  const updateFilm = (id: number, updates: Partial<Film>) => {
    setFilms(prev => prev.map(f => f.id === id ? { ...f, ...updates } : f));
  };

  const deleteFilm = (id: number) => {
    setFilms(prev => prev.filter(f => f.id !== id));
  };

  const getFilm = (id: number) => {
    return films.find(f => f.id === id);
  };

  return (
    <AdminFilmContext.Provider value={{ films, addFilm, updateFilm, deleteFilm, getFilm }}>
      {children}
    </AdminFilmContext.Provider>
  );
}

export function useAdminFilms() {
  const context = useContext(AdminFilmContext);
  if (!context) {
    throw new Error('useAdminFilms must be used within an AdminFilmProvider');
  }
  return context;
}
