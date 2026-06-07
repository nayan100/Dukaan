import React from 'react';
import { motion } from 'framer-motion';
import { AlertCircle, FileText, CheckCircle, Clock } from 'lucide-react';

export interface PO {
  id: string;
  supplier: string;
  amount: number;
  status: string;
  budgetViolation: boolean;
  date: string;
}

interface POListViewProps {
  pos: PO[];
}

const POListView: React.FC<POListViewProps> = ({ pos }) => {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Draft': return <FileText className="w-4 h-4 text-pos-muted" />;
      case 'Pending Approval': return <Clock className="w-4 h-4 text-pos-secondary" />;
      case 'Approved': return <CheckCircle className="w-4 h-4 text-pos-primary" />;
      default: return null;
    }
  };

  const getStatusStyles = (status: string) => {
    switch (status) {
      case 'Draft': return 'bg-pos-muted/10 text-pos-muted border-pos-muted/20';
      case 'Pending Approval': return 'bg-pos-secondary/10 text-pos-secondary border-pos-secondary/20';
      case 'Approved': return 'bg-pos-primary/10 text-pos-primary border-pos-primary/20';
      default: return 'bg-pos-surface text-pos-white border-pos-border';
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
      {pos.map((po) => (
        <motion.div
          key={po.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-pos-surface border border-pos-border rounded-pos p-4 shadow-lg hover:border-pos-primary/50 transition-colors relative overflow-hidden"
        >
          {po.budgetViolation && (
            <div className="absolute top-0 right-0 bg-pos-danger text-white text-[10px] font-bold px-2 py-0.5 rounded-bl-pos flex items-center gap-1 animate-pulse">
              <AlertCircle className="w-3 h-3" />
              BUDGET VIOLATION
            </div>
          )}

          <div className="flex justify-between items-start mb-3">
            <div>
              <h3 className="text-pos-white font-bold text-lg">{po.id}</h3>
              <p className="text-pos-muted text-sm">{po.supplier}</p>
            </div>
            <div className={`px-2 py-1 rounded-full text-xs font-medium border flex items-center gap-1 ${getStatusStyles(po.status)}`}>
              {getStatusIcon(po.status)}
              {po.status}
            </div>
          </div>

          <div className="flex justify-between items-end mt-4">
            <div className="text-pos-muted text-xs">
              {new Date(po.date).toLocaleDateString()}
            </div>
            <div className="text-pos-primary font-mono font-bold text-xl">
              रु {po.amount.toLocaleString()}
            </div>
          </div>

          {po.budgetViolation && (
             <div className="mt-3 text-pos-danger text-xs font-medium flex items-center gap-1 bg-pos-danger/5 p-2 rounded-md border border-pos-danger/20">
                <AlertCircle className="w-3 h-3" />
                This PO exceeds the allocated branch budget.
             </div>
          )}
        </motion.div>
      ))}
    </div>
  );
};

export default POListView;
