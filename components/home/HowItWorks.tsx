export function HowItWorks() {
  const steps = [
    {
      number: '01',
      title: 'Connect',
      description: 'Search and verify your Spotify artist profile',
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
            d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
          />
        </svg>
      ),
    },
    {
      number: '02',
      title: 'Claim',
      description: 'Get your custom jov.ie/yourname link',
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
            d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
          />
        </svg>
      ),
    },
    {
      number: '03',
      title: 'Convert',
      description: 'Fans click "Listen Now" and stream your music',
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
            d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1.586a1 1 0 01.707.293l2.414 2.414a1 1 0 00.707.293H15"
          />
        </svg>
      ),
    },
  ];

  return (
    <section className="relative py-24 sm:py-32">
      {/* Section accent border */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-blue-500/50 via-purple-500/50 to-cyan-500/50" />

      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl lg:text-6xl">
            From Spotify artist to converting fans in 60 seconds
          </h2>
        </div>
        <div className="mx-auto mt-20 max-w-6xl">
          <div className="grid grid-cols-1 gap-12 md:grid-cols-3">
            {steps.map((step, index) => (
              <div key={step.number} className="relative">
                {/* Connection line - Linear-style */}
                {index < steps.length - 1 && (
                  <div className="absolute left-1/2 top-8 hidden h-px w-full -translate-x-1/2 bg-gradient-to-r from-blue-500/30 via-purple-500/30 to-cyan-500/30 md:block" />
                )}

                <div className="text-center">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-white shadow-lg">
                    {step.icon}
                  </div>
                  <div className="mt-6">
                    <div className="text-xs font-semibold uppercase tracking-wider text-blue-400">
                      Step {step.number}
                    </div>
                    <h3 className="mt-3 text-xl font-semibold text-white">
                      {step.title}
                    </h3>
                    <p className="mt-3 text-white/70 leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
