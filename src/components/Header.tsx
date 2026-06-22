import React from 'react';
import { Sparkles, Terminal, Code2, Globe } from 'lucide-react';

export default function Header() {
  return (
    <header className="relative w-full overflow-hidden border-b border-slate-200/80 bg-[#fafafa]" id="main-header">
      {/* Decorative ambient background blur */}
      <div className="absolute right-10 top-0 -z-10 h-72 w-72 rounded-full bg-indigo-400/10 blur-3xl" />
      <div className="absolute left-1/4 bottom-0 -z-10 h-48 w-48 rounded-full bg-emerald-400/10 blur-3xl" />

      <div className="mx-auto max-w-5xl px-6 py-12 md:py-20">
        {/* Upper Breadcrumb or Tagline */}
        <div className="flex flex-wrap items-center gap-3 mb-6" id="header-tags">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700">
            <Sparkles className="h-3 w-3 animate-pulse" /> Live Verification Demo
          </span>
          <span className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-600">
            <Terminal className="h-3 w-3 text-slate-400" /> React 19 + Tailwind v4
          </span>
        </div>

        {/* Hero Headline */}
        <h1 className="font-sans text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl md:text-6xl" id="hero-title">
          Can I build websites with <span className="bg-gradient-to-r from-indigo-600 via-violet-600 to-indigo-700 bg-clip-text text-transparent">Google AI Studio</span>?
        </h1>

        {/* Main Answer text */}
        <p className="mt-6 max-w-3xl text-lg leading-relaxed text-slate-600 sm:text-xl" id="hero-subtitle">
          <strong className="font-semibold text-slate-900">Absolutely, yes.</strong> Google AI Studio Build provides a complete full-stack environment where you can prototype, code, test, and deploy interactive web apps and responsive websites in real-time.
        </p>

        {/* Feature Highlights Row */}
        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-3" id="quick-benefits">
          <div className="flex items-start gap-3 rounded-xl border border-slate-200/60 bg-white p-4 shadow-xs" id="benefit-1">
            <div className="rounded-lg bg-indigo-50 p-2 text-indigo-600">
              <Code2 className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 text-sm">Dynamic React Architecture</h3>
              <p className="mt-1 text-xs text-slate-500">Component-driven modular design running seamlessly with Vite.</p>
            </div>
          </div>

          <div className="flex items-start gap-3 rounded-xl border border-slate-200/60 bg-white p-4 shadow-xs" id="benefit-2">
            <div className="rounded-lg bg-emerald-50 p-2 text-emerald-600">
              <Globe className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 text-sm">Tailwind CSS Utility Style</h3>
              <p className="mt-1 text-xs text-slate-500">Perfect design layouts matching arbitrary user specifications instantly.</p>
            </div>
          </div>

          <div className="flex items-start gap-3 rounded-xl border border-slate-200/60 bg-white p-4 shadow-xs" id="benefit-3">
            <div className="rounded-lg bg-violet-50 p-2 text-violet-600">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 text-sm">Full-Stack Capabilities</h3>
              <p className="mt-1 text-xs text-slate-500">Enable cloud database storage, Auth, and custom API routes easily.</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
