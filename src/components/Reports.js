import React, { useState, useEffect } from "react";
import "../style/Reports.css";

function Reports() {
  const [reports, setReports] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // State for monthly report form
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  useEffect(() => {
    fetchReports();
  }, []);

  // Fetch all reports
  const fetchReports = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await fetch("https://localhost:7059/api/v1/reports", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch reports.");
      }

      const data = await response.json();
      setReports(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Generate Daily Report
  const handleGenerateDailyReport = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("https://localhost:7059/api/v1/reports/earnings/daily", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to generate daily report.");
      }

      alert("Daily Report Generated Successfully!");
      fetchReports();
    } catch (err) {
      setError(err.message);
    }
  };

  // Generate Monthly Report with Month & Year
  const handleGenerateMonthlyReport = async (e) => {
    e.preventDefault();
    
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("https://localhost:7059/api/v1/reports/earnings/monthly", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          month: selectedMonth,
          year: selectedYear,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate monthly report.");
      }

      alert(`Monthly Report for ${selectedMonth}/${selectedYear} Generated Successfully!`);
      fetchReports();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="reports-container">
      <h1>Reports</h1>

      {error && <div className="error-message">{error}</div>}

      <div className="generate-report-buttons">
        {/* Daily Report Button */}
        <button className="btn-generate" onClick={handleGenerateDailyReport}>
          Generate Daily Report
        </button>

        {/* Monthly Report Form */}
        <form className="monthly-report-form" onSubmit={handleGenerateMonthlyReport}>
          <label>Select Month:</label>
          <select value={selectedMonth} onChange={(e) => setSelectedMonth(parseInt(e.target.value))}>
            {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
              <option key={month} value={month}>
                {new Date(0, month - 1).toLocaleString("en", { month: "long" })}
              </option>
            ))}
          </select>

          <label>Select Year:</label>
          <select value={selectedYear} onChange={(e) => setSelectedYear(parseInt(e.target.value))}>
            {Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i).map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>

          <button type="submit" className="btn-generate">
            Generate Monthly Report
          </button>
        </form>
      </div>

      {loading ? <p>Loading...</p> : (
        <div className="report-list">
          {reports.length > 0 ? (
            reports.map((report, index) => (
              <div key={index} className="report-card">
                <h3>{report.ReportName}</h3>
                <p><strong>Date:</strong> {report.ReportDate}</p>
                <pre className="report-data">{JSON.stringify(report.ReportData, null, 2)}</pre>
              </div>
            ))
          ) : (
            <p>No reports available.</p>
          )}
        </div>
      )}
    </div>
  );
}

export default Reports;
