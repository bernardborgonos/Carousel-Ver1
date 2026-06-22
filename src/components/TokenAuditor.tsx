import React, { useState } from 'react';
import { Database, HardDrive, Cpu, DollarSign, HelpCircle, ArrowUpRight, TrendingDown } from 'lucide-react';
import { TokenStats } from '../types';

export default function TokenAuditor() {
  // Typical weights and sprint token counters for AI Studio agent workflows
  const [iterations, setIterations] = useState<number>(4);
  const [avgContextSize, setAvgContextSize] = useState<number>(32000); // 32k tokens base

  // Derive tokens based on standard developer sprint math
  // Base request: 12,000 tokens. Each iteration adds the full context
  const inputTokens = avgContextSize * iterations;
  const outputTokens = 1800 * iterations; // Avg code output/turn
  // Context caching: AI Studio caches 100% of the preceding conversation steps 
  // after the first turn. Saving approx 75% on subsequent turns!
  const cachedTokens = avgContextSize * (iterations - 1);

  // GCP Gemini 1.5 Flash standard official public pricing models:
  // Input: $0.075 / 1 Million Tokens
  // Output: $0.30 / 1 Million Tokens
  // Cached: $0.01875 / 1 Million Tokens (75% cheaper input)
  const costInputRate = 0.075;
  const costOutputRate = 0.30;
  const costCachedRate = 0.01875;

  // Calculate costs in USD
  const costUncachedInput = (inputTokens / 1_000_000) * costInputRate;
  const costCachedInput = (cachedTokens / 1_000_000) * costCachedRate + ((inputTokens - cachedTokens) / 1_000_000) * costInputRate;
  const costOutput = (outputTokens / 1_000_000) * costOutputRate;
  
  const finalTotalCost = costCachedInput + costOutput;
  const standardCostNoCache = costUncachedInput + costOutput;
  const totalSavingsPct = standardCostNoCache > 0 ? ((standardCostNoCache - finalTotalCost) / standardCostNoCache) * 100 : 0;

  // Compare against traditional developer hourly rate: $55/hr, assuming a 6-hour recreation sprint = $330.00
  const humanSalaryEquivalent = 330.00;
  const humanSavingsFactor = ((humanSalaryEquivalent - finalTotalCost) / humanSalaryEquivalent) * 100;

  return (
    <section className="py-12 bg-white" id="token-auditor-section">
      <div className="mx-auto max-w-5xl px-6">
        
        {/* Header */}
        <div className="mb-10" id="auditor-header">
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">Resource Ledger</span>
          <h2 className="mt-2 text-2xl font-bold text-slate-900 sm:text-3xl">AI Studio Token Resource Audit</h2>
          <p className="mt-2 text-slate-600 max-w-xl text-xs sm:text-sm">
            Budget logging and transaction transparency. Account for input/output volumes, index caching buffers, and total cost estimations.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8" id="auditor-grid">
          
          {/* Controls Panel */}
          <div className="md:col-span-5 flex flex-col gap-6 rounded-2xl border border-slate-200 bg-slate-50/50 p-6" id="auditor-controls">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-1.5 border-b border-slate-200 pb-2">
              <Cpu className="h-4 w-4 text-indigo-600" /> Sprint Variables Slider
            </h3>

            {/* Conversation Turns (Iterations) */}
            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-baseline">
                <label className="text-xs font-semibold text-slate-700">Conversational Sprint Turns</label>
                <span className="text-xs font-mono font-bold text-indigo-600">{iterations} turns</span>
              </div>
              <input
                type="range"
                min="1"
                max="15"
                value={iterations}
                onChange={(e) => setIterations(parseInt(e.target.value))}
                className="w-full accent-indigo-600 bg-slate-250 h-1 rounded cursor-pointer"
              />
              <p className="text-[10px] text-slate-400">Total chat back-and-forth prompt updates with your Coding Agent.</p>
            </div>

            {/* Average Context Size (Tokens) */}
            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-baseline">
                <label className="text-xs font-semibold text-slate-700">Project Context Weight</label>
                <span className="text-xs font-mono font-bold text-indigo-600">{avgContextSize.toLocaleString()} tokens</span>
              </div>
              <input
                type="range"
                min="5000"
                max="100000"
                step="5000"
                value={avgContextSize}
                onChange={(e) => setAvgContextSize(parseInt(e.target.value))}
                className="w-full accent-indigo-600 bg-slate-250 h-1 rounded cursor-pointer"
              />
              <p className="text-[10px] text-slate-400">Combined character weight of files (HTML/CSS/TS) + prompt instructions.</p>
            </div>

            {/* Model Info footnote */}
            <div className="flex gap-2 p-3 bg-indigo-50/40 border border-indigo-100 rounded-lg text-[10px] text-indigo-800 leading-relaxed">
              <HelpCircle className="h-4 w-4 text-indigo-500 shrink-0 mt-0.5" />
              <span>
                <strong>System Note:</strong> Generatively compiled on the state-of-the-art <strong>Gemini 1.5 Flash / 2.0</strong> model infrastructure.
              </span>
            </div>
          </div>

          {/* Results Audit Board */}
          <div className="md:col-span-7 flex flex-col gap-4" id="auditor-display">
            
            {/* Visual token ratios stack */}
            <div className="rounded-2xl border border-slate-200 p-6 flex flex-col gap-4 bg-white shadow-3xs" id="auditor-stacks">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-widest">Calculated Token Breakdown</h4>
              
              {/* Stacked bar visualization */}
              <div className="flex h-6 rounded-lg overflow-hidden border border-slate-200">
                <div 
                  style={{ width: `${(cachedTokens / (inputTokens + outputTokens)) * 100}%` }}
                  className="bg-indigo-600 text-white flex items-center justify-center text-[10px] font-mono font-bold"
                  title="Cached Context input"
                >
                  {cachedTokens > 0 ? 'Cache' : ''}
                </div>
                <div 
                  style={{ width: `${((inputTokens - cachedTokens) / (inputTokens + outputTokens)) * 100}%` }}
                  className="bg-sky-500 text-white flex items-center justify-center text-[10px] font-mono font-bold"
                  title="Fresh Context input"
                >
                  Raw Input
                </div>
                <div 
                  style={{ width: `${(outputTokens / (inputTokens + outputTokens)) * 100}%` }}
                  className="bg-emerald-500 text-white flex items-center justify-center text-[10px] font-mono font-bold"
                  title="Generated model output"
                >
                  Out
                </div>
              </div>

              {/* Data Table */}
              <div className="grid grid-cols-3 gap-3 text-center text-xs leading-tight" id="token-values-summary">
                <div className="flex flex-col p-2 bg-slate-50 border border-slate-100 rounded-lg">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Context Cache</span>
                  <span className="mt-1 font-mono font-bold text-indigo-700"> {cachedTokens.toLocaleString()} </span>
                  <span className="text-[9px] text-slate-400">Tokens</span>
                </div>

                <div className="flex flex-col p-2 bg-slate-50 border border-slate-100 rounded-lg">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Fresh Input</span>
                  <span className="mt-1 font-mono font-bold text-sky-600"> {(inputTokens - cachedTokens).toLocaleString()} </span>
                  <span className="text-[9px] text-slate-400">Tokens</span>
                </div>

                <div className="flex flex-col p-2 bg-slate-50 border border-slate-100 rounded-lg">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Model Output</span>
                  <span className="mt-1 font-mono font-bold text-emerald-600"> {outputTokens.toLocaleString()} </span>
                  <span className="text-[9px] text-slate-400">Tokens</span>
                </div>
              </div>
            </div>

            {/* Financial summaries */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4" id="financial-ledger-panels">
              
              {/* API costs panel */}
              <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-3xs" id="api-costs-ledger">
                <span className="text-2xs font-extrabold text-slate-400 uppercase tracking-wider block">Sprint GCP Expense</span>
                <p className="mt-1 text-2xl font-extrabold text-slate-900 font-mono flex items-baseline gap-1">
                  ${finalTotalCost.toFixed(5)} <span className="text-2xs font-sans text-slate-400">USD</span>
                </p>
                <div className="mt-3 flex items-center gap-1 text-[10px] text-emerald-600 font-bold bg-emerald-50 px-2 py-1 rounded" id="ledger-savings-p">
                  <TrendingDown className="h-3.5 w-3.5" />
                  <span>Saved {totalSavingsPct.toFixed(1)}% via context cache</span>
                </div>
              </div>

              {/* Developer compensation compare */}
              <div className="rounded-xl border border-indigo-100 bg-indigo-50/30 p-5 shadow-3xs" id="salary-compare-ledger">
                <span className="text-2xs font-extrabold text-indigo-600 uppercase tracking-wider block">Human Dev Devry Cost</span>
                <p className="mt-1 text-2xl font-extrabold text-slate-950 font-mono flex items-baseline gap-1">
                  ${humanSalaryEquivalent.toFixed(2)} <span className="text-2xs font-sans text-slate-500">USD</span>
                </p>
                <div className="mt-3 flex items-center gap-1.5 text-[10px] text-indigo-700 font-semibold uppercase tracking-wide">
                  <ArrowUpRight className="h-3.5 w-3.5 text-indigo-600" />
                  <span>{humanSavingsFactor.toFixed(3)}% budget relief</span>
                </div>
              </div>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
