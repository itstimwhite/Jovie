import { cn } from '@/lib/utils';

export function BenefitsSection() {
  const benefits = [
    {
      title: '3.2x Faster Loading',
      description:
        'Fans discover your music instantly. No waiting, no bouncing.',
      metric: '0.8s load time',
      icon: (
        <svg
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13 10V3L4 14h7v7l9-11h-7z"
          />
        </svg>
      ),
      accent: 'blue',
    },
    {
      title: '47% More Streams',
      description:
        'Optimized for conversion. Fans click and stream immediately.',
      metric: '+47% conversion',
      icon: (
        <svg
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
          />
        </svg>
      ),
      accent: 'green',
    },
    {
      title: 'Smart Fan Routing',
      description:
        "Remembers each fan's favorite platform. One click to their preferred streaming service.",
      metric: '1-click streaming',
      icon: (
        <svg
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
          />
        </svg>
      ),
      accent: 'purple',
    },
  ];

  return (
    <section className="relative py-16">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center mb-12">
          <div className="mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 border border-green-500/20 text-sm font-medium text-green-400">
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              The Solution
            </div>
          </div>

          <h2 className="text-4xl font-semibold tracking-tight text-gray-900 dark:text-white sm:text-5xl lg:text-6xl">
            Built for musicians, optimized for conversion
          </h2>

          <p className="mt-6 text-xl text-gray-600 dark:text-white/70">
            Every element is designed to turn fans into streams. No
            distractions, just results.
          </p>
        </div>

        <div className="mx-auto max-w-6xl">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {benefits.map((benefit) => {
              const accent = benefit.accent;

              return (
                <div key={benefit.title} className="relative group">
                  <div className="absolute -inset-4 bg-gradient-to-r from-white/5 to-white/10 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="relative bg-gray-50/80 dark:bg-white/5 backdrop-blur-sm border border-gray-200 dark:border-white/10 rounded-2xl p-8 hover:border-gray-300 dark:hover:border-white/20 transition-all duration-300">
                    <div
                      className={cn(
                        'inline-flex h-12 w-12 items-center justify-center rounded-xl text-white shadow-lg bg-gradient-to-br',
                        `from-${accent}-500 to-${accent}-600`
                      )}
                    >
                      {benefit.icon}
                    </div>

                    <h3 className="mt-6 text-xl font-semibold text-gray-900 dark:text-white">
                      {benefit.title}
                    </h3>

                    <div className="mt-2">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 dark:bg-white/10 text-gray-700 dark:text-white/80">
                        {benefit.metric}
                      </span>
                    </div>

                    <p className="mt-4 text-gray-600 dark:text-white/70 leading-relaxed">
                      {benefit.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
