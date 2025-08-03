export function ComparisonSection() {
  const features = [
    {
      feature: 'Customization Options',
      others: 'Endless customization options',
      jovie: 'One optimized design',
      othersNegative: true,
    },
    {
      feature: 'Loading Speed',
      others: 'Slow loading',
      jovie: 'Instant loading',
      othersNegative: true,
    },
    {
      feature: 'Target Audience',
      others: 'Built for everyone',
      jovie: 'Built for musicians only',
      othersNegative: true,
    },
  ];

  return (
    <section className="relative bg-gray-50 py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
            Linktree vs. Jovie
          </h2>
        </div>
        <div className="mx-auto mt-20 max-w-4xl">
          <div className="overflow-hidden rounded-xl bg-white shadow-lg ring-1 ring-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-3">
              {/* Header */}
              <div className="bg-gray-50 px-6 py-4">
                <h3 className="text-lg font-semibold text-gray-900">Feature</h3>
              </div>
              <div className="bg-red-50 px-6 py-4">
                <h3 className="text-lg font-semibold text-red-900">
                  Other Platforms
                </h3>
              </div>
              <div className="bg-blue-50 px-6 py-4">
                <h3 className="text-lg font-semibold text-blue-900">Jovie</h3>
              </div>

              {/* Features */}
              {features.map((item, index) => (
                <div key={item.feature} className="contents">
                  <div
                    className={`px-6 py-3 ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}
                  >
                    <p className="font-medium text-gray-900">{item.feature}</p>
                  </div>
                  <div
                    className={`px-6 py-3 ${index % 2 === 0 ? 'bg-red-25' : 'bg-red-50'}`}
                  >
                    <div className="flex items-center">
                      <svg
                        className="mr-3 h-4 w-4 text-gray-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                      <p className="text-gray-600">{item.others}</p>
                    </div>
                  </div>
                  <div
                    className={`px-6 py-3 ${index % 2 === 0 ? 'bg-blue-25' : 'bg-blue-50'}`}
                  >
                    <div className="flex items-center">
                      <svg
                        className="mr-3 h-4 w-4 text-blue-500"
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
                      <p className="text-blue-700">{item.jovie}</p>
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
