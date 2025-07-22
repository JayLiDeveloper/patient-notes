import React, { useEffect, useState } from "react";

import { getPatients } from "../data/mockDataService";
import type { Patient } from "../domain/types";

import usePatientFilters from "./usePatientFilters";

import "./PatientListPanel.css";

interface PatientListPanelProps {
  selectedPatientId: number | null;
  setSelectedPatientId: (id: number) => void;
}

const PatientListPanel: React.FC<PatientListPanelProps> = ({
  selectedPatientId,
  setSelectedPatientId,
}) => {
  const [patients, setPatients] = useState<Patient[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setPatients(getPatients());
      setLoading(false);
    }, 1500);
  }, []);

  const filters = usePatientFilters(patients || []);

  return (
    <div className="panel patient-list-panel patient-list-panel-container">
      <div className="app-title">Patient Notes</div>
      <h2>Patients</h2>
      {loading ? (
        <div className="loading-panel"><span>Loading patients...</span></div>
      ) : (
        <>
          <input
            id="patient-search"
            type="text"
            placeholder="Search by name..."
            value={filters.patientSearch}
            onChange={(e) => {
              filters.setPatientSearch(e.target.value);
              filters.setPatientPage(1);
            }}
            className="patient-list-search"
          />
          <div className="filter-bar patient-list-filter-bar">
            <div className="patient-list-filter-row">
              <div className="patient-list-filter-col">
                <label className="patient-list-filter-label">DOB From</label>
                <input
                  type="date"
                  value={filters.dobFrom}
                  onChange={(e) => {
                    filters.setDobFrom(e.target.value);
                    filters.setPatientPage(1);
                  }}
                  className="patient-list-date-input"
                />
              </div>
              <div className="patient-list-filter-col">
                <label className="patient-list-filter-label">DOB To</label>
                <input
                  type="date"
                  value={filters.dobTo}
                  onChange={(e) => {
                    filters.setDobTo(e.target.value);
                    filters.setPatientPage(1);
                  }}
                  className="patient-list-date-input"
                />
              </div>
            </div>
            <div>
              <select
                value={filters.patientGenderFilter}
                onChange={(e) => {
                  filters.setPatientGenderFilter(e.target.value);
                  filters.setPatientPage(1);
                }}
                className="patient-list-gender-select"
              >
                <option value="">All Genders</option>
                {filters.allGenders.map((gender) => (
                  <option key={gender} value={gender}>
                    {gender}
                  </option>
                ))}
              </select>
            </div>
            <div style={{ flex: 1 }} />
            <button
              onClick={() => {
                filters.clearPatientFilters();
              }}
              className="patient-list-clear-btn btn"
            >
              Clear
            </button>
          </div>
          <div className="patient-list-list">
            {filters.paginatedPatients.length === 0 ? (
              <div>No patients found.</div>
            ) : (
              <ul className="patient-list-ul">
                {filters.paginatedPatients.map((patient) => {
                  const age = Math.floor(
                    (Date.now() - new Date(patient.date_of_birth).getTime()) /
                      (365.25 * 24 * 60 * 60 * 1000)
                  );
                  const date_of_birth = new Date(
                    patient.date_of_birth
                  ).toLocaleDateString();
                  const isSelected = selectedPatientId === patient.id;
                  return (
                    <li
                      key={patient.id}
                      onClick={() => setSelectedPatientId(patient.id)}
                      className={`patient-list-li${isSelected ? " selected" : ""}`}
                    >
                      <div>{patient.name}</div>
                      <div className="patient-list-li-info">
                        {patient.gender} | Age: {age} | Dob: {date_of_birth}
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
          <div className="patient-list-pagination">
            <button className="btn" onClick={() => filters.setPatientPage(filters.patientPage - 1)} disabled={filters.patientPage <= 1}>&lt;</button>
            <span className="patient-list-pagination-info">Page {filters.patientPage} of {filters.totalPatientPages}</span>
            <button className="btn" onClick={() => filters.setPatientPage(filters.patientPage + 1)} disabled={filters.patientPage >= filters.totalPatientPages}>&gt;</button>
          </div>
        </>
      )}
    </div>
  );
};

export default PatientListPanel;
