export interface TourReview {
  id: string;
  travelerName: string;
  travelerAvatar: string;
  rating: number;
  date: string;
  comment: string;
  highlight: string;
}

export interface TourItineraryItem {
  day: string;
  title: string;
  description: string;
  image: string;
}

export interface Tour {
  id: string;
  slug: string;
  title: string;
  destination: string;
  country: string;
  regionId?: string;
  provinceId?: string;
  duration: string;
  groupSize: string;
  priceFrom: number;
  reviewCount?: number;
  heroImage: string;
  heroImageAlt: string;
  gallery: string[];
  quickSummary: string[];
  highlights: string[];
  overview: string;
  itinerary: TourItineraryItem[];
  included: string[];
  excluded: string[];
  cancellationPolicy: string;
  operator: {
    name: string;
    avatar: string;
    tourCount: number;
    responseTime: string;
    founded: string;
    certifications: string[];
    rating?: number;
  };
  reviews: TourReview[];
  tags: string[];
}

export const tours: Tour[] = [
  {
    id: 'paris-art-gastronomy',
    slug: 'paris-art-gastronomy',
    title: 'Paris Art & Gastronomy Retreat',
    destination: 'Paris',
    country: 'France',
    duration: '5 days',
    groupSize: 'Max 10 guests',
    priceFrom: 1899,
    reviewCount: 216,
    heroImage:
      'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1600&q=80',
    heroImageAlt: 'Twilight view of the Eiffel Tower and Paris cityscape',
    gallery: [
      'https://images.unsplash.com/photo-1524169358666-79f22534bc6e?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1499428665502-503f6c608263?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1431274172761-fca41d930114?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1504754524776-8f4f37790ca0?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1466978913421-dad2ebd01d17?auto=format&fit=crop&w=1200&q=80',
    ],
    quickSummary: [
      'Michelin-star dining experiences',
      'Private Louvre evening tour',
      'Seine river cruise at sunset',
    ],
    highlights: [
      'Private pastry-making workshop in Le Marais',
      'Skip-the-line access to Musée d’Orsay with art historian',
      'Champagne tasting in a 17th-century wine cellar',
      'Day trip to Giverny with exclusive access to Monet’s gardens',
    ],
    overview:
      'Immerse yourself in the heart of Parisian art and gastronomy on this curated five-day experience. From private museum access to Michelin-starred meals, you will discover Paris through the eyes of local experts, artisan chefs, and art historians.',
    itinerary: [
      {
        day: 'Day 1',
        title: 'Arrival & Le Marais Discovery',
        description:
          'Welcome reception at a boutique hotel in Le Marais, followed by a guided walking tour and welcome dinner at a Michelin-starred bistro.',
        image:
          'https://images.unsplash.com/photo-1505761671935-60b3a7427bad?auto=format&fit=crop&w=1200&q=80',
      },
      {
        day: 'Day 2',
        title: 'Private Louvre & Culinary Workshop',
        description:
          'Exclusive morning access to the Louvre with an art historian, followed by a hands-on pastry workshop with a Meilleur Ouvrier de France chef.',
        image:
          'https://images.unsplash.com/photo-1511732351157-1865efcb7b7b?auto=format&fit=crop&w=1200&q=80',
      },
      {
        day: 'Day 3',
        title: 'Champagne & Seine Cruise',
        description:
          'Champagne tasting experience in Saint-Germain-des-Prés and a sunset cruise on the Seine with live jazz.',
        image:
          'https://images.unsplash.com/photo-1505761671935-60b3a7427bad?auto=format&fit=crop&w=1200&q=80',
      },
      {
        day: 'Day 4',
        title: 'Giverny & Impressionist Gardens',
        description:
          'Day trip to Giverny for an exclusive tour of Monet’s home and gardens, with lunch at a countryside auberge.',
        image:
          'https://images.unsplash.com/photo-1523987355523-c7b5b84b847b?auto=format&fit=crop&w=1200&q=80',
      },
      {
        day: 'Day 5',
        title: 'Artisanal Market & Farewell',
        description:
          'Morning visit to a local market with a chef, finishing with a farewell brunch featuring seasonal Parisian delicacies.',
        image:
          'https://images.unsplash.com/photo-1466978913421-dad2ebd01d17?auto=format&fit=crop&w=1200&q=80',
      },
    ],
    included: [
      '5 nights at 5-star boutique hotel in Le Marais',
      'Daily breakfast and curated dining experiences',
      'Private tours with certified guides',
      'All ground transportation during the tour',
      '24/7 concierge support',
    ],
    excluded: [
      'International flights',
      'Personal travel insurance',
      'Meals not mentioned in the itinerary',
      'Personal expenses and gratuities',
    ],
    cancellationPolicy:
      'Free cancellation up to 30 days before departure. 50% refund up to 14 days before departure. Non-refundable within 14 days of departure.',
    operator: {
      name: 'Atelier Voyages',
      avatar:
        'https://images.unsplash.com/photo-1544723795-3fb6469f5b39?auto=format&fit=crop&w=240&q=80',
      rating: 4.9,
      tourCount: 48,
      responseTime: 'within 2 hours',
      founded: '2012',
      certifications: ['IATA Certified', 'Sustainable Travel Alliance'],
    },
    reviews: [
      {
        id: 'review-paris-1',
        travelerName: 'Sofia Martinez',
        travelerAvatar:
          'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=200&q=80',
        rating: 5,
        date: 'April 2024',
        comment:
          'Every detail felt curated just for us. The private Louvre visit was a dream and the gastronomy experiences were unforgettable.',
        highlight: 'Loved the personalized chef experiences',
      },
      {
        id: 'review-paris-2',
        travelerName: 'Jonathan Becker',
        travelerAvatar:
          'https://images.unsplash.com/photo-1544723795-3fb6469f5b39?auto=format&fit=crop&w=200&q=80',
        rating: 5,
        date: 'February 2024',
        comment:
          'Our guide made Paris come alive. The perfect balance between cultural deep dives and culinary indulgence.',
        highlight: 'Art historian guide was exceptional',
      },
    ],
    tags: ['Luxury', 'Gastronomy', 'Art & Culture'],
  },
  {
    id: 'amalfi-coast-sailing',
    slug: 'amalfi-coast-sailing',
    title: 'Amalfi Coast Sailing & Culinary Escape',
    destination: 'Amalfi Coast',
    country: 'Italy',
    duration: '7 days',
    groupSize: 'Max 8 guests',
    priceFrom: 2290,
    reviewCount: 182,
    heroImage:
      'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=1600&q=80',
    heroImageAlt: 'Colorful cliffside town on the Amalfi Coast overlooking the sea',
    gallery: [
      'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1526481280695-3c46977f8d77?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1495846101638-3eb70fffb53e?auto=format&fit=crop&w=1200&q=80',
    ],
    quickSummary: [
      'Boutique yacht sailing',
      'Farm-to-table cooking class',
      'Sunset limoncello tasting',
    ],
    highlights: [
      'Cruise along the Amalfi coastline aboard a luxury yacht',
      'Hands-on cooking class with a local nonna in Ravello',
      'Private Capri excursion with Blue Grotto entry',
      'Exclusive dining at Michelin-starred restaurant Il Buco',
    ],
    overview:
      'Experience the Amalfi Coast from the sea, exploring charming villages, pristine coves, and culinary delights. This intimate sailing journey combines coastal exploration with authentic flavors and warm Italian hospitality.',
    itinerary: [
      {
        day: 'Day 1',
        title: 'Arrival in Positano & Sunset Sail',
        description:
          'Settle into your cabin, meet your crew, and enjoy a sunset sail with aperitivo along the Positano coastline.',
        image:
          'https://images.unsplash.com/photo-1526481280695-3c46977f8d77?auto=format&fit=crop&w=1200&q=80',
      },
      {
        day: 'Day 2',
        title: 'Capri & Blue Grotto',
        description:
          'Morning sail to Capri with private access to the Blue Grotto and free time to explore the Piazzetta.',
        image:
          'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80',
      },
      {
        day: 'Day 3',
        title: 'Cooking in Ravello',
        description:
          'Disembark for a farm-to-table cooking workshop in the hills of Ravello, ending with a long Italian lunch.',
        image:
          'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=1200&q=80',
      },
      {
        day: 'Day 4',
        title: 'Amalfi & Limoncello',
        description:
          'Explore Amalfi’s historic Duomo and visit a family-run limoncello producer for a private tasting.',
        image:
          'https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&fit=crop&w=1200&q=80',
      },
      {
        day: 'Day 5',
        title: 'Secret Coves & Swimming',
        description:
          'Drop anchor in hidden bays for swimming, snorkeling, and beach picnics prepared by your onboard chef.',
        image:
          'https://images.unsplash.com/photo-1493558103817-58b2924bce98?auto=format&fit=crop&w=1200&q=80',
      },
      {
        day: 'Day 6',
        title: 'Sorrento & Michelin Dining',
        description:
          'Dock in Sorrento for a leisurely afternoon before a Michelin-starred dinner at Il Buco.',
        image:
          'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1200&q=80',
      },
      {
        day: 'Day 7',
        title: 'Farewell Brunch in Positano',
        description:
          'Sail back to Positano and enjoy a farewell brunch overlooking the pastel-colored village.',
        image:
          'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80',
      },
    ],
    included: [
      '6 nights aboard a luxury yacht cabin',
      'All breakfasts, 5 lunches, 4 dinners',
      'Professional skipper and local guide',
      'Exclusive cooking class and tastings',
      'All port fees and fuel',
    ],
    excluded: [
      'International and domestic flights',
      'Travel insurance',
      'Optional shore excursions',
      'Crew gratuities',
    ],
    cancellationPolicy:
      'Free cancellation up to 45 days before departure. 35% fee within 30 days, 100% within 7 days of departure.',
    operator: {
      name: 'Azure Voyages',
      avatar:
        'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=240&q=80',
      rating: 4.8,
      tourCount: 32,
      responseTime: 'within 4 hours',
      founded: '2008',
      certifications: ['CLIA Member', 'Sustainable Travel Alliance'],
    },
    reviews: [
      {
        id: 'review-amalfi-1',
        travelerName: 'Emma Johansson',
        travelerAvatar:
          'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=200&q=80',
        rating: 5,
        date: 'July 2023',
        comment:
          'An unforgettable sailing trip. The crew treated us like family and every stop felt exclusive. The cooking class was a highlight!',
        highlight: 'Sunset sail into Positano',
      },
      {
        id: 'review-amalfi-2',
        travelerName: 'Marco Rossi',
        travelerAvatar:
          'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=200&q=80',
        rating: 4.5,
        date: 'May 2024',
        comment:
          'Beautiful itinerary and top-notch service. Would have loved a bit more free time ashore, but overall incredible value.',
        highlight: 'Private Capri experience',
      },
    ],
    tags: ['Sailing', 'Culinary', 'Small Group'],
  },
  {
    id: 'iceland-adventure',
    slug: 'iceland-fire-ice-expedition',
    title: 'Iceland Fire & Ice Expedition',
    destination: 'Reykjavík',
    country: 'Iceland',
    duration: '6 days',
    groupSize: 'Max 12 guests',
    priceFrom: 2495,
    reviewCount: 148,
    heroImage:
      'https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&fit=crop&w=1600&q=80',
    heroImageAlt: 'Icelandic waterfall surrounded by moss-covered cliffs',
    gallery: [
      'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1500043201784-5ff22a518ef8?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1476611338391-6f395a0ebc83?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=1200&q=80',
    ],
    quickSummary: [
      'Glacier hiking & ice cave exploration',
      'Premium boutique eco-lodges',
      'Northern Lights night photography session',
    ],
    highlights: [
      'Snowmobile expedition on Langjökull glacier',
      'Guided tour of Golden Circle with geothermal spa visit',
      'Private zodiac cruise in Jökulsárlón glacier lagoon',
      'Icelandic horse riding through lava fields',
    ],
    overview:
      'Discover Iceland’s dramatic contrasts with expert-guided adventures and premium comfort. This itinerary balances adrenaline-filled activities with cozy Nordic stays, farm-to-table dining, and breathtaking landscapes.',
    itinerary: [
      {
        day: 'Day 1',
        title: 'Arrival & Blue Lagoon',
        description:
          'Arrive in Reykjavík, settle into your eco-lodge, and unwind with a geothermal soak at the Blue Lagoon.',
        image:
          'https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&fit=crop&w=1200&q=80',
      },
      {
        day: 'Day 2',
        title: 'Golden Circle & Secret Lagoon',
        description:
          'Explore Þingvellir National Park, Gullfoss waterfall, and Geysir geothermal area, followed by a soak in the Secret Lagoon.',
        image:
          'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1200&q=80',
      },
      {
        day: 'Day 3',
        title: 'Glacier Hike & Ice Cave',
        description:
          'Guided glacier hike on Sólheimajökull and venture inside a natural ice cave with specialist gear provided.',
        image:
          'https://images.unsplash.com/photo-1500043201784-5ff22a518ef8?auto=format&fit=crop&w=1200&q=80',
      },
      {
        day: 'Day 4',
        title: 'South Coast & Waterfalls',
        description:
          'Visit the black sand beaches of Reynisfjara, Skógafoss waterfall, and Dyrhólaey cliff formation.',
        image:
          'https://images.unsplash.com/photo-1476611338391-6f395a0ebc83?auto=format&fit=crop&w=1200&q=80',
      },
      {
        day: 'Day 5',
        title: 'Glacier Lagoon & Aurora Hunt',
        description:
          'Private zodiac cruise on Jökulsárlón glacier lagoon and Northern Lights chase with photography guide.',
        image:
          'https://images.unsplash.com/photo-1466978913421-dad2ebd01d17?auto=format&fit=crop&w=1200&q=80',
      },
      {
        day: 'Day 6',
        title: 'Reykjavík Culture & Departure',
        description:
          'Morning walking tour of Reykjavík with local tastings before airport transfer.',
        image:
          'https://images.unsplash.com/photo-1476611338391-6f395a0ebc83?auto=format&fit=crop&w=1200&q=80',
      },
    ],
    included: [
      '5 nights premium eco-lodges',
      'Daily breakfast, 4 lunches, 3 dinners',
      'Airport transfers and private transport',
      'Certified glacier and mountain guides',
      'Specialist equipment for all activities',
    ],
    excluded: [
      'Flights to/from Iceland',
      'Travel insurance',
      'Optional activities during free time',
      'Alcoholic beverages (unless specified)',
    ],
    cancellationPolicy:
      'Full refund up to 40 days before departure. 30% fee up to 14 days. Non-refundable within 14 days.',
    operator: {
      name: 'Nordic Horizons',
      avatar:
        'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=240&q=80',
      rating: 4.95,
      tourCount: 24,
      responseTime: 'within 3 hours',
      founded: '2010',
      certifications: ['Adventure Travel Trade Association', 'Carbon Neutral Certified'],
    },
    reviews: [
      {
        id: 'review-iceland-1',
        travelerName: 'Lukas Schneider',
        travelerAvatar:
          'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=200&q=80',
        rating: 5,
        date: 'March 2024',
        comment:
          'The guides were knowledgeable and safety-focused. Watching the Aurora with our photography pro was a once-in-a-lifetime moment.',
        highlight: 'Northern Lights photography session',
      },
      {
        id: 'review-iceland-2',
        travelerName: 'Amelia Clarke',
        travelerAvatar:
          'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80',
        rating: 4.9,
        date: 'January 2024',
        comment:
          'A perfect blend of adventure and comfort. Loved the eco-lodges and sustainable focus throughout the trip.',
        highlight: 'Eco-lodges and sustainable approach',
      },
    ],
    tags: ['Adventure', 'Nature', 'Small Group'],
  },
  {
    id: 'kyoto-cultural-immersion',
    slug: 'kyoto-cultural-immersion',
    title: 'Kyoto Cultural Immersion & Zen Retreat',
    destination: 'Kyoto',
    country: 'Japan',
    duration: '6 days',
    groupSize: 'Max 12 guests',
    priceFrom: 2140,
    reviewCount: 164,
    heroImage:
      'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1600&q=80',
    heroImageAlt: 'Traditional Japanese temple surrounded by autumn foliage in Kyoto',
    gallery: [
      'https://images.unsplash.com/photo-1554797589-7241bb691973?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1529307474305-1527aab65925?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1549692520-acc6669e2f0c?auto=format&fit=crop&w=1200&q=80',
    ],
    quickSummary: [
      'Stay in a luxury ryokan with onsen',
      'Tea ceremony with tea master',
      'Private access to Zen temple gardens',
    ],
    highlights: [
      'Traditional kaiseki dinner prepared by Michelin-starred chef',
      'Exclusive morning visit to Fushimi Inari before crowds',
      'Hands-on ikebana workshop with master florist',
      'Day trip to Nara with deer park and Todai-ji temple',
    ],
    overview:
      'Slow down in Kyoto with this mindful cultural immersion. Discover centuries-old traditions, meet local artisans, and stay in elegant ryokans with soothing onsens.',
    itinerary: [
      {
        day: 'Day 1',
        title: 'Arrival & Gion Evening Walk',
        description:
          'Check into your ryokan, enjoy a tea ceremony welcome, and explore Gion’s historic alleyways with your guide.',
        image:
          'https://images.unsplash.com/photo-1529307474305-1527aab65925?auto=format&fit=crop&w=1200&q=80',
      },
      {
        day: 'Day 2',
        title: 'Fushimi Inari & Culinary Delights',
        description:
          'Sunrise visit to Fushimi Inari Shrine, followed by a kaiseki lunch and evening sake tasting in Pontocho.',
        image:
          'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1200&q=80',
      },
      {
        day: 'Day 3',
        title: 'Zen Temple & Ikebana',
        description:
          'Private meditation session at a Zen temple and interactive ikebana workshop with a floral artist.',
        image:
          'https://images.unsplash.com/photo-1554797589-7241bb691973?auto=format&fit=crop&w=1200&q=80',
      },
      {
        day: 'Day 4',
        title: 'Arashiyama Bamboo & Artisan Crafts',
        description:
          'Explore Arashiyama’s bamboo grove, visit a traditional textile workshop, and cruise the Hozu River.',
        image:
          'https://images.unsplash.com/photo-1549692520-acc6669e2f0c?auto=format&fit=crop&w=1200&q=80',
      },
      {
        day: 'Day 5',
        title: 'Nara Heritage',
        description:
          'Day trip to Nara featuring Todai-ji Temple, Kasuga Taisha, and time to wander with the friendly deer.',
        image:
          'https://images.unsplash.com/photo-1529307474305-1527aab65925?auto=format&fit=crop&w=1200&q=80',
      },
      {
        day: 'Day 6',
        title: 'Slow Morning & Farewell',
        description:
          'Gentle morning yoga, final onsen soak, and farewell lunch featuring seasonal Kyoto specialties.',
        image:
          'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1200&q=80',
      },
    ],
    included: [
      '5 nights in luxury ryokans',
      'Daily breakfast and select kaiseki dinners',
      'All cultural workshops and guided visits',
      'Private transport and airport transfers',
      'On-the-ground concierge support',
    ],
    excluded: [
      'International flights',
      'Travel insurance',
      'Additional spa treatments',
      'Personal expenses & gratuities',
    ],
    cancellationPolicy:
      'Full refund up to 35 days before start. 50% refund up to 15 days. Non-refundable within 15 days.',
    operator: {
      name: 'Zen Atlas',
      avatar:
        'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=240&q=80',
      rating: 4.97,
      tourCount: 18,
      responseTime: 'within 1 hour',
      founded: '2015',
      certifications: ['Japan National Tourism Certified', 'Wellness Travel Alliance'],
    },
    reviews: [
      {
        id: 'review-kyoto-1',
        travelerName: 'Charlotte Dubois',
        travelerAvatar:
          'https://images.unsplash.com/photo-1544723795-3fb6469f5b39?auto=format&fit=crop&w=200&q=80',
        rating: 5,
        date: 'November 2023',
        comment:
          'A serene experience that deepened my love for Japanese culture. The private temple visit was transcendental.',
        highlight: 'Private Zen meditation',
      },
      {
        id: 'review-kyoto-2',
        travelerName: 'David Kim',
        travelerAvatar:
          'https://images.unsplash.com/photo-1515605579510-1e3c645ed3c9?auto=format&fit=crop&w=200&q=80',
        rating: 4.8,
        date: 'March 2024',
        comment:
          'Beautifully organized with thoughtful pacing. The ryokan stays and onsen experiences were highlights.',
        highlight: 'Ryokan hospitality',
      },
    ],
    tags: ['Culture', 'Wellness', 'Small Group'],
  },
];

