import React from "react";

import type { Note } from "../domain/types";

import "./NoteModal.css";

interface NoteModalProps {
  modalNote: Note | null;
  setModalNote: (n: Note | null) => void;
}

const NoteModal: React.FC<NoteModalProps> = ({ modalNote, setModalNote }) => {
  if (!modalNote) return null;
  return (
    <div
      className="note-modal-backdrop"
      onClick={() => setModalNote(null)}
    >
      <div
        className="note-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <button className="close-btn btn" onClick={() => setModalNote(null)}>
          &times;
        </button>
        <div className="note-modal-header">
          {modalNote.provider_name}{" "}
          <span className="note-modal-hospital">
            @ {modalNote.hospital_name}
          </span>
        </div>
        <div className="note-modal-date">
          {new Date(modalNote.creation_date).toLocaleString()}
        </div>
        <div className="note-modal-text">
          {modalNote.text}
        </div>
      </div>
    </div>
  );
};

export default NoteModal;
