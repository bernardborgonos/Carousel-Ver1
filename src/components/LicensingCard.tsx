import React from 'react';
import { Check, Flame, Pocket, Target } from 'lucide-react';

export default function LicensingCard() {
  const tiers = [
    {
      name: 'Trial Version',
      price: '$0',
      icon: <Pocket className="h-5 w-5 text-indigo-600" />,
      features: [
        'Limited API calls and usage constraints',
        'Watermarked usage on frontend display',
        'Development & testing only',
        'No direct maintenance support'
      ],
      isPopular: false,
    },
    {
      name: 'Single Site License',
      price: '$19',
      icon: <Pocket className="h-5 w-5 text-indigo-600" />,
      features: [
        'Use on 1 developer production website domain',
        'Full 3D math-driven hardware layout projection',
        'Swipe, touch drag, and slide click to focus',
        'Horizontal & high-tilt skewed orbit parameters',
        'Custom drop shadows & image reflections',
        '6 Months of critical core maintenance support'
      ],
      isPopular: false,
    },
    {
      name: 'Developer Toolkit',
      price: '$49',
      icon: <Flame className="h-5 w-5 text-indigo-100" />,
      features: [
        'Use on unlimited personal & commercial websites',
        'Everything in Single domain tier',
        'Full uncompressed clean TypeScript source code',
        'Z-Depth tunnel perspective customization',
        'Autoplay slideshow cycle transitions API',
        '1 Year of developer priority core support',
        'Lifetime free plugin version minor releases'
      ],
      isPopular: true,
    },
    {
      name: 'Enterprise Registry',
      price: '$129',
      icon: <Target className="h-5 w-5 text-amber-600" />,
      features: [
        'Full OEM redistributable integration rights',
        'Everything in Developer domain toolkit templates',
        'SaaS templates bundle inclusions permitted',
        'Standard Apache-2.0 fully compliance certified',
        'Premium 24/7 dedicated engineering consults',
        'Custom customizer components branding configs'
      ],
      isPopular: false,
    }
  ];

  return (
    <section className="py-12 bg-slate-50/50 border-t border-slate-200" id="licensing-section">
      <div className="mx-auto max-w-5xl px-6">
        
        <div className="text-center mb-10" id="licensing-header">
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">Secure Licensing</span>
          <h2 className="mt-2 text-2xl font-bold text-slate-900 sm:text-3xl">Pristine Pricing Packages</h2>
          <p className="mt-2 text-slate-500 text-xs sm:text-sm">
            Acquire a developer registration key to immediately configure professional 3D carousels globally.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-stretch" id="licensing-cards-row">
          {tiers.map((tier, idx) => (
            <div
              key={tier.name}
              id={`license-card-${idx}`}
              className={`rounded-2xl border flex flex-col justify-between p-6 sm:p-8 transition-transform duration-300 hover:-translate-y-1.5 ${
                tier.isPopular 
                  ? 'border-indigo-600 bg-slate-900 text-white shadow-lg shadow-indigo-950/30 ring-1 ring-indigo-500' 
                  : 'border-slate-200 bg-white text-slate-900 shadow-3xs'
              }`}
            >
              <div>
                {/* Popular Pill */}
                {tier.isPopular && (
                  <span className="inline-flex self-start items-center gap-1.5 rounded-full bg-indigo-500 text-white font-bold text-[9px] uppercase tracking-wider px-2.5 py-1 mb-4 select-none">
                    MOST POPULAR CHOSEN
                  </span>
                )}

                <div className="flex items-center justify-between mb-4">
                  <h3 className={`font-bold font-sans text-base ${tier.isPopular ? 'text-indigo-200' : 'text-slate-800'}`}>
                    {tier.name}
                  </h3>
                  <div className={`p-2 rounded-lg ${tier.isPopular ? 'bg-slate-800' : 'bg-indigo-50'}`}>
                    {tier.icon}
                  </div>
                </div>

                <div className="flex items-baseline gap-1 mb-6">
                  <span className={`text-4xl font-extrabold font-mono ${tier.isPopular ? 'text-white' : 'text-slate-900'}`}>{tier.price}</span>
                  <span className={`text-xs ${tier.isPopular ? 'text-slate-400' : 'text-slate-550'}`}>one-time fee</span>
                </div>

                <ul className="space-y-3 border-t pt-5 mb-8 border-slate-200 dark:border-slate-800" id={`license-features-${idx}`}>
                  {tier.features.map((feat) => (
                    <li key={feat} className="flex gap-2.5 items-start text-xs leading-relaxed">
                      <Check className={`h-4.5 w-4.5 shrink-0 mt-0.5 ${tier.isPopular ? 'text-indigo-400' : 'text-emerald-600'}`} />
                      <span className={tier.isPopular ? 'text-slate-300' : 'text-slate-650'}>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <button
                id={`buy-button-${idx}`}
                className={`w-full py-3 text-xs font-bold rounded-xl cursor-pointer transition-colors ${
                  tier.isPopular
                    ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs'
                    : 'bg-slate-900 hover:bg-slate-800 text-white'
                }`}
              >
                Acquire Register Code
              </button>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
