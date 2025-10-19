export const tours = [
  {
    id: 'aurora-escape',
    name: 'Aurora Escape in Iceland',
    slug: 'aurora-escape',
    destination: 'Reykjavík, Iceland',
    duration: 7,
    groupSize: '8-12 explorers',
    difficulty: 'Moderate',
    price: 2890,
    rating: 4.9,
    reviewsCount: 132,
    thumbnail: 'https://images.unsplash.com/photo-1476610182048-b716b8518aae?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80'
    ],
    tags: ['Northern lights', 'Luxury stay', 'Glacier hike'],
    highlights: [
      'Northern lights every night from private glass domes',
      'Glacier hike and crystal ice cave exploration with expert guides',
      'Geothermal spa retreat and Icelandic fine dining experiences'
    ],
    itinerary: [
      {
        day: 1,
        title: 'Arrival & Reykjavik Discovery',
        items: [
          'Private transfer from airport to luxury boutique hotel',
          'Guided walk through Reykjavík old harbor & Hallgrímskirkja',
          'Welcome dinner featuring New Nordic cuisine'
        ]
      },
      {
        day: 3,
        title: 'Glacier Adventure',
        items: [
          'Super jeep ride to Vatnajökull National Park',
          'Hands-on glacier trek with certified guide',
          'Evening aurora viewing from remote observatory'
        ]
      },
      {
        day: 5,
        title: 'Blue Lagoon Reset',
        items: [
          'Morning geothermal ritual & in-water massage',
          'Chef-led tasting menu with wine pairing',
          'Nighttime photography workshop'
        ]
      }
    ],
    description: 'Experience Iceland in comfort. Boutique accommodations, small group experiences, and curated moments designed for slow travel. Every detail is orchestrated for the modern explorer.',
    includes: [
      'Luxury hotel & glass dome accommodations',
      'All breakfasts and curated dinners',
      'Expert local guides & photography coach',
      'Private airport transfers',
      'Premium travel insurance'
    ],
    excludes: [
      'International airfare',
      'Lunches and personal expenses',
      'Guide gratuities'
    ],
    policies: {
      cancellation: 'Full refund up to 30 days before departure. 50% refund up to 15 days.',
      requirements: 'Travel insurance required. Moderate fitness recommended.',
      payment: 'Secure payment with 20% deposit, balance 30 days prior.'
    }
  },
  {
    id: 'safari-serengeti',
    name: 'Serengeti Sunrise Safari',
    slug: 'serengeti-safari',
    destination: 'Serengeti, Tanzania',
    duration: 5,
    groupSize: '6 guests',
    difficulty: 'Easy',
    price: 3490,
    rating: 4.8,
    reviewsCount: 98,
    thumbnail: 'https://images.unsplash.com/photo-1543248939-ff40856f65d4?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1508672019048-805c876b67e2?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1541417904950-b855846fe074?auto=format&fit=crop&w=1200&q=80'
    ],
    tags: ['Luxury camp', 'Wildlife', 'Photography'],
    highlights: [
      'Sunrise hot air balloon flight over the savannah',
      'Private bush dinners with Maasai storytelling',
      'Daily game drives with wildlife experts'
    ],
    itinerary: [
      {
        day: 1,
        title: 'Touchdown in Arusha',
        items: [
          'VIP arrival service and transfer to Legendary Lodge',
          'Sundowner cocktails with orientation briefing'
        ]
      },
      {
        day: 2,
        title: 'Into the Serengeti',
        items: [
          'Charter flight to exclusive concession',
          'Afternoon game drive spotting lions & elephants',
          'Chef’s tasting menu under the stars'
        ]
      }
    ],
    description: 'A slow safari designed for photographers and wildlife lovers. Stay in award-winning tented camps, guided by conservation experts, with flexible daily schedules.',
    includes: [
      'Luxury tented accommodation',
      'All meals, premium wine and spirits',
      'Daily game drives & hot air balloon',
      'Charter flights between camps',
      'Dedicated travel concierge'
    ],
    excludes: [
      'International flights',
      'Visas and vaccinations',
      'Travel insurance'
    ],
    policies: {
      cancellation: '90% refund up to 45 days before arrival. Non-refundable after.',
      requirements: 'Proof of yellow fever vaccination. Travel insurance recommended.',
      payment: '30% deposit to confirm. Balance 45 days pre-departure.'
    }
  },
  {
    id: 'amalfi-signature',
    name: 'Amalfi Signature Retreat',
    slug: 'amalfi-signature',
    destination: 'Amalfi Coast, Italy',
    duration: 6,
    groupSize: '4-8 guests',
    difficulty: 'Easy',
    price: 3190,
    rating: 4.8,
    reviewsCount: 87,
    thumbnail: 'https://images.unsplash.com/photo-1493558103817-58b2924bce98?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1470124182917-cc6e71b22ecc?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1529270291171-b0c07f44461f?auto=format&fit=crop&w=1200&q=80'
    ],
    tags: ['Coastal', 'Gastronomy', 'Wellness'],
    highlights: [
      'Sunset yacht charter with private sommelier and live acoustic music',
      'Chef-led pasta workshop in a cliffside villa',
      'Wellness morning with yoga terrace and limoncello spa rituals'
    ],
    itinerary: [
      {
        day: 1,
        title: 'La Dolce Vita Arrival',
        items: [
          'Chauffeured transfer along the Amalfi Drive',
          'Welcome aperitivo on the terrace overlooking Positano'
        ]
      },
      {
        day: 3,
        title: 'Sorrento & Capri Excursion',
        items: [
          'Private boat to Capri with Blue Grotto entry',
          'Michelin-starred lunch arranged by concierge'
        ]
      }
    ],
    description: 'A slow-paced coastal escape balancing curated dining, hidden coves, and boutique stays carved into the cliffs. Perfect for couples or small groups celebrating milestones.',
    includes: [
      'Luxury villa or boutique hotel accommodations',
      'Daily breakfast and handpicked dinners',
      'Private transfers and boat charter',
      'Local experiences with vetted guides',
      'Dedicated travel concierge'
    ],
    excludes: [
      'International airfare',
      'Personal shopping',
      'Additional spa services'
    ],
    policies: {
      cancellation: 'Full refund up to 21 days prior. 50% credit up to 7 days.',
      requirements: 'Valid passport and travel insurance recommended.',
      payment: '20% deposit to confirm. Balance 21 days before departure.'
    }
  },
  {
    id: 'kyoto-cultural',
    name: 'Kyoto Cultural Immersion',
    slug: 'kyoto-cultural',
    destination: 'Kyoto, Japan',
    duration: 8,
    groupSize: '6-10 guests',
    difficulty: 'Light walking',
    price: 3990,
    rating: 4.9,
    reviewsCount: 142,
    thumbnail: 'https://images.unsplash.com/photo-1526481280695-3c4693f26e90?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1524492514791-49914082e440?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1549692520-acc6669e2f0c?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1505063368233-9c01647d4083?auto=format&fit=crop&w=1200&q=80'
    ],
    tags: ['Culture', 'Culinary', 'Wellness'],
    highlights: [
      'Private tea ceremony with 13th-generation tea master',
      'Kimono styling and photography in Gion',
      'Guided meditation at a hidden zen temple at dawn'
    ],
    itinerary: [
      {
        day: 2,
        title: 'Temples & Traditions',
        items: [
          'Guided tour of Fushimi Inari at sunrise before crowds',
          'Hands-on calligraphy workshop with local artisan'
        ]
      },
      {
        day: 5,
        title: 'Culinary Kyoto',
        items: [
          'Visit to Nishiki Market with chef-led tasting',
          'Kaiseki dinner in a private machiya townhouse'
        ]
      }
    ],
    description: 'Dive deep into Kyoto’s timeless rituals with curated cultural immersions, refined cuisine, and restorative wellness moments. Designed for curious travelers who crave authenticity.',
    includes: [
      'Luxury ryokan and design-forward hotel stays',
      'Daily breakfast and select dinners',
      'Private guides and translators',
      'All cultural workshop fees',
      'JR rail passes within itinerary'
    ],
    excludes: [
      'International flights',
      'Lunches and personal expenses',
      'Optional day-trips to Osaka or Nara'
    ],
    policies: {
      cancellation: 'Convertible to travel credit up to 30 days out. 30% penalty within 14 days.',
      requirements: 'Comfortable walking shoes and willingness to remove footwear indoors.',
      payment: '25% deposit. Remaining balance due 30 days prior.'
    }
  }
];

export const featuredTours = tours.slice(0, 2);

export const curatedCollections = [
  {
    id: 'slow-travel',
    title: 'Slow Travel Escapes',
    description: 'Week-long retreats with mindful itineraries, wellness rituals, and private hosts.',
    tours: tours
  },
  {
    id: 'adventure-luxe',
    title: 'Adventure Luxe',
    description: 'For thrill seekers seeking comfort—helicopter transfers, expert guides, and chef-led dining.',
    tours: tours
  }
];
