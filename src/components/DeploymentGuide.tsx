import React, { useState } from 'react';
import { Download, Github, Cloud, ShieldAlert, CheckCircle, ExternalLink } from 'lucide-react';

export default function DeploymentGuide() {
  const [activeStep, setActiveStep] = useState<number>(0);

  const steps = [
    {
      title: 'Export / Sync Code',
      icon: <Download className="h-5 w-5" />,
      subtitle: 'Retrieve the pristine local source workspace files.',
      details: [
        'Open the top-right Settings/Export menu in the Google AI Studio UI framework.',
        'Choose Download as ZIP to save the entire source files (including configurations like package.json, vite.config.ts, tsconfig.json, etc.) directly onto your local laptop.',
        'Unzip the files on your local drive and run standard NPM setup steps: \`npm install\` followed by \`npm run dev\` to boot up VITE locally on port 3000.'
      ]
    },
    {
      title: 'GitHub Repository Sync',
      icon: <Github className="h-5 w-5" />,
      subtitle: 'Commit changes straight into version control databases.',
      details: [
        'Connect your absolute GitHub user account by pressing the "Export to GitHub" toggle within the settings drawer.',
        'Select or create a safe destination target directory repository under your username profile credentials.',
        'Every structural codebase file we build here replicates instantly onto your master code branches, enabling seamless team pull request reviews, branches, and continuous workflows.'
      ]
    },
    {
      title: 'Cloud Run / Static Hosting',
      icon: <Cloud className="h-5 w-5" />,
      subtitle: 'Deliver your compiled frontend files onto global networks.',
      details: [
        'This environment runs natively within robust isolated Cloud Run container frames.',
        'By tapping the "Deploy to Cloud Run" feature within AI Studio, your customized layouts undergo automatic standard builds, provisioning a permanent public HTTPS domain link.',
        'For pure client-only SPAs, you can also easily deploy files directly onto free static setups like GitHub Pages, Vercel, Netlify, or Firebase Hosting by transferring the auto-generated \`dist/\` folder contents.'
      ]
    }
  ];

  return (
    <section className="py-12 bg-white" id="deployment-guide-section">
      <div className="mx-auto max-w-5xl px-6">
        <div className="mb-10" id="deployment-header">
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">Continuous Integration</span>
          <h2 className="mt-2 text-2xl font-bold text-slate-900 sm:text-3xl">How to Take Your Website Live</h2>
          <p className="mt-2 text-slate-600 max-w-xl">
            You are never locked into AI Studio. Your code compiles cleanly, allowing you to instantly export or host anywhere.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-12" id="deployment-grid">
          {/* Navigation/Steps list */}
          <div className="md:col-span-4 flex flex-col gap-2" id="deployment-steps-list">
            {steps.map((step, index) => (
              <button
                key={index}
                id={`btn-step-${index}`}
                onClick={() => setActiveStep(index)}
                className={`flex items-start gap-3 rounded-xl border p-4 text-left transition-all cursor-pointer ${
                  activeStep === index
                    ? 'border-indigo-600 bg-indigo-50/20 text-indigo-800 shadow-2xs'
                    : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50/50 text-slate-600'
                }`}
              >
                <div className={`rounded-lg p-1.5 ${activeStep === index ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-500'}`}>
                  {step.icon}
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-xs sm:text-sm">{step.title}</h4>
                  <p className="mt-0.5 text-2xs text-slate-500 line-clamp-1">{step.subtitle}</p>
                </div>
              </button>
            ))}
          </div>

          {/* Details viewer card */}
          <div className="md:col-span-8 rounded-2xl border border-slate-200 bg-slate-50/40 p-6 sm:p-8" id="deployment-details-viewer">
            <div className="flex items-center gap-2 mb-4">
              <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-indigo-100 text-xs font-bold text-indigo-700">
                {activeStep + 1}
              </span>
              <h3 className="font-bold text-slate-900 text-lg">{steps[activeStep].title}</h3>
            </div>
            
            <p className="text-slate-600 text-xs mb-6 italic leading-relaxed">
              {steps[activeStep].subtitle}
            </p>

            <ul className="space-y-4" id="step-details-bullets">
              {steps[activeStep].details.map((detail, idx) => (
                <li key={idx} className="flex gap-3 items-start text-xs sm:text-xs text-slate-600 leading-relaxed">
                  <CheckCircle className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{detail}</span>
                </li>
              ))}
            </ul>

            <div className="mt-8 pt-6 border-t border-slate-200 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-1.5 text-2xs text-slate-500">
                <ShieldAlert className="h-3.5 w-3.5 text-amber-500" />
                <span>Standard code exports conform under Apache-2.0 open-source rules.</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
