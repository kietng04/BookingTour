import React, { useState } from 'react';
import clsx from 'clsx';
import { motion, AnimatePresence } from 'framer-motion';

interface Tab {
  id: string;
  label: string;
  description?: string;
  content: React.ReactNode;
}

interface TourInfoTabsProps {
  tabs: Tab[];
  defaultTabId?: string;
}

const TourInfoTabs: React.FC<TourInfoTabsProps> = ({ tabs, defaultTabId }) => {
  const [activeTabId, setActiveTabId] = useState(defaultTabId ?? tabs[0]?.id ?? '');
  const activeTab = tabs.find((tab) => tab.id === activeTabId) ?? tabs[0];

  return (
    <section aria-label="Tour information" className="rounded-3xl border border-gray-100 bg-white shadow-card">
      <div className="flex flex-wrap items-center gap-2 border-b border-gray-100 px-6 py-4 md:gap-4">
        {tabs.map((tab) => {
          const isActive = tab.id === activeTabId;

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTabId(tab.id)}
              className={clsx(
                'relative rounded-full px-4 py-2 text-sm font-semibold transition',
                isActive
                  ? 'bg-brand-50 text-brand-600'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              )}
            >
              {tab.label}
              {isActive && (
                <motion.span
                  layoutId="tab-indicator"
                  className="absolute inset-0 rounded-full border border-brand-200"
                  transition={{ type: 'spring', duration: 0.4, bounce: 0.2 }}
                />
              )}
            </button>
          );
        })}
      </div>
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab?.id}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.3 }}
          className="px-6 py-6 text-sm text-gray-600 sm:px-10 sm:py-8"
        >
          {activeTab?.description && (
            <p className="mb-4 text-sm text-gray-500">{activeTab.description}</p>
          )}
          <div className="space-y-4 text-gray-700">{activeTab?.content}</div>
        </motion.div>
      </AnimatePresence>
    </section>
  );
};

export default TourInfoTabs;
