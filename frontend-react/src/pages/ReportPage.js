import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ReportCard from "../components/ReportCard";

export default function ReportPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const data = location.state;

  if (!data) {
    return (
      <div className="app-container">
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "16px",
            textAlign: "center",
          }}
        >
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: "50%",
              background: "rgba(246,173,85,0.08)",
              border: "1px solid rgba(246,173,85,0.18)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 20,
            }}
          >
            ⚠
          </div>
          <div>
            <p
              style={{
                fontSize: 16,
                fontWeight: 500,
                color: "#e8eaf0",
                marginBottom: 6,
              }}
            >
              No report data found
            </p>
            <p style={{ fontSize: 13, color: "#8892a4" }}>
              Generate a report from the home page first.
            </p>
          </div>
          <button
            className="primary-btn"
            style={{ width: "auto", padding: "10px 28px", marginTop: 0 }}
            onClick={() => navigate("/")}
          >
            ← Go Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="report-container">
      {/* ── BACK ── */}
      <div className="report-header">
        <button className="back-btn" onClick={() => navigate("/")}>
          <svg
            width="13"
            height="13"
            viewBox="0 0 13 13"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            style={{ flexShrink: 0 }}
          >
            <path
              d="M7.5 2L3 6.5l4.5 4.5"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Back
        </button>
      </div>

      {/* ── CARD ── */}
      <div className="report-content">
        <ReportCard data={data} />
      </div>
    </div>
  );
}
