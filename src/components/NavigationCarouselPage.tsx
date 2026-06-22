import React, { useState } from 'react';
import { CarouselItem } from '../types';

interface NavigationPageProps {
  items: CarouselItem[];
  activeIndex: number;
  onNavigate: (index: number) => void;
  itemsPerPage: number;
  setItemsPerPage: (itemsPerPage: number) => void;
}

export default function NavigationCarouselPage({ items, activeIndex, onNavigate, itemsPerPage, setItemsPerPage }: NavigationPageProps) {
  const pageCount = Math.ceil(items.length / itemsPerPage);
  const currentPage = Math.min(Math.floor(activeIndex / itemsPerPage), Math.max(0, pageCount - 1));

  const startIdx = currentPage * itemsPerPage;
  const endIdx = startIdx + itemsPerPage;
  const pageItems = items.slice(startIdx, endIdx);

  const handleItemClick = (index: number) => {
    // Navigate to the specific item index in the carousel
    onNavigate(index);
    window.location.hash = `item-${index}`;
  };

  const goToPage = (page: number) => {
    // Navigate to the first item of the target page
    const targetIndex = page * itemsPerPage;
    onNavigate(targetIndex);
  };

  return (
    <div className="flex flex-col h-full bg-slate-950 text-white rounded-2xl border border-slate-700 p-4">
      <div className="h-[20%] flex items-center justify-center border-b border-slate-700">
        <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider">Page {currentPage + 1} / {pageCount}</h3>
      </div>
      
      <div className="h-[60%] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-slate-900">
        <div className="grid grid-cols-1 gap-1">
          {pageItems.map((item, index) => (
            <button 
              key={item.id}
              onClick={() => handleItemClick(startIdx + index)}
              className={`text-left p-2 rounded flex gap-2 items-center text-xs ${
                activeIndex === startIdx + index ? 'bg-indigo-900/50 text-indigo-300' : 'hover:bg-slate-800 text-slate-300'
              }`}
            >
              <span className="font-mono text-slate-500 w-6">{startIdx + index + 1}.</span>
              <span className="truncate">{item.title}</span>
            </button>
          ))}
        </div>
      </div>
      
      <div className="h-[20%] flex flex-col gap-1 border-t border-slate-700 pt-2">
         <div className="flex justify-between items-center px-1">
            <button 
              disabled={currentPage === 0}
              onClick={() => goToPage(0)}
              className="px-3 py-1 bg-slate-800 rounded text-xs disabled:opacity-30 hover:bg-slate-700 text-slate-200"
            >
              First
            </button>
            <button 
              disabled={currentPage === Math.max(0, pageCount - 1)}
              onClick={() => goToPage(currentPage + 1)}
              className="px-3 py-1 bg-slate-800 rounded text-xs disabled:opacity-30 hover:bg-slate-700 text-slate-200"
            >
              Next
            </button>
         </div>
         <div className="flex justify-end items-center gap-2 px-1">
           <label className="text-[9px] text-slate-500 uppercase">Items per page:</label>
           <select 
             value={itemsPerPage} 
             onChange={(e) => setItemsPerPage(parseInt(e.target.value))} 
             className="bg-slate-800 text-[10px] rounded p-0.5 text-slate-300"
           >
             <option value={5}>5</option>
             <option value={10}>10</option>
             <option value={15}>15</option>
           </select>
         </div>
      </div>
    </div>
  );
}
