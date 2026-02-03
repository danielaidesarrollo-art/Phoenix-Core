import React, { useEffect, useState } from 'react';

const SupplyUsageWidget = () => {
    const [stats, setStats] = useState<any>(null);

    useEffect(() => {
        // Fetch stats from backend
        fetch('http://localhost:8000/api/stats/supply_usage')
            .then(res => res.json())
            .then(data => setStats(data))
            .catch(err => console.error("Failed to load stats", err));
    }, []);

    if (!stats) return <div className="p-4 text-gray-500 animate-pulse">Loading analytics...</div>;

    const maxUsage = Math.max(...stats.categories.map((c: any) => c.usage));

    return (
        <div className="glass-panel p-6 rounded-3xl border border-white/5 h-full">
            <div className="flex justify-between items-start mb-6">
                <div>
                    <h3 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
                        Supply Utilization
                    </h3>
                    <p className="text-xs text-gray-500">{stats.period}</p>
                </div>
                <div className="text-right">
                    <div className="text-2xl font-mono text-white font-bold">{stats.total_units}</div>
                    <div className="text-[10px] text-green-400 bg-green-900/20 px-2 py-0.5 rounded-full inline-block">
                        Efficiency {stats.cost_efficiency}
                    </div>
                </div>
            </div>

            <div className="space-y-4">
                {stats.categories.map((category: any, i: number) => (
                    <div key={i} className="group">
                        <div className="flex justify-between text-sm mb-1">
                            <span className="text-gray-300 group-hover:text-white transition-colors">
                                {category.name}
                            </span>
                            <div className="flex items-center gap-2">
                                <span className="font-mono text-cyan-400">{category.usage}</span>
                                <span className={`text-[10px] ${category.trend === 'up' ? 'text-green-500' :
                                        category.trend === 'down' ? 'text-red-500' : 'text-gray-500'
                                    }`}>
                                    {category.trend === 'up' ? '↑' : category.trend === 'down' ? '↓' : '→'}
                                </span>
                            </div>
                        </div>
                        <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-gradient-to-r from-blue-600 to-purple-600 rounded-full transition-all duration-1000 group-hover:from-blue-500 group-hover:to-purple-500"
                                style={{ width: `${(category.usage / maxUsage) * 100}%` }}
                            ></div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-6 pt-4 border-t border-white/5 grid grid-cols-3 gap-2 text-center">
                {Object.entries(stats.monthly_breakdown).map(([month, val]: [string, any]) => (
                    <div key={month} className="bg-white/5 rounded-lg p-2">
                        <div className="text-[10px] text-gray-500 uppercase">{month}</div>
                        <div className="text-sm font-bold text-gray-300">{val}</div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SupplyUsageWidget;
