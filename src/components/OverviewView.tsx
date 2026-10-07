import React from 'react';
import { ChargeSession } from '../types';
import { formatTime24, formatTime12 } from '../engine/chargingAllocationEngine';
import { Zap, Bus, CheckCircle2, ArrowRight, AlertTriangle, BatteryCharging } from 'lucide-react';

interface OverviewViewProps {
  sessions: ChargeSession[];
  onGoToAllocate: () => void;
  onGoToSchedule: () => void;
}

export const OverviewView: React.FC<OverviewViewProps> = ({
  sessions,
  onGoToAllocate,
  onGoToSchedule,
}) => {
  const currentMinute = 20 * 60; // 20:00 reference or live
  const activeCount = sessions.filter(
    s => currentMinute >= s.startMinute && currentMinute < s.endMinute
  ).length;

  const upcoming = sessions
    .filter(s => s.startMinute >= currentMinute)
    .sort((a, b) => a.startMinute - b.startMinute)
    .slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Hero Banner */}
      <div className="bg-[#123D30] rounded-3xl p-7 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full text-xs font-semibold text-emerald-300 mb-3">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            Depot Schedule Operational
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight mb-2">
            Depot Charging Operations
          </h1>
          <p className="text-emerald-100/90 text-sm mb-6 leading-relaxed">
            Centralized intelligent management for 101 electric fleet buses across 20 automated fast chargers.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-4 border-t border-white/10">
            <div>
              <span className="text-2xl font-bold block">{sessions.length}</span>
              <span className="text-[11px] font-semibold text-emerald-300 uppercase tracking-wider">
                Planned Sessions
              </span>
            </div>
            <div>
              <span className="text-2xl font-bold block">101</span>
              <span className="text-[11px] font-semibold text-emerald-300 uppercase tracking-wider">
                Fleet Buses
              </span>
            </div>
            <div>
              <span className="text-2xl font-bold block">20</span>
              <span className="text-[11px] font-semibold text-emerald-300 uppercase tracking-wider">
                Active Chargers
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Allocate card */}
        <div
          onClick={onGoToAllocate}
          className="bg-white rounded-2xl p-5 shadow-sm border border-emerald-100 hover:border-[#1A6B52] transition-all cursor-pointer group flex items-center justify-between"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#E4F3EA] text-[#1A6B52] flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
              <BatteryCharging className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 text-sm group-hover:text-[#1A6B52] transition-colors">
                Bus Arrived? Allocate Charger
              </h3>
              <p className="text-xs text-gray-500">
                Input Bus #, Arrival time & SOC% to allocate charger & calculate departure SOC
              </p>
            </div>
          </div>
          <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-[#1A6B52] group-hover:translate-x-1 transition-all" />
        </div>

        {/* View Schedule card */}
        <div
          onClick={onGoToSchedule}
          className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:border-gray-300 transition-all cursor-pointer group flex items-center justify-between"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gray-100 text-gray-700 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
              <Zap className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 text-sm group-hover:text-gray-900 transition-colors">
                Review Master Schedule
              </h3>
              <p className="text-xs text-gray-500">
                Inspect 24-hour depot timeline, charger overlaps, and assignments
              </p>
            </div>
          </div>
          <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-gray-900 group-hover:translate-x-1 transition-all" />
        </div>
      </div>

      {/* Upcoming Sessions List */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-gray-900 text-sm">Upcoming Bus Connections</h3>
          <button
            onClick={onGoToSchedule}
            className="text-xs font-bold text-[#1A6B52] hover:underline"
          >
            See all ›
          </button>
        </div>

        <div className="divide-y divide-gray-100">
          {upcoming.map(s => (
            <div key={s.id} className="py-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 text-[#1A6B52] flex items-center justify-center font-bold text-xs">
                  {s.bus}
                </div>
                <div>
                  <span className="font-bold text-gray-900 text-xs block">
                    Bus {s.bus.toString().padStart(2, '0')}
                  </span>
                  <span className="text-[11px] text-gray-500 block">
                    Charger {s.charger.toString().padStart(2, '0')} · {s.durationMinutes} min
                  </span>
                </div>
              </div>
              <div className="text-right">
                <span className="text-xs font-bold text-gray-800 block">
                  {formatTime24(s.startMinute)} – {formatTime24(s.endMinute)}
                </span>
                <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full font-semibold">
                  Scheduled
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
