import React from 'react';
import { ChargeSession } from '../types';
import { formatTime24, formatTime12 } from '../engine/chargingAllocationEngine';
import { Zap, Clock, Bus } from 'lucide-react';

interface ChargersViewProps {
  sessions: ChargeSession[];
}

export const ChargersView: React.FC<ChargersViewProps> = ({ sessions }) => {
  // Group sessions by charger 1..20
  const chargers = Array.from({ length: 20 }, (_, i) => {
    const chargerId = i + 1;
    const chargerSessions = sessions
      .filter(s => s.charger === chargerId)
      .sort((a, b) => a.startMinute - b.startMinute);
    return {
      id: chargerId,
      sessions: chargerSessions,
    };
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-900">Depot Charger Terminals</h2>
        <p className="text-xs text-gray-500">
          20 high-power 240 kW DC charging points with assigned fleet schedules
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {chargers.map(charger => {
          return (
            <div
              key={charger.id}
              className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-9 h-9 rounded-xl bg-[#E4F3EA] text-[#1A6B52] flex items-center justify-center font-bold text-xs">
                    #{charger.id.toString().padStart(2, '0')}
                  </div>
                  <span className="text-[11px] font-semibold text-gray-500 bg-gray-100 px-2.5 py-0.5 rounded-full">
                    {charger.sessions.length} sessions
                  </span>
                </div>

                <h3 className="font-bold text-gray-900 text-sm mb-1">
                  Charger {charger.id.toString().padStart(2, '0')}
                </h3>
                <p className="text-xs text-gray-500 mb-3">240 kW Fast DC Charger</p>

                {/* Next upcoming sessions */}
                <div className="space-y-2 mt-2">
                  <span className="text-[10px] font-bold uppercase text-gray-400 tracking-wider">
                    Schedule Queue
                  </span>
                  {charger.sessions.length === 0 ? (
                    <p className="text-xs text-gray-400 italic">No assigned sessions</p>
                  ) : (
                    charger.sessions.slice(0, 3).map(s => (
                      <div
                        key={s.id}
                        className="flex items-center justify-between text-xs p-2 rounded-lg bg-gray-50 border border-gray-100"
                      >
                        <span className="font-bold text-gray-800">Bus {s.bus}</span>
                        <span className="text-gray-500 text-[11px]">
                          {formatTime24(s.startMinute)} – {formatTime24(s.endMinute)}
                        </span>
                      </div>
                    ))
                  )}
                  {charger.sessions.length > 3 && (
                    <p className="text-[10px] text-gray-400 font-medium text-right">
                      +{charger.sessions.length - 3} more in queue
                    </p>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
