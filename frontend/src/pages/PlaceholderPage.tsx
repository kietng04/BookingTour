import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

interface PlaceholderPageProps {
  title?: string;
  description?: string;
}

const PlaceholderPage: React.FC<PlaceholderPageProps> = ({
  title = 'Page in progress',
  description = 'We are polishing this experience. Meanwhile, explore our curated European tours.',
}) => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <main id="main-content" className="container flex min-h-[60vh] flex-col items-center justify-center text-center">
      <p className="text-xs font-semibold uppercase tracking-widest text-brand-500">
        {location.pathname.replace('/', '')}
      </p>
      <h1 className="mt-4 text-3xl font-semibold text-gray-900 md:text-4xl">{title}</h1>
      <p className="mt-3 max-w-xl text-sm text-gray-600">{description}</p>
      <button
        type="button"
        onClick={() => navigate('/')}
        className="mt-6 inline-flex items-center rounded-full bg-brand-500 px-5 py-2.5 text-sm font-semibold text-white shadow-lg transition hover:bg-brand-600 focus-visible:bg-brand-600"
      >
        Return home
      </button>
    </main>
  );
};

export default PlaceholderPage;
