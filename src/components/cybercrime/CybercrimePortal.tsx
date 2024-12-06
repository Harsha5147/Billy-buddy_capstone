import React, { useState, useEffect } from 'react';
import { Shield, AlertTriangle, Map, FileText } from 'lucide-react';
import CybercrimeMap from './CybercrimeMap';
import { useData } from '../../context/DataContext';
import { Report } from '../../types';
import { cybercrimeService } from '../../services/cybercrimeService';

const CybercrimePortal: React.FC = () => {
  const { reports } = useData();
  const [criticalAreas, setCriticalAreas] = useState<any[]>([]);
  const [reportedIncidents, setReportedIncidents] = useState<Report[]>([]);

  useEffect(() => {
    // Filter reported incidents
    const reported = reports.filter(report => report.status === 'reported');
    setReportedIncidents(reported);

    // Group reports by location and severity
    const locationMap = {};
    reports.forEach(report => {
      const key = `${report.location.city}-${report.bullyingType}`;
      if (!locationMap[key]) {
        locationMap[key] = {
          location: report.location,
          type: report.bullyingType,
          reports: [],
          count: 0
        };
      }
      locationMap[key].reports.push(report);
      locationMap[key].count++;
    });

    // Filter areas with more than 3 reports
    const critical = Object.values(locationMap)
      .filter((area: any) => area.count >= 3)
      .map((area: any) => ({
        ...area,
        severity: area.count >= 10 ? 'critical' : area.count >= 5 ? 'high' : 'medium'
      }));

    setCriticalAreas(critical);
  }, [reports]);

  const handleReportToCybercrime = async (reports: Report[], location: string) => {
    try {
      const result = await cybercrimeService.reportToCybercrime(reports, location);
      if (result.success) {
        alert(`Successfully reported ${result.reportedCount} incidents from ${location} to cybercrime authorities.`);
      }
    } catch (error) {
      console.error('Error reporting to cybercrime:', error);
      alert('Failed to report to cybercrime authorities. Please try again.');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center gap-3 mb-8">
          <Shield className="text-red-600" size={32} />
          <h1 className="text-2xl font-bold">Cybercrime Portal</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-red-50 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-red-600 font-semibold">Critical Areas</p>
                <h3 className="text-2xl font-bold text-red-700">
                  {criticalAreas.filter(a => a.severity === 'critical').length}
                </h3>
              </div>
              <AlertTriangle className="text-red-500" size={32} />
            </div>
          </div>

          <div className="bg-orange-50 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-600 font-semibold">Reported Incidents</p>
                <h3 className="text-2xl font-bold text-orange-700">
                  {reportedIncidents.length}
                </h3>
              </div>
              <Map className="text-orange-500" size={32} />
            </div>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-600 font-semibold">Total Reports</p>
                <h3 className="text-2xl font-bold text-blue-700">{reports.length}</h3>
              </div>
              <FileText className="text-blue-500" size={32} />
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <div className="bg-white rounded-lg overflow-hidden border">
            <div className="p-4 bg-gray-50 border-b">
              <h2 className="text-lg font-semibold">Cyberbullying Incidents Map</h2>
            </div>
            <div className="h-[500px]">
              <CybercrimeMap 
                reports={reportedIncidents} 
                criticalAreas={criticalAreas}
                onReportToCybercrime={handleReportToCybercrime}
              />
            </div>
          </div>

          <div className="bg-white rounded-lg overflow-hidden border">
            <div className="p-4 bg-gray-50 border-b">
              <h2 className="text-lg font-semibold">Reported Incidents</h2>
            </div>
            <div className="divide-y">
              {reportedIncidents.map((report) => (
                <div key={report.id} className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-semibold">{report.bullyingType}</h3>
                      <p className="text-sm text-gray-500">
                        {report.location.city}, {report.location.state}
                      </p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm ${
                      report.severity === 'critical' ? 'bg-red-100 text-red-800' :
                      report.severity === 'high' ? 'bg-orange-100 text-orange-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {report.severity.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm">
                    Reported on: {new Date(report.timestamp).toLocaleDateString()}
                  </p>
                </div>
              ))}
              {reportedIncidents.length === 0 && (
                <div className="p-4 text-center text-gray-500">
                  No reported incidents yet
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CybercrimePortal;