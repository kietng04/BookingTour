import React from 'react';
import { useNavigate } from 'react-router-dom';

const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <main id="main-content" className="container flex min-h-[60vh] flex-col items-center justify-center text-center">
      <p className="text-sm font-semibold uppercase tracking-widest text-brand-500">404</p>
      <h1 className="mt-4 text-3xl font-semibold text-gray-900 md:text-4xl">Page not found</h1>
      <p className="mt-3 max-w-md text-sm text-gray-600">
        The page you are looking for has moved or no longer exists. Discover our curated experiences instead.
      </p>
      <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="inline-flex items-center rounded-full border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 transition hover:border-brand-300 hover:text-gray-900 focus-visible:border-brand-300"
        >
          Go back
        </button>
        <button
          type="button"
          onClick={() => navigate('/')}
          className="inline-flex items-center rounded-full bg-brand-500 px-5 py-2.5 text-sm font-semibold text-white shadow-lg transition hover:bg-brand-600 focus-visible:bg-brand-600"
        >
          Explore tours
        </button>
      </div>
    </main>
  );
};

export default NotFoundPage;
