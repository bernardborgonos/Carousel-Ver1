import React, { useState } from 'react';
import { HelpCircle, ChevronRight, ChevronDown, CheckCircle2 } from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

const FAQS: FAQItem[] = [
  {
    question: 'How do I add server-side API endpoints or backends?',
    answer: 'Simply write backend handlers in an Express framework (usually inside a `server.ts` setup) configured to serve custom routers. This lets you proxy third-party SDK calls (like Stripe, Twilio or Google APIs) safely. The AI Studio build system compiles everything to a single bundle for server execution.',
    category: 'capabilities'
  },
  {
    question: 'Can I integrate dynamic DB storage for user logging accounts?',
    answer: 'Yes! AI Studio provides automated zero-setup provisioning of Firebase (Firestore and Firebase Authentication) or Cloud SQL (PostgreSQL relational tables). Once provisioned, you get environment variables injected automatically, giving you durable cloud persistence in minutes.',
    category: 'database'
  },
  {
    question: 'Is it possible to use external NPM libraries listed in my projects?',
    answer: 'Absolutely. You can import any normal library available on npmjs.com. In the AI Studio Build chat drawer, you can ask your AI Coding agent to install dependencies like Tailwind plugins, chart loaders (recharts, d3), icons, Markdown parsers, or third-party OAuth helper libraries.',
    category: 'getting-started'
  },
  {
    question: 'Can I map custom domain prefixes when taking apps public?',
    answer: 'Yes. Once you utilize the Cloud Run continuous integration workflow, your deployed URL gets generated on secure GCP services. Within your secure Google Cloud administrator console, you can easily config custom DNS settings, redirect rules, CNAME maps, and automated SSL cert signatures.',
    category: 'deployment'
  }
];

export default function FAQSection() {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(0);

  const toggleExpand = (idx: number) => {
    setExpandedIndex(expandedIndex === idx ? null : idx);
  };

  return (
    <section className="py-12 bg-slate-50/50 border-t border-slate-200" id="faq-section">
      <div className="mx-auto max-w-3xl px-6">
        <div className="text-center mb-10" id="faq-headline">
          <span className="inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-indigo-600 bg-indigo-50/70 px-2.5 py-1 rounded-full border border-indigo-100">
            <HelpCircle className="h-3.5 w-3.5" /> Frequently Asked Questions
          </span>
          <h2 className="mt-4 text-2xl font-bold text-slate-900 sm:text-3xl">Cleared Confusions</h2>
          <p className="mt-2 text-slate-500 text-xs sm:text-sm">
            Everything you need to know about the development boundaries of Google AI Studio apps.
          </p>
        </div>

        <div className="space-y-4" id="faq-accordion-group">
          {FAQS.map((faq, index) => {
            const isExpanded = expandedIndex === index;
            return (
              <div
                key={index}
                id={`faq-item-${index}`}
                className="group rounded-xl border border-slate-200/80 bg-white shadow-3xs transition-all duration-200 hover:border-slate-300"
              >
                <button
                  onClick={() => toggleExpand(index)}
                  className="w-full flex items-center justify-between gap-4 p-5 text-left font-semibold text-slate-900 text-sm focus:outline-none cursor-pointer"
                  id={`faq-btn-${index}`}
                >
                  <span className="group-hover:text-indigo-600 transition-colors">{faq.question}</span>
                  <span className="shrink-0 rounded-lg bg-slate-100 p-1 text-slate-500 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-all">
                    {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                  </span>
                </button>

                {isExpanded && (
                  <div className="border-t border-slate-100 px-5 py-4 bg-slate-50/50" id={`faq-answer-${index}`}>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                      {faq.answer}
                    </p>
                    <div className="mt-3 flex items-center gap-1.5" id={`faq-pill-${index}`}>
                      <CheckCircle2 className="h-3.5 w-3.5 text-indigo-500" />
                      <span className="text-[10px] font-bold text-indigo-700 uppercase tracking-widest">{faq.category} certified</span>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
