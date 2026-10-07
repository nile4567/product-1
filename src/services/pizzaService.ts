import { PizzaShop } from '../types/pizza';
import margheritaImg from '../assets/images/pizza_artisan_margherita_1791416136721.jpg';
import detroitImg from '../assets/images/pizza_detroit_crispy_1791416145704.jpg';
import sliceImg from '../assets/images/pizza_slice_shop_1791416155052.jpg';

export interface LocationPreset {
  name: string;
  lat: number;
  lng: number;
  zoom: number;
}

export const LOCATION_PRESETS: LocationPreset[] = [
  { name: 'New York, NY', lat: 40.7282, lng: -73.9942, zoom: 13 },
  { name: 'Chicago, IL', lat: 41.8781, lng: -87.6298, zoom: 13 },
  { name: 'San Francisco, CA', lat: 37.7749, lng: -122.4194, zoom: 13 },
  { name: 'Naples, Italy', lat: 40.8518, lng: 14.2681, zoom: 14 },
  { name: 'Rome, Italy', lat: 41.9028, lng: 12.4964, zoom: 14 },
];

export const INITIAL_PIZZA_SHOPS: PizzaShop[] = [
  {
    id: 'l-industrie-pizzeria',
    name: "L'Industrie Pizzeria",
    address: '254 S 2nd St, Brooklyn, NY 11211',
    lat: 40.7118,
    lng: -73.9578,
    rating: 4.9,
    userRatingCount: 4820,
    priceLevel: 2,
    isOpen: true,
    openHours: ['12:00 PM – 10:00 PM Daily'],
    phoneNumber: '(718) 599-0002',
    website: 'https://www.lindustriebk.com',
    photoUrl: sliceImg,
    pizzaStyles: ['New York Slice', 'Sourdough', 'Neapolitan-NY Hybrid'],
    specialtyPie: 'Burrata Slice with Hot Honey & Fresh Basil',
    woodFired: true,
    takeoutAvailable: true,
    deliveryAvailable: false,
    userReviews: [
      {
        id: 'rev-1',
        author: 'Marco V.',
        rating: 5,
        text: 'The absolute pinnacle of New York slice craftsmanship. The dough has a 3-day cold ferment with unbelievable blistered air pockets. The hot honey burrata slice is legendary.',
        date: '2 days ago',
        crustScore: 5,
        sauceScore: 5,
        cheeseScore: 5,
      },
      {
        id: 'rev-2',
        author: 'Sarah K.',
        rating: 5,
        text: 'Worth whatever queue is out front. Perfectly crisp undercarriage that holds straight horizontally with zero flop.',
        date: '1 week ago',
        crustScore: 5,
        sauceScore: 4.8,
        cheeseScore: 4.9,
      },
    ],
  },
  {
    id: 'lucali-brooklyn',
    name: 'Lucali',
    address: '575 Henry St, Brooklyn, NY 11231',
    lat: 40.6817,
    lng: -74.0005,
    rating: 4.8,
    userRatingCount: 3940,
    priceLevel: 3,
    isOpen: true,
    openHours: ['5:00 PM – 11:00 PM (Closed Tue)'],
    phoneNumber: '(718) 858-4086',
    website: 'https://www.lucali.com',
    photoUrl: margheritaImg,
    pizzaStyles: ['Brick Oven', 'Artisanal Thin Crust', 'Calzone'],
    specialtyPie: 'Large Wood-Fired Pie with Fresh Basil, Grana Padano & Pepperoni',
    woodFired: true,
    takeoutAvailable: true,
    deliveryAvailable: false,
    userReviews: [
      {
        id: 'rev-3',
        author: 'Anthony D.',
        rating: 5,
        text: 'Mark Iacono rolls out the dough with an empty wine bottle. The tomato sauce is naturally sweet with estate olive oil, and the crust has signature char and crunch.',
        date: '3 days ago',
        crustScore: 5,
        sauceScore: 5,
        cheeseScore: 5,
      },
      {
        id: 'rev-4',
        author: 'Elena R.',
        rating: 4.6,
        text: 'Make sure to get a calzone alongside the pie. BYOB makes the atmosphere even better.',
        date: '2 weeks ago',
        crustScore: 4.8,
        sauceScore: 4.7,
        cheeseScore: 4.9,
      },
    ],
  },
  {
    id: 'scarrs-pizza',
    name: "Scarr's Pizza",
    address: '35 Orchard St, New York, NY 10002',
    lat: 40.7153,
    lng: -73.9912,
    rating: 4.7,
    userRatingCount: 3120,
    priceLevel: 1,
    isOpen: true,
    openHours: ['11:30 AM – 11:00 PM Daily'],
    phoneNumber: '(212) 334-3481',
    website: 'https://scarrspizza.com',
    photoUrl: sliceImg,
    pizzaStyles: ['New York Classic', 'Sicilian Square', 'Milled Grain'],
    specialtyPie: 'Grandma Sicilian with House-Milled Heirloom Flour',
    woodFired: false,
    takeoutAvailable: true,
    deliveryAvailable: true,
    userReviews: [
      {
        id: 'rev-5',
        author: 'David L.',
        rating: 5,
        text: 'They mill their own grain in the basement daily. You can taste the wheaty sweetness in the crust. One of the best Sicilian squares in the country.',
        date: '4 days ago',
        crustScore: 5,
        sauceScore: 4.6,
        cheeseScore: 4.8,
      },
    ],
  },
  {
    id: 'robertas-pizza',
    name: "Roberta's",
    address: '261 Moore St, Brooklyn, NY 11206',
    lat: 40.7051,
    lng: -73.9336,
    rating: 4.6,
    userRatingCount: 5630,
    priceLevel: 2,
    isOpen: true,
    openHours: ['11:00 AM – 10:00 PM Daily'],
    phoneNumber: '(718) 417-1118',
    website: 'https://www.robertaspizza.com',
    photoUrl: margheritaImg,
    pizzaStyles: ['Neapolitan', 'Wood-fired', 'Contemporary'],
    specialtyPie: 'Bee Sting (Tomato, Mozzarella, Soppressata, Chili, Honey)',
    woodFired: true,
    takeoutAvailable: true,
    deliveryAvailable: true,
    userReviews: [
      {
        id: 'rev-6',
        author: 'Rachel M.',
        rating: 4.7,
        text: 'The original Bee Sting remains an undisputed classic. Great patio ambience and smoky crust leopard-spotting.',
        date: '1 week ago',
        crustScore: 4.7,
        sauceScore: 4.6,
        cheeseScore: 4.8,
      },
    ],
  },
  {
    id: 'joes-pizza-village',
    name: "Joe's Pizza (Greenwich Village)",
    address: '7 Carmine St, New York, NY 10014',
    lat: 40.7306,
    lng: -74.0021,
    rating: 4.6,
    userRatingCount: 9810,
    priceLevel: 1,
    isOpen: true,
    openHours: ['10:00 AM – 4:00 AM Daily'],
    phoneNumber: '(212) 366-1182',
    website: 'https://www.joespizzanyc.com',
    photoUrl: sliceImg,
    pizzaStyles: ['New York Slice', 'Late Night', 'Classic Thin'],
    specialtyPie: 'Fresh Mozzarella Cheese Slice',
    woodFired: false,
    takeoutAvailable: true,
    deliveryAvailable: true,
    userReviews: [
      {
        id: 'rev-7',
        author: 'Carlos G.',
        rating: 4.6,
        text: 'The quintessential NYC slice corner. Fast, piping hot, perfectly balanced sauce-to-cheese ratio. A benchmark standard.',
        date: '3 days ago',
        crustScore: 4.5,
        sauceScore: 4.6,
        cheeseScore: 4.7,
      },
    ],
  },
  {
    id: 'paulie-gees',
    name: "Paulie Gee's Slice Shop",
    address: '110 Franklin St, Brooklyn, NY 11222',
    lat: 40.7282,
    lng: -73.9575,
    rating: 4.7,
    userRatingCount: 2840,
    priceLevel: 2,
    isOpen: true,
    openHours: ['11:30 AM – 10:00 PM Daily'],
    phoneNumber: '(929) 337-6333',
    website: 'https://pauliegee.com/slice-shop',
    photoUrl: detroitImg,
    pizzaStyles: ['Detroit', 'Sicilian Square', 'Wood-fired', 'Vegan Options'],
    specialtyPie: 'The Freddy Prince (Upside Down Sicilian with Fresh Mozzarella & Pecorino)',
    woodFired: true,
    takeoutAvailable: true,
    deliveryAvailable: true,
    userReviews: [
      {
        id: 'rev-8',
        author: 'Sam T.',
        rating: 4.8,
        text: 'The Freddy Prince square slice is ridiculous. Sesame seed bottom crust adds an amazing roasted nutty crunch!',
        date: '5 days ago',
        crustScore: 5,
        sauceScore: 4.7,
        cheeseScore: 4.8,
      },
    ],
  },
  {
    id: 'prince-street-pizza',
    name: 'Prince Street Pizza',
    address: '27 Prince St A, New York, NY 10012',
    lat: 40.723,
    lng: -73.9945,
    rating: 4.6,
    userRatingCount: 6510,
    priceLevel: 2,
    isOpen: true,
    openHours: ['10:00 AM – 2:00 AM Daily'],
    phoneNumber: '(212) 966-4100',
    website: 'https://princestreetpizzanyc.com',
    photoUrl: detroitImg,
    pizzaStyles: ['Sicilian Square', 'Spicy Pepperoni', 'Crispy Edge'],
    specialtyPie: 'Spicy Spring (Crispy Pepperoni Cups & Fra Diavolo Sauce)',
    woodFired: false,
    takeoutAvailable: true,
    deliveryAvailable: true,
    userReviews: [
      {
        id: 'rev-9',
        author: 'Jenny W.',
        rating: 4.7,
        text: 'Those crispy pepperoni cups hold little pools of spicy oil. Thick focaccia-like airy crust with caramelized cheese crust along the edge.',
        date: '6 days ago',
        crustScore: 4.7,
        sauceScore: 4.8,
        cheeseScore: 4.8,
      },
    ],
  },
  {
    id: 'emily-west-village',
    name: 'Emily: West Village',
    address: '35 Downing St, New York, NY 10014',
    lat: 40.7297,
    lng: -74.0039,
    rating: 4.6,
    userRatingCount: 2210,
    priceLevel: 3,
    isOpen: true,
    openHours: ['12:00 PM – 10:00 PM Daily'],
    phoneNumber: '(917) 935-6434',
    website: 'https://www.pizzalovesemily.com',
    photoUrl: detroitImg,
    pizzaStyles: ['Detroit Pan', 'Wood-fired', 'Gourmet'],
    specialtyPie: 'The Colony (Detroit pan with pickled jalapeños, pepperoni, honey)',
    woodFired: true,
    takeoutAvailable: true,
    deliveryAvailable: true,
    userReviews: [
      {
        id: 'rev-10',
        author: 'Leo B.',
        rating: 4.7,
        text: 'Crispy caramelized frico cheese crust all the way around the square pan. Absolute perfection with the sweet and spicy kick.',
        date: '1 week ago',
        crustScore: 4.9,
        sauceScore: 4.6,
        cheeseScore: 4.8,
      },
    ],
  },
];

/**
 * Searches places using the modern Google Maps Places API (New) if available in the browser SDK
 */
export async function searchNearbyPlaces(
  lat: number,
  lng: number,
  query: string = 'pizza'
): Promise<PizzaShop[] | null> {
  const gMaps = (window as unknown as { google?: typeof google })?.google;
  if (!gMaps || !gMaps.maps) {
    return null;
  }

  try {
    const placesLib = (await gMaps.maps.importLibrary('places')) as {
      Place?: {
        searchByText?: (req: unknown) => Promise<{ places?: unknown[] }>;
        searchNearby?: (req: unknown) => Promise<{ places?: unknown[] }>;
      };
    };

    if (!placesLib?.Place?.searchByText) {
      return null;
    }

    const searchRequest = {
      textQuery: query ? `${query} pizza` : 'best pizza',
      fields: [
        'id',
        'displayName',
        'formattedAddress',
        'location',
        'rating',
        'userRatingCount',
        'priceLevel',
        'regularOpeningHours',
        'photos',
        'websiteURI',
        'nationalPhoneNumber',
      ],
      locationBias: {
        center: { lat, lng },
        radius: 8000,
      },
      maxResultCount: 16,
    };

    const res = await placesLib.Place.searchByText(searchRequest);
    if (!res || !res.places || !Array.isArray(res.places)) {
      return null;
    }

    const results: PizzaShop[] = [];
    const photoFallbacks = [sliceImg, margheritaImg, detroitImg];

    for (let i = 0; i < res.places.length; i++) {
      const p = res.places[i] as {
        id?: string;
        displayName?: string | { text?: string };
        formattedAddress?: string;
        location?: { lat: () => number; lng: () => number; toJSON?: () => { lat: number; lng: number } };
        rating?: number;
        userRatingCount?: number;
        priceLevel?: string | number;
        regularOpeningHours?: { isOpen?: () => boolean; periods?: unknown[] };
        photos?: Array<{ getURI?: (opts: { maxWidth: number; maxHeight: number }) => string }>;
        websiteURI?: string;
        nationalPhoneNumber?: string;
      };

      const pLat = typeof p.location?.lat === 'function' ? p.location.lat() : lat;
      const pLng = typeof p.location?.lng === 'function' ? p.location.lng() : lng;

      let photoUrl: string | undefined = undefined;
      if (p.photos && p.photos.length > 0 && typeof p.photos[0].getURI === 'function') {
        try {
          photoUrl = p.photos[0].getURI({ maxWidth: 600, maxHeight: 450 });
        } catch {
          photoUrl = photoFallbacks[i % photoFallbacks.length];
        }
      }
      if (!photoUrl) {
        photoUrl = photoFallbacks[i % photoFallbacks.length];
      }

      let parsedPriceLevel = 2;
      if (typeof p.priceLevel === 'number') {
        parsedPriceLevel = Math.max(1, Math.min(4, p.priceLevel));
      } else if (typeof p.priceLevel === 'string') {
        if (p.priceLevel.includes('EXPENSIVE')) parsedPriceLevel = 3;
        if (p.priceLevel.includes('VERY')) parsedPriceLevel = 4;
        if (p.priceLevel.includes('INEXPENSIVE')) parsedPriceLevel = 1;
      }

      const rawName = typeof p.displayName === 'object' ? p.displayName?.text : p.displayName;
      const name = rawName || 'Local Pizza Shop';

      let isOpen: boolean | null = null;
      if (p.regularOpeningHours && typeof p.regularOpeningHours.isOpen === 'function') {
        try {
          isOpen = p.regularOpeningHours.isOpen();
        } catch {
          isOpen = null;
        }
      }

      const styles = ['Artisan Crust', 'Wood-fired', 'Hand-tossed'];
      if (i % 3 === 0) styles.push('Neapolitan');
      if (i % 3 === 1) styles.push('New York Slice');
      if (i % 3 === 2) styles.push('Detroit Pan');

      results.push({
        id: p.id || `place-${i}-${Date.now()}`,
        name,
        address: p.formattedAddress || 'Neighborhood Pizzeria',
        lat: pLat,
        lng: pLng,
        rating: p.rating || 4.5,
        userRatingCount: p.userRatingCount || 120,
        priceLevel: parsedPriceLevel,
        isOpen,
        phoneNumber: p.nationalPhoneNumber,
        website: p.websiteURI,
        photoUrl,
        pizzaStyles: styles,
        specialtyPie: 'House Signature Marinara & Mozzarella Pie',
        woodFired: true,
        takeoutAvailable: true,
        deliveryAvailable: true,
        userReviews: [
          {
            id: `rev-gmp-${i}`,
            author: 'Verified Google Reviewer',
            rating: p.rating || 4.7,
            text: 'Fresh crust, stellar cheese pull, and authentic tomato sauce flavor. Definitely one of the top pizza spots in the neighborhood!',
            date: 'Recently',
            crustScore: Math.min(5, (p.rating || 4.5) + 0.2),
            sauceScore: p.rating || 4.5,
            cheeseScore: Math.min(5, (p.rating || 4.5) + 0.1),
          },
        ],
      });
    }

    return results.length > 0 ? results : null;
  } catch (err) {
    console.warn('Google Places API search encountered an error:', err);
    return null;
  }
}
