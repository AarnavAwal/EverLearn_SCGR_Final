import React, { useState } from 'react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';
import { useApp } from '../context/AppContext';
import {
  TrendingUp,
  BarChart3,
  LineChart as LineChartIcon,
} from 'lucide-react';

interface StudentProgressGraphProps {
  compact?: boolean;
}

export const StudentProgressGraph: React.FC<StudentProgressGraphProps> = () => {
  const { currentStudent } = useApp();
  const [chartTab, setChartTab] = useState<'trajectory' | 'topics'>('trajectory');

  // Dynamic weekly trajectory data
  const trajectoryData = currentStudent.weeklyProgress || [
    { day: 'Mon', masteryPct: 62 },
    { day: 'Tue', masteryPct: 66 },
    { day: 'Wed', masteryPct: 70 },
    { day: 'Thu', masteryPct: 74 },
    { day: 'Fri', masteryPct: 78 },
    { day: 'Sat', masteryPct: 81 },
    { day: 'Sun', masteryPct: currentStudent.progressPct || 85 },
  ];

  // Dynamic topic breakdown data
  const topicsData = [
    {
      topic: 'Geometry',
      mastery: currentStudent.geometryMastery || 92,
      fill: '#10b981',
    },
    {
      topic: 'Algebra',
      mastery: currentStudent.algebraMastery || 84,
      fill: '#6366f1',
    },
    {
      topic: 'Statistics',
      mastery: currentStudent.statisticsMastery || 88,
      fill: '#06b6d4',
    },
    {
      topic: 'Fractions',
      mastery: currentStudent.fractionsMastery || 42,
      fill: currentStudent.fractionsMastery > 70 ? '#10b981' : '#f43f5e',
    },
  ];

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-900 border border-slate-700 px-3 py-2 rounded-xl shadow-xl text-xs">
          <p className="font-bold text-slate-200">{label}</p>
          <div className="flex items-center space-x-1.5 mt-1">
            <span className="text-slate-400">Mastery:</span>
            <span className="font-bold text-emerald-400">
              {payload[0].value}%
            </span>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div id="student-progress-graph-card" className="space-y-3">
      {/* Header with Switcher Tabs */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-7 h-7 rounded-lg bg-indigo-950/80 border border-indigo-800/60 flex items-center justify-center text-indigo-400">
            <TrendingUp className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Weekly Growth
            </h3>
            <p className="text-[11px] text-slate-400">
              <span className="text-emerald-400 font-bold">+{currentStudent.recentImprovement}%</span> improvement this week
            </p>
          </div>
        </div>

        {/* View Switcher */}
        <div className="flex items-center p-0.5 bg-slate-800 rounded-xl border border-slate-750 text-xs">
          <button
            id="tab-graph-trajectory"
            onClick={() => setChartTab('trajectory')}
            className={`px-3 py-1 rounded-lg font-semibold transition-all cursor-pointer flex items-center space-x-1.5 ${
              chartTab === 'trajectory'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <LineChartIcon className="w-3.5 h-3.5" />
            <span>Trend</span>
          </button>
          <button
            id="tab-graph-topics"
            onClick={() => setChartTab('topics')}
            className={`px-3 py-1 rounded-lg font-semibold transition-all cursor-pointer flex items-center space-x-1.5 ${
              chartTab === 'topics'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Topics</span>
          </button>
        </div>
      </div>

      {/* Chart Canvas Area */}
      <div className="h-44 w-full pt-1">
        <ResponsiveContainer width="100%" height="100%">
          {chartTab === 'trajectory' ? (
            <AreaChart data={trajectoryData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="masteryGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
              <XAxis dataKey="day" stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
              <YAxis domain={[40, 100]} stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} unit="%" />
              <Tooltip content={<CustomTooltip />} />
              <ReferenceLine y={80} stroke="#10b981" strokeDasharray="3 3" strokeOpacity={0.5} />
              <Area
                type="monotone"
                dataKey="masteryPct"
                name="Mastery"
                stroke="#818cf8"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#masteryGradient)"
                dot={{ r: 3, fill: '#818cf8', strokeWidth: 1, stroke: '#1e1b4b' }}
                activeDot={{ r: 5, fill: '#38bdf8', stroke: '#ffffff', strokeWidth: 2 }}
              />
            </AreaChart>
          ) : (
            <BarChart data={topicsData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
              <XAxis dataKey="topic" stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
              <YAxis domain={[0, 100]} stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} unit="%" />
              <Tooltip content={<CustomTooltip />} />
              <ReferenceLine y={80} stroke="#10b981" strokeDasharray="3 3" strokeOpacity={0.5} />
              <Bar dataKey="mastery" name="Mastery" radius={[6, 6, 0, 0]} barSize={28} />
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
};
