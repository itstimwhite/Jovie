'use client';

import { motion } from 'framer-motion';
import { TippingCard } from './TippingCard';

export function TippingClient() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* Venmo Card */}
      <TippingCard
        title="Venmo"
        description="Set up your Venmo handle to receive tips"
        icon="💸"
        iconBgClass="bg-blue-100 dark:bg-blue-900/20"
      >
        <div className="mt-4 space-y-4">
          <p className="text-sm text-secondary-token">
            Connect your Venmo account to allow fans to send you tips directly.
          </p>
          <div className="flex items-center space-x-2">
            <input
              type="text"
              placeholder="Your Venmo handle (e.g. @username)"
              className="flex-1 px-3 py-2 border border-subtle rounded-md bg-surface-0 text-primary-token focus:outline-none focus:ring-2 focus:ring-accent"
            />
            <button className="px-4 py-2 bg-accent text-white rounded-md hover:bg-accent/90 transition-colors">
              Save
            </button>
          </div>
        </div>
      </TippingCard>

      {/* Coming Soon Card */}
      <TippingCard
        title="More Payment Options"
        description="Additional payment methods coming soon"
        icon="🔜"
        iconBgClass="bg-purple-100 dark:bg-purple-900/20"
      >
        <div className="mt-4 space-y-4">
          <p className="text-sm text-secondary-token">
            We're working on adding more payment options for your fans to support you.
            Stay tuned for updates!
          </p>
          <div className="grid grid-cols-3 gap-4">
            <div className="p-3 border border-subtle rounded-md bg-surface-0 flex items-center justify-center opacity-50">
              <span className="text-xl">💳</span>
            </div>
            <div className="p-3 border border-subtle rounded-md bg-surface-0 flex items-center justify-center opacity-50">
              <span className="text-xl">🪙</span>
            </div>
            <div className="p-3 border border-subtle rounded-md bg-surface-0 flex items-center justify-center opacity-50">
              <span className="text-xl">📱</span>
            </div>
          </div>
        </div>
      </TippingCard>
    </motion.div>
  );
}

