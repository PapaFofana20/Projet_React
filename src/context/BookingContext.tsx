import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

export interface Booking {
  id: string;
  userEmail: string;
  movieId: number;
  movieTitle: string;
  moviePoster: string;
  date: string;
  time: string;
  cinema: string;
  seats: string[];
  totalPrice: number;
  status: 'upcoming' | 'past';
  createdAt: string;
}

interface BookingContextType {
  bookings: Booking[];
  addBooking: (booking: Omit<Booking, 'id' | 'createdAt'>) => void;
  removeBooking: (id: string) => void;
  getBooking: (id: string) => Booking | undefined;
}

const BookingContext = createContext<BookingContextType | undefined>(undefined);

export function BookingProvider({ children }: { children: ReactNode }) {
  const [bookings, setBookings] = useState<Booking[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('seneflix_bookings');
    if (saved) {
      try {
        setBookings(JSON.parse(saved));
      } catch {
        setBookings([]);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('seneflix_bookings', JSON.stringify(bookings));
  }, [bookings]);

  const addBooking = (booking: Omit<Booking, 'id' | 'createdAt'>) => {
    const newBooking: Booking = {
      ...booking,
      id: `B-${Date.now().toString().slice(-5)}`,
      createdAt: new Date().toISOString(),
    };
    setBookings(prev => [newBooking, ...prev]);
  };

  const removeBooking = (id: string) => {
    setBookings(prev => prev.filter(b => b.id !== id));
  };

  const getBooking = (id: string) => {
    return bookings.find(b => b.id === id);
  };

  return (
    <BookingContext.Provider value={{ bookings, addBooking, removeBooking, getBooking }}>
      {children}
    </BookingContext.Provider>
  );
}

export function useBookings() {
  const context = useContext(BookingContext);
  if (!context) {
    throw new Error('useBookings must be used within a BookingProvider');
  }
  return context;
}