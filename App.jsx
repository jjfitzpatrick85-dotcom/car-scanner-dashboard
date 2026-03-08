import React, { useState, useEffect } from 'react';
import { Search, Gauge, Calendar, TrendingUp, Bell, Zap } from 'lucide-react';

export default function CarScannerDashboard() {
  const [vehicles, setVehicles] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const BACKEND_URL = 'https://58b8bf13-f744-43b1-9853-e9b0085a37f3-00-17alqxf50v7s7.picard.replit.dev';

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const vehiclesRes = await fetch(`${BACKEND_URL}/api/vehicles`);
        const vehiclesData = await vehiclesRes.json();
        const statsRes = await fetch(`${BACKEND_URL}/api/statistics`);
        const statsData = await statsRes.json();
        
        if (vehiclesData.success) setVehicles(vehiclesData.vehicles);
        if (statsData.success) setStats(statsData);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 300000);
    return () => clearInterval(interval);
  }, []);

  let filteredVehicles = vehicles;
  if (filter !== 'all') {
    filteredVehicles = filteredVehicles.filter(v => v.source === filter);
  }
  if (searchTerm) {
    filteredVehicles = filteredVehicles.filter(v => 
      v.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }

  const formatCurrency = (amount) => {
    return `£${amount?.toLocaleString('en-GB', { maximumFractionDigits: 0 }) || 'N/A'}`;
  };

  const getProfitColor = (margin) => {
    if (!margin) return 'text-gray-500';
    if (margin > 15) return 'text-green-600';
    if (margin > 5) return 'text-blue-600';
    return 'text-orange-600';
  };

  if (loading && !vehicles.length) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <h1 className="text-2xl font-bold text-gray-900">Car Scanner Pro</h1>
        </div>
      </header>

      {stats && (
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="grid grid-cols-4 gap-4 mb-8">
            <div className="bg-white rounded p-6 shadow">
              <p className="text-gray-600 text-sm">Total Vehicles</p>
              <p className="text-3xl font-bold">{stats.total_vehicles}</p>
            </div>
            <div className="bg-white rounded p-6 shadow">
              <p className="text-gray-600 text-sm">Added Today</p>
              <p className="text-3xl font-bold">{stats.added_today}</p>
            </div>
            <div className="bg-white rounded p-6 shadow">
              <p className="text-gray-600 text-sm">Avg Profit</p>
              <p className="text-3xl font-bold">{stats.average_profit_margin?.toFixed(1)}%</p>
            </div>
            <div className="bg-white rounded p-6 shadow">
              <p className="text-gray-600 text-sm">Sources</p>
              <p className="text-3xl font-bold">{Object.keys(stats.by_source || {}).length}</p>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-6 mb-8">
        <div className="bg-white rounded shadow p-4">
          <div className="grid grid-cols-3 gap-4">
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-4 py-2 border rounded"
            />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="px-4 py-2 border rounded"
            >
              <option value="all">All Sources</option>
              <option value="AutoTrader">AutoTrader</option>
              <option value="CarGurus">CarGurus</option>
              <option value="PistonHeads">PistonHeads</option>
              <option value="Car and Classic">Car and Classic</option>
            </select>
            <button onClick={() => window.location.reload()} className="px-4 py-2 bg-blue-600 text-white rounded">
              Refresh
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 pb-12">
        {filteredVehicles.length === 0 ? (
          <div className="bg-white rounded shadow p-8 text-center">
            <p className="text-gray-500">No vehicles yet. Waiting for scan...</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredVehicles.map((vehicle) => (
              <div key={vehicle.id} className="bg-white rounded shadow p-6">
                <div className="grid grid-cols-3 gap-6">
                  <div>
                    <h3 className="text-lg font-bold mb-2">{vehicle.title}</h3>
                    <p className="text-gray-600 text-sm mb-1">{vehicle.mileage?.toLocaleString()} miles</p>
                    <p className="text-gray-600 text-sm mb-4">{vehicle.year}</p>
                    <div className="bg-blue-50 p-3 rounded mb-4">
                      <p className="text-xs text-gray-600">Price</p>
                      <p className="text-2xl font-bold text-blue-600">{formatCurrency(vehicle.advertised_price)}</p>
                    </div>
                    
                      href={vehicle.advert_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full px-4 py-2 bg-blue-600 text-white rounded text-center text-sm"
                    >
                      View Listing →
                    </a>
                  </div>

                  <div className="col-span-2 border-l pl-6">
                    <h4 className="font-bold mb-4">Market Analysis</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-green-50 p-4 rounded border border-green-200">
                        <p className="text-xs text-green-700 mb-1">Est. Retail</p>
                        <p className="text-2xl font-bold text-green-900">
                          {vehicle.estimated_retail ? formatCurrency(vehicle.estimated_retail) : 'N/A'}
                        </p>
                      </div>
                      <div className={`p-4 rounded border ${
                        vehicle.profit_margin > 15 ? 'bg-green-50 border-green-200' :
                        vehicle.profit_margin > 5 ? 'bg-blue-50 border-blue-200' :
                        'bg-orange-50 border-orange-200'
                      }`}>
                        <p className={`text-xs mb-1 ${getProfitColor(vehicle.profit_margin)}`}>Profit Margin</p>
                        <p className={`text-2xl font-bold ${getProfitColor(vehicle.profit_margin)}`}>
                          {vehicle.profit_margin !== null ? `${vehicle.profit_margin.toFixed(1)}%` : 'N/A'}
                        </p>
                      </div>
                      <div className="bg-purple-50 p-4 rounded border border-purple-200">
                        <p className="text-xs text-purple-700 mb-1">Avg Days to Sell</p>
                        <p className="text-2xl font-bold text-purple-900">{vehicle.days_to_sell || 'N/A'}</p>
                      </div>
                      <div className="bg-gray-100 p-4 rounded">
                        <p className="text-xs text-gray-700 mb-1">Market Demand</p>
                        <p className="font-bold text-sm">{vehicle.market_rating || 'Standard'}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
