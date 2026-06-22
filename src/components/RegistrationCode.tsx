import React from 'react';
import { ShieldCheck, Zap, Infinity, CreditCard } from 'lucide-react';

export default function RegistrationCode() {
  return (
    <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm max-w-2xl mx-auto my-12 font-sans">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-indigo-100 rounded-full text-indigo-700">
          <ShieldCheck className="h-6 w-6" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Acquire Registration Code</h2>
      </div>

      <div className="bg-slate-50 border border-slate-100 rounded-xl p-6 mb-8">
        <h3 className="text-lg font-bold text-slate-900 mb-4 tracking-tight">Professional Marketing Statement</h3>
        <p className="text-slate-700 leading-relaxed italic">
          "Unlock the full potential of StarPlugins with our exclusive lifetime license. Experience seamless, high-performance, and fully customizable 3D orbital experiences—all with a single, one-time payment. No hidden fees, no ongoing subscriptions. Just pure, uncompromising creative control for as long as you use our software."
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="flex items-start gap-4">
          <Infinity className="h-8 w-8 text-indigo-600 mt-1" />
          <div>
            <h4 className="font-bold text-slate-900">Lifetime License</h4>
            <p className="text-sm text-slate-600">Enjoy full, unrestricted access forever, including all future feature updates and refinements.</p>
          </div>
        </div>
        <div className="flex items-start gap-4">
          <CreditCard className="h-8 w-8 text-indigo-600 mt-1" />
          <div>
            <h4 className="font-bold text-slate-900">1-Time Payment</h4>
            <p className="text-sm text-slate-600">No subscriptions, no hidden fees. A single, transparent payment validates your license for life.</p>
          </div>
        </div>
      </div>

      <div className="mt-8 pt-6 border-t border-slate-200 text-center">
        <button className="bg-indigo-600 text-white font-bold py-3 px-8 rounded-xl hover:bg-indigo-700 transition-colors flex items-center gap-2 mx-auto">
          <Zap className="h-4 w-4" />
          <span>Purchase Lifetime Code</span>
        </button>
      </div>
    </div>
  );
}
