'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { useState } from 'react';

interface TemperatureData {
  timestamp: string;
  value: number;
}

interface TemperatureModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: TemperatureData[];
}

export function TemperatureModal({ isOpen, onClose, data }: TemperatureModalProps) {
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
    temp: point.value,
    fullTimestamp: point.timestamp
  }));

  return (
    <div 
      className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div 
        className="bg-slate-800 rounded-lg p-6 max-w-4xl w-full border border-teal-500/30"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-teal-400">🌡️ Temperature History</h2>
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
                  ? 'bg-teal-600 text-white'
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
                domain={[68, 78]}
                stroke="#94a3b8"
                tick={{ fill: '#94a3b8', fontSize: 12 }}
                label={{ value: '°F', angle: -90, position: 'insideLeft', fill: '#94a3b8' }}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#0f172a', 
                  border: '1px solid #0d9488',
                  borderRadius: '8px',
                  color: '#e2e8f0'
                }}
                formatter={(value) => [`${value}°F`, 'Temperature']}
              />
              {/* Optimal range indicators */}
              <ReferenceLine y={72} stroke="#22c55e" strokeDasharray="3 3" opacity={0.3} />
              <ReferenceLine y={76} stroke="#22c55e" strokeDasharray="3 3" opacity={0.3} />
              
              <Line 
                type="monotone" 
                dataKey="temp" 
                stroke="#0d9488" 
                strokeWidth={3}
                dot={{ fill: '#0d9488', r: 4 }}
                activeDot={{ r: 6, fill: '#ea580c' }}
              />
            </LineChart>
          </ResponsiveContainer>
          
          {/* Legend */}
          <div className="mt-4 flex items-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-teal-500 rounded-full"></div>
              <span className="text-slate-300">Temperature</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-0.5 bg-green-500 opacity-30"></div>
              <span className="text-slate-300">Optimal Range (72-76°F)</span>
            </div>
          </div>
        </div>

        {/* Current stats */}
        <div className="mt-4 grid grid-cols-3 gap-4">
          <div className="bg-slate-900 rounded-lg p-3 text-center">
            <div className="text-xs text-slate-400 mb-1">Current</div>
            <div className="text-xl font-bold text-teal-400">
              {chartData[chartData.length - 1]?.temp || 0}°F
            </div>
          </div>
          <div className="bg-slate-900 rounded-lg p-3 text-center">
            <div className="text-xs text-slate-400 mb-1">Average</div>
            <div className="text-xl font-bold text-cyan-400">
              {(chartData.reduce((sum, d) => sum + d.temp, 0) / chartData.length).toFixed(1)}°F
            </div>
          </div>
          <div className="bg-slate-900 rounded-lg p-3 text-center">
            <div className="text-xs text-slate-400 mb-1">Data Points</div>
            <div className="text-xl font-bold text-slate-300">
              {chartData.length}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
