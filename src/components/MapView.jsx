import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { useApp } from '../context/AppContext';
import { AlertCircle, CheckCircle2, Clock, Search } from 'lucide-react';

// Fix Leaflet default icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

function createCustomIcon(category, status) {
  const categoryInfo = useApp?.()?.CATEGORIES?.[category] || { color: '#6b7280', icon: '⚠️' };
  
  return L.divIcon({
    className: 'custom-marker-wrapper',
    html: `<div style="
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background: ${status === 'RESOLVED' ? '#22c55e' : categoryInfo.color};
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 20px;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.2);
      border: 3px solid white;
    ">${categoryInfo.icon || '⚠️'}</div>`,
    iconSize: [40, 40],
    iconAnchor: [20, 20],
    popupAnchor: [0, -20]
  });
}

export default function MapView() {
  const { reports, CATEGORIES, STATUSES } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');

  const filteredReports = reports.filter(report => {
    const matchesSearch = report.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.address.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || report.category === selectedCategory;
    const matchesStatus = selectedStatus === 'all' || report.status === selectedStatus;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-xl shadow-md p-4">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">🗺️ Interactive Map</h2>
        
        {/* Search and Filters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search by description or address..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
          
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="all">All Categories</option>
            {Object.entries(CATEGORIES).map(([key, cat]) => (
              <option key={key} value={key}>{cat.icon} {cat.name}</option>
            ))}
          </select>
          
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="all">All Status</option>
            {Object.entries(STATUSES).map(([key, status]) => (
              <option key={key} value={key}>{status.name}</option>
            ))}
          </select>
        </div>

        {/* Stats Bar */}
        <div className="flex flex-wrap gap-4 mb-4 text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <span className="text-gray-600">Open: {reports.filter(r => r.status === 'OPEN').length}</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-orange-500"></div>
            <span className="text-gray-600">Investigating: {reports.filter(r => r.status === 'INVESTIGATING').length}</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <span className="text-gray-600">Resolved: {reports.filter(r => r.status === 'RESOLVED').length}</span>
          </div>
          <div className="text-gray-600">
            Showing {filteredReports.length} of {reports.length} reports
          </div>
        </div>
      </div>

      {/* Map */}
      <div className="bg-white rounded-xl shadow-md p-4">
        <div className="h-[500px]">
          <MapContainer
            center={[28.6139, 77.2090]}
            zoom={12}
            className="h-full w-full rounded-xl"
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            
            {filteredReports.map((report) => {
              const categoryInfo = CATEGORIES[report.category] || CATEGORIES.OTHER;
              const statusInfo = STATUSES[report.status] || STATUSES.OPEN;
              
              return (
                <Marker
                  key={report.id}
                  position={[report.latitude, report.longitude]}
                  icon={createCustomIcon(report.category, report.status)}
                >
                  <Popup>
                    <div className="min-w-[280px]">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-2xl">{categoryInfo.icon}</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusInfo.bgColor} ${statusInfo.textColor}`}>
                          {statusInfo.name}
                        </span>
                      </div>
                      
                      <h3 className="font-semibold text-gray-800 mb-1">{categoryInfo.name}</h3>
                      <p className="text-sm text-gray-600 mb-2">{report.description}</p>
                      
                      <div className="text-xs text-gray-500 space-y-1">
                        <p className="flex items-center gap-1">
                          <span>📍</span> {report.address}
                        </p>
                        <p className="flex items-center gap-1">
                          <span>👤</span> Reported by {report.reporterName}
                        </p>
                        <p className="flex items-center gap-1">
                          <span>📊</span> Risk Score: {report.riskScore}/100
                        </p>
                      </div>
                    </div>
                  </Popup>
                </Marker>
              );
            })}
          </MapContainer>
        </div>
      </div>

      {/* Legend */}
      <div className="bg-white rounded-xl shadow-md p-4">
        <h3 className="font-semibold text-gray-800 mb-3">📋 Legend</h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 text-sm">
          {Object.entries(CATEGORIES).map(([key, cat]) => (
            <div key={key} className="flex items-center space-x-2">
              <div 
                className="w-8 h-8 rounded-full flex items-center justify-center text-lg"
                style={{ backgroundColor: cat.color + '20' }}
              >
                {cat.icon}
              </div>
              <span className="text-gray-600">{cat.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
