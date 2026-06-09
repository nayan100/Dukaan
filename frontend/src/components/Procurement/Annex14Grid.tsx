import React, { useMemo, useRef } from 'react';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { useVirtualizer } from '@tanstack/react-virtual';
import { FileSpreadsheet, AlertTriangle, CheckCircle2, Search, Filter, Download } from 'lucide-react';
import { motion } from 'framer-motion';

interface Annex14Entry {
  id: string;
  date: string;
  invoice_no: string;
  supplier_name: string;
  supplier_pan: string;
  taxable_amount: number;
  vat_amount: number;
  total_amount: number;
  status: 'verified' | 'flagged';
}

// Generate large mock dataset for virtualization testing
const generateMockData = (count: number): Annex14Entry[] => {
  return Array.from({ length: count }, (_, i) => ({
    id: `row-${i}`,
    date: '2026-06-09',
    invoice_no: `PUR-${1000 + i}`,
    supplier_name: i % 5 === 0 ? 'BhatBhateni Suppliers' : 'Global Trading Pvt Ltd',
    supplier_pan: i % 5 === 0 ? '304567890' : '601234567',
    taxable_amount: 5000 + i,
    vat_amount: (5000 + i) * 0.13,
    total_amount: (5000 + i) * 1.13 + (i % 7 === 0 ? 1 : 0), // Occasional rounding error
    status: i % 7 === 0 ? 'flagged' : 'verified',
  }));
};

const columnHelper = createColumnHelper<Annex14Entry>();

const columns = [
  columnHelper.accessor('date', {
    header: 'Date',
    cell: info => <span className="font-mono text-slate-400">{info.getValue()}</span>,
    size: 120,
  }),
  columnHelper.accessor('invoice_no', {
    header: 'Invoice #',
    cell: info => <span className="font-bold text-slate-100">{info.getValue()}</span>,
    size: 150,
  }),
  columnHelper.accessor('supplier_name', {
    header: 'Supplier & PAN',
    cell: info => (
      <div>
        <div className="font-bold text-slate-200">{info.getValue()}</div>
        <div className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">{info.row.original.supplier_pan}</div>
      </div>
    ),
    size: 250,
  }),
  columnHelper.accessor('taxable_amount', {
    header: () => <div className="text-right">Taxable</div>,
    cell: info => <div className="text-right font-mono text-slate-200">{info.getValue().toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>,
    size: 120,
  }),
  columnHelper.accessor('vat_amount', {
    header: () => <div className="text-right">VAT (13%)</div>,
    cell: info => <div className="text-right font-mono text-slate-200">{info.getValue().toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>,
    size: 120,
  }),
  columnHelper.accessor('total_amount', {
    header: () => <div className="text-right">Total</div>,
    cell: info => (
      <div className={`text-right font-mono font-black ${info.row.original.status === 'flagged' ? 'text-rose-500' : 'text-amber-500'}`}>
        रु {info.getValue().toLocaleString(undefined, { minimumFractionDigits: 2 })}
      </div>
    ),
    size: 150,
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
    size: 120,
  }),
];

const Annex14Grid: React.FC = () => {
  const data = useMemo(() => generateMockData(10000), []);
  const parentRef = useRef<HTMLDivElement>(null);
  
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const { rows } = table.getRowModel();

  const rowVirtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 72, // row height
    overscan: 10,
  });

  const virtualRows = rowVirtualizer.getVirtualItems();
  const totalSize = rowVirtualizer.getTotalSize();

  const paddingTop = virtualRows.length > 0 ? virtualRows[0].start : 0;
  const paddingBottom = virtualRows.length > 0 ? totalSize - virtualRows[virtualRows.length - 1].end : 0;

  return (
    <div className="flex flex-col h-full bg-slate-950">
      <header className="p-10 flex justify-between items-end bg-slate-950/80 backdrop-blur-md z-20 sticky top-0 border-b border-slate-900">
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

      <div ref={parentRef} className="flex-1 overflow-auto custom-scrollbar">
        <div style={{ height: `${totalSize}px`, position: 'relative' }}>
          <table className="w-full text-left border-collapse table-fixed">
            <thead className="sticky top-0 bg-slate-950 z-10 border-b border-slate-800 shadow-xl">
              {table.getHeaderGroups().map(headerGroup => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map(header => (
                    <th 
                      key={header.id} 
                      style={{ width: header.getSize() }}
                      className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-500"
                    >
                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {paddingTop > 0 && (
                <tr>
                  <td style={{ height: `${paddingTop}px` }} />
                </tr>
              )}
              {virtualRows.map(virtualRow => {
                const row = rows[virtualRow.index];
                return (
                  <motion.tr 
                    key={virtualRow.key} 
                    initial={{ opacity: 0 }} 
                    animate={{ opacity: 1 }}
                    className="hover:bg-amber-500/5 transition-colors group h-[72px]"
                  >
                    {row.getVisibleCells().map(cell => (
                      <td key={cell.id} className="px-6 py-4 text-sm border-b border-slate-900/50">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </motion.tr>
                );
              })}
              {paddingBottom > 0 && (
                <tr>
                  <td style={{ height: `${paddingBottom}px` }} />
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <footer className="p-6 bg-slate-950 border-t border-slate-900 flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-slate-600 z-20">
        <div>Nepal IRD Compliant Format (v4.0) • Virtualizing {data.length.toLocaleString()} rows</div>
        <div className="flex gap-8">
           <span>Total Taxable: रु {(data.reduce((s, d) => s + d.taxable_amount, 0)).toLocaleString()}</span>
           <span className="text-amber-500">Total VAT: रु {(data.reduce((s, d) => s + d.vat_amount, 0)).toLocaleString()}</span>
        </div>
      </footer>
    </div>
  );
};

export default Annex14Grid;
