import React from 'react';
import { render, act } from '@testing-library/react';
import useNoteFilters from './useNoteFilters';
import type { Note } from '../domain/types';

const notes: Note[] = [
  { id: 1, provider_name: 'Dr. A', hospital_name: 'General', creation_date: '2024-06-01', patient_id: 1, text: 'Patient is healthy.' },
  { id: 2, provider_name: 'Dr. B', hospital_name: 'City', creation_date: '2024-06-02', patient_id: 1, text: 'Follow-up needed.' },
  { id: 3, provider_name: 'Dr. C', hospital_name: 'General', creation_date: '2024-06-03', patient_id: 2, text: 'Prescribed medication.' },
];

describe('useNoteFilters', () => {
  let filters: ReturnType<typeof useNoteFilters>;
  const getFilters = (f: ReturnType<typeof useNoteFilters>) => { filters = f; };

  function HookTestComponent({ selectedPatientId, callback }: { selectedPatientId: number | null, callback: (filters: ReturnType<typeof useNoteFilters>) => void }) {
    const f = useNoteFilters(notes, selectedPatientId);
    React.useEffect(() => { callback(f); }, [f]);
    return null;
  }

  beforeEach(() => { filters = undefined as any; });

  it('filters notes by selected patient', () => {
    render(React.createElement(HookTestComponent, { selectedPatientId: 1, callback: getFilters }));
    expect(filters.filteredNotes).toHaveLength(2);
    expect(filters.filteredNotes.map(n => n.id)).toEqual([1, 2]);
  });

  it('filters notes by text', () => {
    render(React.createElement(HookTestComponent, { selectedPatientId: 1, callback: getFilters }));
    act(() => { filters.setNoteSearch('follow'); });
    expect(filters.filteredNotes).toHaveLength(1);
    expect(filters.filteredNotes[0].text).toMatch(/follow/i);
  });

  it('filters notes by provider', () => {
    render(React.createElement(HookTestComponent, { selectedPatientId: 1, callback: getFilters }));
    act(() => { filters.setNoteProviderFilter('dr. b'); });
    expect(filters.filteredNotes).toHaveLength(1);
    expect(filters.filteredNotes[0].provider_name).toBe('Dr. B');
  });

  it('filters notes by hospital', () => {
    render(React.createElement(HookTestComponent, { selectedPatientId: 1, callback: getFilters }));
    act(() => { filters.setNoteHospitalFilter('General'); });
    expect(filters.filteredNotes).toHaveLength(1);
    expect(filters.filteredNotes[0].hospital_name).toBe('General');
  });

  it('filters notes by date', () => {
    render(React.createElement(HookTestComponent, { selectedPatientId: 1, callback: getFilters }));
    act(() => { filters.setNoteDateFilter('2024-06-02'); });
    expect(filters.filteredNotes).toHaveLength(1);
    expect(filters.filteredNotes[0].creation_date).toBe('2024-06-02');
  });

  it('clears note filters', () => {
    render(React.createElement(HookTestComponent, { selectedPatientId: 1, callback: getFilters }));
    act(() => {
      filters.setNoteSearch('follow');
      filters.setNoteProviderFilter('dr. b');
      filters.setNoteHospitalFilter('General');
      filters.setNoteDateFilter('2024-06-02');
      filters.clearNoteFilters();
    });
    expect(filters.noteSearch).toBe('');
    expect(filters.noteProviderFilter).toBe('');
    expect(filters.noteHospitalFilter).toBe('');
    expect(filters.noteDateFilter).toBe('');
  });

  it('returns all unique hospitals', () => {
    render(React.createElement(HookTestComponent, { selectedPatientId: 1, callback: getFilters }));
    expect(filters.allHospitals.sort()).toEqual(['City', 'General']);
  });

  it('paginates notes', () => {
    render(React.createElement(HookTestComponent, { selectedPatientId: 1, callback: getFilters }));
    act(() => {
      filters.setNotePageSize(1);
      filters.setNotePage(2);
    });
    expect(filters.paginatedNotes).toHaveLength(1);
    expect(filters.paginatedNotes[0].id).toBe(2);
  });
}); 