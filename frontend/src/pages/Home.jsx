import { Link } from 'react-router-dom';
import { ArrowRight, Compass, Heart, ShieldCheck, Sparkles } from 'lucide-react';
import SectionTitle from '../components/common/SectionTitle.jsx';
import Button from '../components/common/Button.jsx';
import TourGrid from '../components/tour/TourGrid.jsx';
import Card from '../components/common/Card.jsx';
import { featuredTours, curatedCollections } from '../data/mockTours.js';

const Home = () => (
  <div className="space-y-20 pb-24">
    <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-primary-900 text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(58,107,255,0.45),_transparent_60%)]" />
      <div className="relative mx-auto flex max-w-6xl flex-col gap-12 px-4 py-24 md:px-8 lg:flex-row lg:items-center">
        <div className="flex-1 space-y-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-4 py-2 text-sm text-primary-100">
            <Sparkles className="h-4 w-4" />
            Curated journeys for discerning travelers
          </div>
          <h1 className="text-4xl font-semibold tracking-tight md:text-5xl lg:text-6xl">
            Experience the world with a dedicated travel concierge
          </h1>
          <p className="max-w-xl text-lg text-slate-200">
            BookingTour transforms complex itineraries into effortless adventures. Discover immersive experiences, book with confidence, and let our experts orchestrate every detail.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button to="/tours" size="lg">
              Explore tours
            </Button>
            <Button to="/profile" variant="secondary" size="lg">
              Access my journeys
            </Button>
          </div>
        </div>
        <div className="relative hidden flex-1 lg:block">
          <div className="floating-card absolute right-10 top-10 rounded-3xl bg-white/10 p-6 backdrop-blur">
            <p className="text-xs uppercase tracking-widest text-primary-100">Live availability</p>
            <p className="text-3xl font-semibold text-white">24 curated tours</p>
            <p className="text-sm text-slate-200">Avg. traveler rating 4.9/5</p>
          </div>
          <img
            src="https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1400&q=80"
            alt="Hero landscape"
            className="ml-auto h-[480px] w-[540px] rounded-[36px] object-cover shadow-2xl"
          />
        </div>
      </div>
    </section>

    <section className="mx-auto max-w-6xl px-4 md:px-8">
      <SectionTitle
        eyebrow="Why BookingTour"
        title="A concierge team for modern travelers"
        description="Our platform mirrors backend logic — memberships, loyalty tiers, and verified hosts are surfaced to build trust with your guests."
      />
      <div className="mt-10 grid gap-6 md:grid-cols-3">
        {[
          {
            icon: Compass,
            title: 'Tailored itineraries',
            body: 'Every tour includes flexible modules that match backend add-ons. Swap activities, add experiences, or extend nights.'
          },
          {
            icon: ShieldCheck,
            title: 'Secure payment flow',
            body: 'Deposit, hold, and capture flows align with backend booking states — ready for Stripe or Momo integration.'
          },
          {
            icon: Heart,
            title: 'Verified hosts & reviews',
            body: 'Syncs with review moderation service. Highlight authenticity with badges like "Verified traveler" and role-based content.'
          }
        ].map((feature) => (
          <Card key={feature.title} className="space-y-4 border-slate-100">
            <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary-50 text-primary-500">
              <feature.icon className="h-5 w-5" />
            </span>
            <h3 className="text-lg font-semibold text-slate-900">{feature.title}</h3>
            <p className="text-sm text-slate-500">{feature.body}</p>
          </Card>
        ))}
      </div>
    </section>

    <section className="mx-auto max-w-6xl px-4 md:px-8">
      <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <SectionTitle
          eyebrow="Featured now"
          title="Exclusive journeys this season"
          description="Synchronizes with backend featured flag. Use this section for marketing campaigns or high-converting tours."
        />
        <Button variant="secondary" to="/tours">
          View all tours
        </Button>
      </div>
      <div className="mt-10">
        <TourGrid tours={featuredTours} />
      </div>
    </section>

    <section className="mx-auto max-w-6xl px-4 md:px-8">
      <SectionTitle
        eyebrow="Curated collections"
        title="Different ways to explore"
        description="Collections map to backend categories, enabling marketing teams to build experiences without code."
        align="center"
      />
      <div className="mt-12 grid gap-6 md:grid-cols-2">
        {curatedCollections.map((collection) => (
          <Card key={collection.id} className="space-y-6 border-slate-200 bg-white/80 p-8">
            <div className="space-y-3">
              <p className="text-xs uppercase tracking-widest text-primary-500">{collection.id.replace('-', ' ')}</p>
              <h3 className="text-2xl font-semibold text-slate-900">{collection.title}</h3>
              <p className="text-sm text-slate-500">{collection.description}</p>
            </div>
            <div className="flex gap-5">
              {collection.tours.slice(0, 3).map((tour) => (
                <Link key={tour.id} to={`/tours/${tour.id}`} className="group relative block flex-1 overflow-hidden rounded-3xl">
                  <img src={tour.thumbnail} alt={tour.name} className="h-44 w-full object-cover transition duration-500 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <p className="text-sm font-semibold text-white">{tour.name}</p>
                    <p className="text-xs text-slate-200">{tour.destination}</p>
                  </div>
                </Link>
              ))}
            </div>
            <Link to={`/collections/${collection.id}`} className="inline-flex items-center gap-2 text-sm font-semibold text-primary-500">
              Explore collection
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Card>
        ))}
      </div>
    </section>
  </div>
);

export default Home;
