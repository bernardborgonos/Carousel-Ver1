import React from 'react';
import { Layers, Cpu, Shield, Database, Layout, ArrowRight } from 'lucide-react';

export default function TechStackGrid() {
  const technologies = [
    {
      icon: <Layout className="h-5 w-5 text-indigo-600" />,
      name: 'Vite & React SPA / Fullstack',
      description: 'Standard modern frontend toolset supporting modular components, quick runtime compiles, and standard routing engines.',
      tag: 'Frontend Core'
    },
    {
      icon: <Layers className="h-5 w-5 text-blue-600" />,
      name: 'Tailwind CSS v4',
      description: 'Direct styling mechanism configured straight out of Vite. No complex manual asset setups; fully responsive and custom themes are ready out-of-the-box.',
      tag: 'Styling engine'
    },
    {
      icon: <Cpu className="h-5 w-5 text-purple-600" />,
      name: 'Express API Server Proxy',
      description: 'Optionally spin up custom Node.js Express APIs on port 3000 to keep client data private and proxy secure requests without exposing API keys.',
      tag: 'Backend Layer'
    },
    {
      icon: <Database className="h-5 w-5 text-emerald-600" />,
      name: 'Durable Cloud Persistence',
      description: 'Integrates on-demand with Firebase (Firestore) and Cloud SQL (PostgreSQL relational database) for user accounts, records, or rich data saving.',
      tag: 'Storage & DB'
    },
    {
      icon: <Shield className="h-5 w-5 text-rose-600" />,
      name: 'OAuth & Credentials Security',
      description: 'Easily set up external API hooks (Strava, Gmail, GitHub, Calendar) using secure platform-managed OAuth clients and scope verification layers.',
      tag: 'Auth & Middleware'
    },
    {
      icon: <Layers className="h-5 w-5 text-amber-600" />,
      name: 'Antigravity / Gemini Native API',
      description: 'Incorporate server-side AI integrations seamlessly using the latest `@google/genai` TypeScript SDK without ever leaking sensitive secrets to the client.',
      tag: 'Cognitive Engine'
    }
  ];

  return (
    <section className="py-12" id="tech-stack-section">
      <div className="mx-auto max-w-5xl px-6">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-10" id="tech-stack-header">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">Built-in Capabilities</span>
            <h2 className="mt-2 text-2xl font-bold text-slate-900 sm:text-3xl">Professional Engineering Arsenal</h2>
            <p className="mt-2 text-slate-600 max-w-xl">
              We compile code down to industry-standard outputs. No sandbox locks; use actual frameworks.
            </p>
          </div>
          <div className="mt-4 md:mt-0">
            <span className="inline-flex items-center gap-1.5 text-xs text-indigo-600 font-semibold bg-indigo-50/50 hover:bg-indigo-50 px-3 py-1.5 rounded-lg border border-indigo-100 transition-colors">
              Standard build: `npm run build` <ArrowRight className="h-3 w-3" />
            </span>
          </div>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3" id="tech-grid">
          {technologies.map((tech, index) => (
            <div 
              key={index}
              id={`tech-card-${index}`} 
              className="group flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-6 shadow-xs hover:border-indigo-200 hover:shadow-md transition-all duration-300"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center rounded-md bg-slate-50 px-2 py-0.5 text-2xs font-medium text-slate-600 border border-slate-100">
                    {tech.tag}
                  </span>
                  <div className="rounded-lg bg-slate-50 p-1.5 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-all duration-300">
                    {tech.icon}
                  </div>
                </div>
                <h3 className="mt-4 font-semibold text-slate-900 text-base">{tech.name}</h3>
                <p className="mt-2 text-xs leading-relaxed text-slate-500">{tech.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
