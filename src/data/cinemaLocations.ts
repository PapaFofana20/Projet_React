// Données des salles de cinéma SENEFLIX à Dakar avec leurs coordonnées GPS
export interface CinemaLocation {
  id: string;
  name: string;
  address: string;
  city: string;
  lat: number;
  lng: number;
  phone: string;
  hours: string;
  // Style visuel de la carte pour ce cinéma
  mapStyle: 'dark' | 'satellite' | 'streets';
  // Couleur du marqueur
  markerColor: string;
}

export const cinemas: CinemaLocation[] = [
  {
    id: 'pathe-meridien',
    name: 'Pathé Meridien',
    address: 'Route de la Mer Rouge, Foire',
    city: 'Dakar - Foire',
    lat: 14.6895,
    lng: -17.4671,
    phone: '+221 33 869 00 00',
    hours: '10h00 - 00h00',
    mapStyle: 'streets',
    markerColor: '#dc2626',
  },
  {
    id: 'pathe-mbour',
    name: 'Pathé Mbour',
    address: 'Centre commercial Mbour Plage',
    city: 'Mbour',
    lat: 14.4167,
    lng: -16.9667,
    phone: '+221 33 869 00 01',
    hours: '10h00 - 23h00',
    mapStyle: 'streets',
    markerColor: '#ef4444',
  },
  {
    id: 'canal-plus-plateaux',
    name: 'Canal+ Cinémas Plateaux',
    address: 'Avenue Cheikh Anta Diop, UCAD',
    city: 'Dakar - Fann Hock',
    lat: 14.6920,
    lng: -17.4467,
    phone: '+221 33 889 00 00',
    hours: '09h00 - 23h30',
    mapStyle: 'dark',
    markerColor: '#f59e0b',
  },
  {
    id: 'canal-plus-liberté',
    name: 'Canal+ Liberté 6',
    address: 'Carrefour Liberté 6, Sicap',
    city: 'Dakar - Liberté 6',
    lat: 14.7083,
    lng: -17.4500,
    phone: '+221 33 889 00 01',
    hours: '10h00 - 22h30',
    mapStyle: 'streets',
    markerColor: '#eab308',
  },
  {
    id: 'imax-dakar',
    name: 'IMAX Dakar',
    address: 'Corniche Ouest, Amitié 2',
    city: 'Dakar - Corniche',
    lat: 14.6856,
    lng: -17.4244,
    phone: '+221 33 820 00 00',
    hours: '10h00 - 00h00',
    mapStyle: 'satellite',
    markerColor: '#8b5cf6',
  },
  {
    id: 'ciné-kaolack',
    name: 'Ciné Kaolack',
    address: 'Avenue Léopold Sédar Senghor',
    city: 'Kaolack',
    lat: 14.1850,
    lng: -16.0753,
    phone: '+221 33 940 00 00',
    hours: '11h00 - 22h00',
    mapStyle: 'streets',
    markerColor: '#10b981',
  },
  {
    id: 'sénégal-cinema-thiaroye',
    name: 'Sénégal Ciné Thiaroye',
    address: 'Route de Tivaouane, Thiaroye',
    city: 'Dakar - Thiaroye',
    lat: 14.7833,
    lng: -17.4000,
    phone: '+221 33 850 00 00',
    hours: '10h00 - 21h30',
    mapStyle: 'streets',
    markerColor: '#06b6d4',
  },
  {
    id: 'le-grande-cinéma',
    name: 'Le Grand Cinéma',
    address: 'Centre commercial Sea Plaza, Rufisque',
    city: 'Rufisque',
    lat: 14.6333,
    lng: -17.2667,
    phone: '+221 33 876 00 00',
    hours: '10h00 - 22h00',
    mapStyle: 'streets',
    markerColor: '#ec4899',
  },
];

// Mapper les films aux salles (simulation de salles assignées)
export const filmCinemaAssignments: { [filmId: number]: string } = {
  // Films populaires - variés entre les cinémas
  28: 'pathe-meridien', // Michael - Pathé Meridien (exclusivité)
  3: 'pathe-meridien', // Deadpool & Wolverine - Pathé
  21: 'imax-dakar', // Sinners - IMAX (effets spéciaux)
  19: 'pathe-mbour', // Superman - Pathé Mbour
  18: 'canal-plus-plateaux', // Zootopie 2 - Canal+ (familial)
  4: 'pathe-meridien', // Wicked - Pathé
  23: 'imax-dakar', // 4 Fantastiques - IMAX
  16: 'pathe-meridien', // Mission Impossible - Pathé (action)
  1: 'canal-plus-plateaux', // Gladiator II - Canal+
  20: 'canal-plus-liberté', // Captain America - Canal+ Liberté
  17: 'ciné-kaolack', // Kaamelott - Ciné Kaolack (région)
  22: 'sénégal-cinema-thiaroye', // Joker: Folie à Deux - Thiaroye
  25: 'imax-dakar', // Furiosa - IMAX
  26: 'canal-plus-plateaux', // Vaiana 2 - Canal+ (animation)
  27: 'canal-plus-liberté', // Afterburn - Canal+
  29: 'le-grande-cinéma', // Shelter - Rufisque
  30: 'pathe-mbour', // WHO - Pathé Mbour
  31: 'pathe-meridien', // Spider Man - Pathé (super-héros)
};

// Obtenir le cinéma pour un film
export const getCinemaForFilm = (filmId: number): CinemaLocation => {
  const cinemaId = filmCinemaAssignments[filmId];
  return cinemas.find(c => c.id === cinemaId) || cinemas[0];
};

// Obtenir tous les cinémas
export const getAllCinemas = (): CinemaLocation[] => cinemas;
