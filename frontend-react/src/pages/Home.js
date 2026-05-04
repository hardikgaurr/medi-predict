import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import PatientForm from "../components/PatientForm";
import SymptomSelector from "../components/SymptomSelector";

const API_URL = "https://medi-predict-1lrk.onrender.com"; // ✅ ADDED

export default function Home() {
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [symptoms, setSymptoms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handlePredict = async () => {
    if (symptoms.length === 0) {
      setError("Please select at least one symptom.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const formattedSymptoms = symptoms.map((s) =>
        s.toLowerCase().replace(/ /g, "_"),
      );

      const res = await axios.post(`${API_URL}/predict`, {
        // ✅ CHANGED
        symptoms: formattedSymptoms,
      });

      navigate("/report", {
        state: { ...res.data, name, age, gender },
      });
    } catch (err) {
      setError("Server is waking up... try again in a few seconds."); // ✅ OPTIONAL IMPROVED MSG
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-container">
      <div className="home-wrapper">
        {/* ── BRAND ── */}
        <div className="home-brand">
          <div className="home-badge">
            <span className="home-badge-dot" />
            AI · Medical
          </div>
          <h1 className="app-title">
            Medi<span>Predict</span>
          </h1>
          <p className="home-subtitle">
            Symptom analysis powered by machine learning
          </p>
        </div>

        {/* ── FORM CARD ── */}
        <div className="card">
          <PatientForm
            name={name}
            age={age}
            gender={gender}
            setName={setName}
            setAge={setAge}
            setGender={setGender}
          />

          <SymptomSelector
            selectedSymptoms={symptoms}
            setSelectedSymptoms={setSymptoms}
          />

          <button onClick={handlePredict} disabled={loading}>
            {loading ? "Analyzing…" : "Generate Report →"}
          </button>

          {error && <p className="error">{error}</p>}
        </div>
      </div>
    </div>
  );
}
