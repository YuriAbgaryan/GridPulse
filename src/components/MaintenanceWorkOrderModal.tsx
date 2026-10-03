import React, { useState } from 'react';
import { GridAlert } from '../types/grid';
import {
  Wrench,
  X,
  CheckCircle2,
  Clock,
  ShieldAlert,
  UserCheck,
  Truck,
  HardHat
} from 'lucide-react';

interface MaintenanceWorkOrderModalProps {
  alert: GridAlert | null;
  onClose: () => void;
  onConfirmWorkOrder: (alertId: string, details: { crew: string; priority: string; notes: string }) => void;
}

export const MaintenanceWorkOrderModal: React.FC<MaintenanceWorkOrderModalProps> = ({
  alert,
  onClose,
  onConfirmWorkOrder,
}) => {
  if (!alert) return null;

  const [assignedCrew, setAssignedCrew] = useState<string>('Crew-Lori-04 (Vanadzor Substation Team)');
  const [priority, setPriority] = useState<string>('urgent');
  const [equipment, setEquipment] = useState<string>('Transformer Oil Sampling Kit & Thermal FLIR Camera');
  const [notes, setNotes] = useState<string>(alert.recommendedAction);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitted, setSubmitted] = useState<boolean>(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
      onConfirmWorkOrder(alert.id, {
        crew: assignedCrew,
        priority,
        notes,
      });
      setTimeout(() => {
        onClose();
      }, 1200);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
      <div className="bg-[#121824] border border-slate-700/80 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-500/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
              <HardHat className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                Dispatch Maintenance Work Order
              </h3>
              <p className="text-xs text-slate-400 font-mono">
                Work Order Reference: WO-{alert.id}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {submitted ? (
          <div className="p-8 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h4 className="text-base font-bold text-white">
              Work Order Successfully Dispatched
            </h4>
            <p className="text-xs text-slate-400 font-mono">
              Assigned to {assignedCrew} · Telemetry notification broadcast to field tablets.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-5 space-y-4">
            {/* Target Information */}
            <div className="p-3 bg-slate-900/80 border border-slate-800 rounded-xl space-y-1 text-xs">
              <div className="text-slate-400">Target Asset / Incident:</div>
              <div className="font-bold text-white">{alert.title}</div>
              <div className="text-slate-400 font-mono">
                {alert.substation} · {alert.region}
              </div>
            </div>

            {/* Crew Selection */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Assigned ENA Maintenance Crew
              </label>
              <select
                value={assignedCrew}
                onChange={e => setAssignedCrew(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-blue-500 cursor-pointer"
              >
                <option value="Crew-Lori-04 (Vanadzor Substation Team)">
                  Crew-Lori-04 (Vanadzor Substation Team)
                </option>
                <option value="Crew-Shirak-02 (Gyumri High-Voltage Team)">
                  Crew-Shirak-02 (Gyumri High-Voltage Team)
                </option>
                <option value="Crew-Yerevan-01 (Capital Transmission Team)">
                  Crew-Yerevan-01 (Capital Transmission Team)
                </option>
                <option value="Crew-Syunik-05 (Vorotan Hydro / Shinuhayr Team)">
                  Crew-Syunik-05 (Vorotan Hydro / Shinuhayr Team)
                </option>
                <option value="Crew-Ararat-03 (Valley Feeder Inspection Team)">
                  Crew-Ararat-03 (Valley Feeder Inspection Team)
                </option>
              </select>
            </div>

            {/* Priority & Equipment */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Urgency / SLA
                </label>
                <select
                  value={priority}
                  onChange={e => setPriority(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-blue-500 cursor-pointer"
                >
                  <option value="urgent">Immediate (&lt; 2 Hours)</option>
                  <option value="high">Next 24 Hours</option>
                  <option value="routine">Routine Schedule (7 Days)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Required Diagnostic Tool
                </label>
                <input
                  type="text"
                  value={equipment}
                  onChange={e => setEquipment(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            {/* Action Instructions */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Standard Operating Procedure / Instructions
              </label>
              <textarea
                rows={3}
                value={notes}
                onChange={e => setNotes(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
              />
            </div>

            {/* Actions */}
            <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-800">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors shadow-md flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                <Truck className="w-3.5 h-3.5" />
                <span>{isSubmitting ? 'Dispatching...' : 'Dispatch Field Crew'}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
