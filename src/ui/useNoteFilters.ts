import { useState, useMemo } from 'react';
import type { Note } from '../domain/types';

export function useNoteFilters(notes: Note[], selectedPatientId: number | null) {
  const [noteSearch, setNoteSearch] = useState('');
  const [noteProviderFilter, setNoteProviderFilter] = useState('');
  const [noteHospitalFilter, setNoteHospitalFilter] = useState('');
  const [noteDateFilter, setNoteDateFilter] = useState('');
  const [notePage, setNotePage] = useState(1);
  const [notePageSize, setNotePageSize] = useState(10);

  const selectedNotes = useMemo(() => notes.filter((n) => n.patient_id === selectedPatientId), [notes, selectedPatientId]);
  const filteredNotes = useMemo(() => !!selectedPatientId ? selectedNotes.filter((n) => {
    const matchesText = n.text.toLowerCase().includes(noteSearch.toLowerCase());
    const matchesProvider = noteProviderFilter ? n.provider_name.toLowerCase().includes(noteProviderFilter.toLowerCase()) : true;
    const matchesHospital = noteHospitalFilter ? n.hospital_name === noteHospitalFilter : true;
    const matchesDate = noteDateFilter ? n.creation_date.startsWith(noteDateFilter) : true;
    return matchesText && matchesProvider && matchesHospital && matchesDate;
  }) : [], [selectedNotes, selectedPatientId, noteSearch, noteProviderFilter, noteHospitalFilter, noteDateFilter]);

  const totalNotePages = useMemo(() => Math.ceil(filteredNotes.length / notePageSize), [filteredNotes.length, notePageSize]);
  const paginatedNotes = useMemo(() => filteredNotes.slice((notePage - 1) * notePageSize, notePage * notePageSize), [filteredNotes, notePage, notePageSize]);
  const allHospitals = useMemo(() => Array.from(new Set(notes.map((n) => n.hospital_name))), [notes]);

  function clearNoteFilters() {
    setNoteSearch('');
    setNoteProviderFilter('');
    setNoteHospitalFilter('');
    setNoteDateFilter('');
    setNotePage(1);
  }

  return {
    noteSearch,
    setNoteSearch,
    noteProviderFilter,
    setNoteProviderFilter,
    noteHospitalFilter,
    setNoteHospitalFilter,
    noteDateFilter,
    setNoteDateFilter,
    notePage,
    setNotePage,
    notePageSize,
    setNotePageSize,
    filteredNotes,
    paginatedNotes,
    totalNotePages,
    allHospitals,
    clearNoteFilters,
  };
}

export default useNoteFilters; 