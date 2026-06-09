import React, { useMemo } from 'react';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { FileSpreadsheet, AlertTriangle, CheckCircle2, Search, Filter, Download } from 'lucide-react';
import { motion } from 'framer-motion';

interface Annex14Entry {
  date: string;
  invoice_no: string;
  supplier_name: string;
  supplier_pan: string;
  taxable_amount: number;
  vat_amount: number;
  total_amount: number;
  status: 'verified' | 'flagged';
}

const mockData: Annex14Entry[] = [
  { 
    date: '2026-06-09', 
    invoice_no: 'PUR-001', 
    supplier_name: 'Global Trading Pvt Ltd', 
    supplier_pan: '601234567', 
    taxable_amount: 10000, 
    vat_amount: 1300, 
    total_amount: 11300, 
    status: 'verified' 
  },
  { 
    date: '2026-06-09', 
    invoice_no: 'PUR-002', 
    supplier_name: 'BhatBhateni Suppliers', 
    supplier_pan: '304567890', 
    taxable_amount: 5000, 
    vat_amount: 650, 
    total_amount: 5651, // Rounding error
    status: 'flagged' 
  },
];

const columnHelper = createColumnHelper<Annex14Entry>();

const columns = [
  columnHelper.accessor('date', {
    header: 'Date',
    cell: info => <span className="font-mono text-slate-400">{info.getValue()}</span>,
  }),
  columnHelper.accessor('invoice_no', {
    header: 'Invoice #',
    cell: info => <span className="font-bold text-slate-100">{info.getValue()}</span>,
  }),
  columnHelper.accessor('supplier_name', {
    header: 'Supplier & PAN',
    cell: info => (
      <div>
        <div className="font-bold text-slate-200">{info.getValue()}</div>
        <div className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">{info.row.original.supplier_pan}</div>
      </div>
    ),
  }),
  columnHelper.accessor('taxable_amount', {
    header: () => <div className="text-right">Taxable</div>,
    cell: info => <div className="text-right font-mono text-slate-200">{info.getValue().toLocaleString()}</div>,
  }),
  columnHelper.accessor('vat_amount', {
    header: () => <div className="text-right">VAT (13%)</div>,
    cell: info => <div className="text-right font-mono text-slate-200">{info.getValue().toLocaleString()}</div>,
  }),
  columnHelper.accessor('total_amount', {
    header: () => <div className="text-right">Total</div>,
    cell: info => (
      <div className={`text-right font-mono font-black ${info.row.original.status === 'flagged' ? 'text-rose-500' : 'text-amber-500'}`}>
        रु {info.getValue().toLocaleString()}
      </div>
    ),
  }),
  columnHelper.accessor('status', {
    header: () => <div className="text-center">Compliance</div>,
    cell: info => (
      <div className="flex justify-center">
        {info.getValue() === 'verified' ? (
          <div className="flex items-center gap-1 bg-emerald-500/10 text-emerald-500 px-2 py-1 rounded-full text-[10px] font-black uppercase">
            <CheckCircle2 size={12} /> Verified
          </div>
        ) : (
          <div className="flex items-center gap-1 bg-rose-500/10 text-rose-500 px-2 py-1 rounded-full text-[10px] font-black uppercase">
            <AlertTriangle size={12} /> Error
          </div>
        )}
      </div>
    ),
  }),
];

const Annex14Grid: React.FC = () => {
  const data = useMemo(() => mockData, []);
  
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="p-10 space-y-8 min-h-full bg-slate-950">
      <header className="flex justify-between items-end">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <FileSpreadsheet className="text-amber-500" size={24} />
            <span className="text-xs font-black uppercase tracking-[0.3em] text-amber-500/80">Fiscal Audit Layer</span>
          </div>
          <h1 className="text-4xl font-black tracking-tighter uppercase italic text-slate-100">Annex 14: Purchase Register</h1>
        </div>

        <div className="flex gap-4">
          <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 focus-within:border-amber-500/50 transition-all">
            <Search size={16} className="text-slate-500" />
            <input 
              type="text" 
              placeholder="Search invoices, suppliers..." 
              className="bg-transparent border-none outline-none text-sm text-slate-200 placeholder:text-slate-600 w-64"
            />
          </div>
          <button className="flex items-center gap-2 bg-slate-900 border border-slate-800 p-3 rounded-xl text-slate-400 hover:text-slate-100 transition-all hover:bg-slate-800">
            <Filter size={18} />
          </button>
          <button className="flex items-center gap-2 bg-amber-500 text-slate-950 px-6 py-3 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-amber-400 transition-all shadow-xl shadow-amber-500/10">
            <Download size={16} /> Export IRD
          </button>
        </div>
      </header>

      <div className="bg-slate-900/50 border border-slate-800 rounded-2xl overflow-hidden backdrop-blur-xl">
        <table className="w-full text-left border-collapse">
          <thead>
            {table.getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id} className="bg-slate-950/50 border-b border-slate-800">
                {headerGroup.headers.map(header => (
                  <th key={header.id} className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-500">
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="divide-y divide-slate-800/50">
            {table.getRowModel().rows.map(row => (
              <motion.tr 
                key={row.id} 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }}
                className="hover:bg-amber-500/5 transition-colors group"
              >
                {row.getVisibleCells().map(cell => (
                  <td key={cell.id} className="px-6 py-4 text-sm">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      <footer className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-slate-600 border-t border-slate-800 pt-6">
        <div>Nepal IRD Compliant Format (v4.0)</div>
        <div className="flex gap-8">
           <span>Taxable: रु 15,000.00</span>
           <span>VAT: रु 1,950.00</span>
           <span className="text-amber-500">Total: रु 16,951.00</span>
        </div>
      </footer>
    </div>
  );
};

export default Annex14Grid;
