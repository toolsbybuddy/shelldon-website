'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, Legend } from 'recharts';
import { useState } from 'react';

interface WaterQualityData {
  timestamp: string;
  ph: number;
  ammonia: number;
}

interface WaterQualityModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: WaterQualityData[];
}

export function WaterQualityModal({ isOpen, onClose, data }: WaterQualityModalProps) {
  const [timeRange, setTimeRange] = useState<'24h' | '7d' | '30d' | 'all'>('7d');

  if (!isOpen) return null;

  // Filter data based on time range
  const now = new Date();
  const filteredData = data.filter(point => {
    const pointDate = new Date(point.timestamp);
    const hoursDiff = (now.getTime() - pointDate.getTime()) / (1000 * 60 * 60);
    
    if (timeRange === '24h') return hoursDiff <= 24;
    if (timeRange === '7d') return hoursDiff <= 24 * 7;
    if (timeRange === '30d') return hoursDiff <= 24 * 30;
    return true; // 'all'
  });

  // Format data for chart
  const chartData = filteredData.map(point => ({
    time: new Date(point.timestamp).toLocaleString('en-US', { 
      month: 'short', 
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    }),
    pH: point.ph,
    ammonia: point.ammonia,
    fullTimestamp: point.timestamp
  }));

  return (
    <div 
      className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div 
        className="bg-slate-800 rounded-lg p-6 max-w-4xl w-full border border-cyan-500/30"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-cyan-400">💧 Water Quality History</h2>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-white text-2xl leading-none"
          >
            ×
          </button>
        </div>

        {/* Time range selector */}
        <div className="flex gap-2 mb-4">
          {(['24h', '7d', '30d', 'all'] as const).map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                timeRange === range
                  ? 'bg-cyan-600 text-white'
                  : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
              }`}
            >
              {range === 'all' ? 'All Time' : range.toUpperCase()}
            </button>
          ))}
        </div>

        {/* Chart */}
        <div className="bg-slate-900 rounded-lg p-4">
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis 
                dataKey="time" 
                stroke="#94a3b8"
                tick={{ fill: '#94a3b8', fontSize: 12 }}
              />
              <YAxis 
                yAxisId="left"
                domain={[6, 8.5]}
                stroke="#06b6d4"
                tick={{ fill: '#94a3b8', fontSize: 12 }}
                label={{ value: 'pH', angle: -90, position: 'insideLeft', fill: '#06b6d4' }}
              />
              <YAxis 
                yAxisId="right"
                orientation="right"
                domain={[0, 0.5]}
                stroke="#fbbf24"
                tick={{ fill: '#94a3b8', fontSize: 12 }}
                label={{ value: 'Ammonia (ppm)', angle: 90, position: 'insideRight', fill: '#fbbf24' }}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#0f172a', 
                  border: '1px solid #06b6d4',
                  borderRadius: '8px',
                  color: '#e2e8f0'
                }}
              />
              <Legend />
              
              {/* Optimal pH range indicators */}
              <ReferenceLine yAxisId="left" y={6.5} stroke="#22c55e" strokeDasharray="3 3" opacity={0.3} />
              <ReferenceLine yAxisId="left" y={8.0} stroke="#22c55e" strokeDasharray="3 3" opacity={0.3} />
              
              {/* Safe ammonia threshold */}
              <ReferenceLine yAxisId="right" y={0.02} stroke="#ef4444" strokeDasharray="3 3" opacity={0.3} />
              
              <Line 
                yAxisId="left"
                type="monotone" 
                dataKey="pH" 
                stroke="#06b6d4" 
                strokeWidth={3}
                dot={{ fill: '#06b6d4', r: 4 }}
                activeDot={{ r: 6, fill: '#ea580c' }}
                name="pH Level"
              />
              <Line 
                yAxisId="right"
                type="monotone" 
                dataKey="ammonia" 
                stroke="#fbbf24" 
                strokeWidth={3}
                dot={{ fill: '#fbbf24', r: 4 }}
                activeDot={{ r: 6, fill: '#ea580c' }}
                name="Ammonia (ppm)"
              />
            </LineChart>
          </ResponsiveContainer>
          
          {/* Legend */}
          <div className="mt-4 flex flex-wrap items-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-cyan-400 rounded-full"></div>
              <span className="text-slate-300">pH Level</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-amber-400 rounded-full"></div>
              <span className="text-slate-300">Ammonia</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-0.5 bg-green-500 opacity-30"></div>
              <span className="text-slate-300">Optimal pH (6.5-8.0)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-0.5 bg-red-500 opacity-30"></div>
              <span className="text-slate-300">Ammonia Alert (&gt;0.02ppm)</span>
            </div>
          </div>
        </div>

        {/* Current stats */}
        <div className="mt-4 grid grid-cols-3 gap-4">
          <div className="bg-slate-900 rounded-lg p-3 text-center">
            <div className="text-xs text-slate-400 mb-1">Current pH</div>
            <div className="text-xl font-bold text-cyan-400">
              {chartData[chartData.length - 1]?.pH || 0}
            </div>
          </div>
          <div className="bg-slate-900 rounded-lg p-3 text-center">
            <div className="text-xs text-slate-400 mb-1">Current Ammonia</div>
            <div className="text-xl font-bold text-amber-400">
              {chartData[chartData.length - 1]?.ammonia || 0} ppm
            </div>
          </div>
          <div className="bg-slate-900 rounded-lg p-3 text-center">
            <div className="text-xs text-slate-400 mb-1">Status</div>
            <div className="text-lg font-bold text-green-400">
              {chartData[chartData.length - 1]?.pH >= 6.5 && 
               chartData[chartData.length - 1]?.pH <= 8.0 &&
               chartData[chartData.length - 1]?.ammonia < 0.02 ? '✓ Safe' : '⚠ Check'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
