import { cn } from '@/lib/utils';

interface AmountSelectorProps {
  amount: number;
  isSelected: boolean;
  onClick: () => void;
  className?: string;
}

export function AmountSelector({ amount, isSelected, onClick, className }: AmountSelectorProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={isSelected}
      className={cn(
        'w-full aspect-square rounded-xl border text-lg font-semibold transition-colors flex items-center justify-center cursor-pointer',
        'bg-white text-gray-900 dark:bg-gray-900 dark:text-gray-100',
        isSelected
          ? 'border-purple-500 ring-2 ring-purple-200/60 dark:ring-purple-600/30'
          : 'border-black/40 hover:border-black/70 dark:border-white/30 dark:hover:border-white/60',
        className
      )}
    >
      ${amount}
    </button>
  );
}