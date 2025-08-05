export function ComparisonSection() {
  const features = [
    {
      feature: 'Customization Options',
      linktree: 'Endless customization options',
      beacons: 'Endless customization options',
      jovie: 'One optimized design',
      othersNegative: true,
    },
    {
      feature: 'Loading Speed',
      linktree: 'Slow loading',
      beacons: 'Can be slow',
      jovie: 'Instant loading',
      othersNegative: true,
    },
    {
      feature: 'Target Audience',
      linktree: 'Built for everyone',
      beacons: 'Built for everyone',
      jovie: 'Built for musicians only',
      othersNegative: true,
    },
    {
      feature: 'Music Integrations',
      linktree: 'Basic',
      beacons: 'Basic',
      jovie: 'Deep Spotify integration',
      othersNegative: true,
    },
    {
      feature: 'Conversion Focus',
      linktree: 'Distracting options',
      beacons: 'Distracting options',
      jovie: 'Optimized for fan conversion',
      othersNegative: true,
    },
  ];

  return (
    <section className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl lg:text-6xl">
            Jovie vs the competition
          </h2>
        </div>
        <div className="mx-auto mt-20 max-w-4xl">
          <div className="overflow-hidden rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 shadow-xl">
            <div className="grid grid-cols-1 md:grid-cols-4">
              {/* Header */}
              <div className="bg-white/5 px-6 py-4 border-b border-white/10">
                <h3 className="text-lg font-semibold text-white">Feature</h3>
              </div>
              <div className="bg-white/5 px-6 py-4 border-b border-white/10">
                <h3 className="text-lg font-semibold text-white/80">
                  Linktree
                </h3>
              </div>
              <div className="bg-white/5 px-6 py-4 border-b border-white/10">
                <h3 className="text-lg font-semibold text-white/80">Beacons</h3>
              </div>
              <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 px-6 py-4 border-b border-white/10">
                <h3 className="text-lg font-bold text-white">Jovie</h3>
              </div>

              {/* Features */}
              {features.map((item, index) => (
                <div key={item.feature} className="contents">
                  <div
                    className={`px-6 py-3 ${index % 2 === 0 ? 'bg-white/5' : 'bg-white/10'}`}
                  >
                    <p className="font-medium text-white">{item.feature}</p>
                  </div>
                  <div
                    className={`px-6 py-3 ${index % 2 === 0 ? 'bg-white/5' : 'bg-white/10'}`}
                  >
                    <p className="text-white/60">{item.linktree}</p>
                  </div>
                  <div
                    className={`px-6 py-3 ${index % 2 === 0 ? 'bg-white/5' : 'bg-white/10'}`}
                  >
                    <p className="text-white/60">{item.beacons}</p>
                  </div>
                  <div
                    className={`px-6 py-3 ${index % 2 === 0 ? 'bg-gradient-to-r from-blue-500/10 to-purple-500/10' : 'bg-gradient-to-r from-blue-500/20 to-purple-500/20'}`}
                  >
                    <div className="flex items-center">
                      <svg
                        className="mr-3 h-4 w-4 text-blue-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={1.5}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      <p className="font-semibold text-white">{item.jovie}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
