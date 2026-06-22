import React from 'react';
import { Download } from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import DeploymentGuide from './DeploymentGuide';
import DocumentationTable from './DocumentationTable';
import { KillerCarouselOptions } from '../types';

interface DocumentationPageProps {
  options: KillerCarouselOptions;
}

export default function DocumentationPage({ options }: DocumentationPageProps) {
  
  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    
    // Add title
    doc.setFontSize(22);
    doc.text('StarPlugins Documentation', 20, 20);
    
    // Add User Manual section
    doc.setFontSize(16);
    doc.text('User Manual', 20, 40);
    doc.setFontSize(12);
    doc.text('This carousel provides a 3D orbital interface for product showcases.', 20, 50);
    
    // Add Technical Manual section
    doc.setFontSize(16);
    doc.text('Technical Developer Manual', 20, 70);
    
    // Add parameters table
    autoTable(doc, {
      startY: 80,
      head: [['Parameter', 'Type', 'Default', 'Current', 'Description']],
      body: [
        ['width', 'integer', '300', `${options.width}px`, 'The width of each carousel item card.'],
        ['height', 'integer', '220', `${options.height}px`, 'The height of each carousel item card.'],
        ['perspective', 'integer', '1200', `${options.perspective}px`, '3D perspective camera focal length.'],
        ['xRadius', 'integer', '320', `${options.xRadius}px`, 'Horizontal circular offset radius.'],
        ['zRadius', 'integer', '220', `${options.zRadius}px`, 'Depth reach.'],
        ['tilt', 'integer', '0', `${options.tilt}°`, 'Angles orbital rotation plane.'],
      ],
    });
    
    doc.save('documentation.pdf');
  };

  return (
    <div className="py-12 bg-slate-50" id="docs-page">
      <div className="mx-auto max-w-5xl px-6">
        <div className="flex items-center justify-between mb-10">
          <h1 className="text-3xl font-bold text-slate-900">Documentation & Manual</h1>
          <button
            onClick={handleDownloadPDF}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            <Download className="h-4 w-4" />
            Download PDF
          </button>
        </div>

        <div className="space-y-12">
            <DeploymentGuide />
            <DocumentationTable options={options}/>
        </div>
      </div>
    </div>
  );
}
