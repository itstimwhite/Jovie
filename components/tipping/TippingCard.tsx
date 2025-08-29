'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface TippingCardProps {
  title: string;
  description: string;
  icon: string;
  iconBgClass: string;
  children: ReactNode;
}

export function TippingCard({
  title,
  description,
  icon,
  iconBgClass,
  children,
}: TippingCardProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.01 }}
      transition={{ duration: 0.2 }}
      className='bg-surface-1 backdrop-blur-sm rounded-lg border border-subtle p-6 hover:shadow-lg hover:border-accent/10 transition-all duration-300 relative z-10'
    >
      <div className='flex items-start'>
        <div className={`h-10 w-10 rounded-full ${iconBgClass} flex items-center justify-center mr-4`}>
          <span className='text-xl'>{icon}</span>
        </div>
        <div>
          <h3 className='text-lg font-medium text-primary-token'>{title}</h3>
          <p className='text-sm text-secondary-token'>{description}</p>
          {children}
        </div>
      </div>
    </motion.div>
  );
}
