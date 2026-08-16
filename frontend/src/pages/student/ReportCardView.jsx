import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import PrintableReportCard from '../../components/reports/PrintableReportCard';
import { LoadingSpinner } from '../../components/common/StatCard';

export default function ReportCardView() {
  const { user } = useAuth();
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadReport() {
      if (!user) return;
      try {
        const data = await api.getStudentPerformanceReport(user.id);
        setReportData(data);
      } catch (err) {
        console.error("Report card fetch error:", err);
      } finally {
        setLoading(false);
      }
    }
    loadReport();
  }, [user]);

  if (loading) return <LoadingSpinner text="Generating Official Performance Report & Transcript..." />;

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <PrintableReportCard reportData={reportData} />
    </div>
  );
}
