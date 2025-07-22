import React, { useEffect, useState } from "react";

import { getNotes } from "../data/mockDataService";
import type { Note } from "../domain/types";

import useNoteFilters from "./useNoteFilters";

import NoteModal from "./NoteModal";

import "./NotesPanel.css";

interface NotesPanelProps {
  selectedPatientId: number | null;
}

const NotesPanel: React.FC<NotesPanelProps> = ({
  selectedPatientId,
}) => {
  const [notes, setNotes] = useState<Note[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setNotes(getNotes());
      setLoading(false);
    }, 2000);
  }, []);

  const filters = useNoteFilters(notes || [], selectedPatientId);
  const [modalNote, setModalNote] = useState<Note | null>(null);

  return (
    <div className="panel notes-panel notes-panel-container">
      <h2>Notes</h2>
      {loading ? (
        <div className="loading-panel"><span>Loading notes...</span></div>
      ) : (
        <>
          {/* Filters */}
          <div className="notes-panel-filters">
            <input
              type="text"
              placeholder="Search notes..."
              value={filters.noteSearch}
              onChange={(e) => {
                filters.setNoteSearch(e.target.value);
                filters.setNotePage(1);
              }}
              className="notes-panel-search"
            />
            <input
              type="text"
              placeholder="Search provider..."
              value={filters.noteProviderFilter}
              onChange={(e) => {
                filters.setNoteProviderFilter(e.target.value);
                filters.setNotePage(1);
              }}
              className="notes-panel-provider-search"
            />
            <select
              value={filters.noteHospitalFilter}
              onChange={(e) => {
                filters.setNoteHospitalFilter(e.target.value);
                filters.setNotePage(1);
              }}
            >
              <option value="">All Hospitals</option>
              {filters.allHospitals.map((h) => (
                <option key={h} value={h}>
                  {h}
                </option>
              ))}
            </select>
            <input
              type="date"
              value={filters.noteDateFilter}
              onChange={(e) => {
                filters.setNoteDateFilter(e.target.value);
                filters.setNotePage(1);
              }}
            />
            <button
              onClick={() => {
                filters.clearNoteFilters();
              }}
              className="btn"
            >
              Clear
            </button>
          </div>
          {/* Notes list */}
          <div className="notes-panel-list">
            {!selectedPatientId ? (
              <div>Please select a patient to view notes.</div>
            ) : filters.paginatedNotes.length === 0 ? (
              <div>No notes found.</div>
            ) : (
              <ul className="notes-panel-ul">
                {filters.paginatedNotes.map((n) => (
                  <li
                    key={n.id}
                    onClick={() => setModalNote(n)}
                    className="notes-panel-li"
                  >
                    <div className="notes-panel-provider">
                      {n.provider_name}{" "}
                      <span className="notes-panel-hospital">
                        @ {n.hospital_name}
                      </span>
                    </div>
                    <div className="notes-panel-date">
                      {n.creation_date}
                    </div>
                    <div className="notes-panel-text">
                      {n.text.slice(0, 80)}
                      {n.text.length > 80 ? "..." : ""}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
          {/* Pagination controls */}
          <div className="notes-panel-pagination">
            <select
              value={filters.notePageSize}
              onChange={(e) => {
                filters.setNotePageSize(Number(e.target.value));
                filters.setNotePage(1);
              }}
              className="notes-panel-page-size"
            >
              <option value={5}>5 </option>
              <option value={10}>10 </option>
              <option value={20}>20 </option>
              <option value={50}>50 </option>
            </select>{" "}
            / page
            <button
              className="btn"
              onClick={() => filters.setNotePage(filters.notePage - 1)}
              disabled={filters.notePage <= 1}
            >
              &lt;
            </button>
            <span className="notes-panel-page-info">
              Page {filters.notePage} of {filters.totalNotePages}
            </span>
            <button
              className="btn"
              onClick={() => filters.setNotePage(filters.notePage + 1)}
              disabled={filters.notePage >= filters.totalNotePages}
            >
              &gt;
            </button>
          </div>
          <NoteModal modalNote={modalNote} setModalNote={setModalNote} />
        </>
      )}
    </div>
  );
};

export default NotesPanel;
