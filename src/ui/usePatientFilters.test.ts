import React from 'react';
import { render, act } from '@testing-library/react';
import usePatientFilters from './usePatientFilters';
import type { Patient } from '../domain/types';

const patients: Patient[] = [
  { id: 1, name: 'Alice Smith', gender: 'female', date_of_birth: '1990-01-01' },
  { id: 2, name: 'Bob Jones', gender: 'male', date_of_birth: '1985-05-10' },
  { id: 3, name: 'Carol White', gender: 'female', date_of_birth: '2000-12-31' },
];

describe('usePatientFilters', () => {
  let filters: ReturnType<typeof usePatientFilters>;
  const getFilters = (f: ReturnType<typeof usePatientFilters>) => { filters = f; };

  function HookTestComponent({ callback }: { callback: (filters: ReturnType<typeof usePatientFilters>) => void }) {
    const f = usePatientFilters(patients);
    React.useEffect(() => { callback(f); }, [f]);
    return null;
  }

  beforeEach(() => { filters = undefined as any; });

  it('filters patients by name', () => {
    render(React.createElement(HookTestComponent, { callback: getFilters }));
    act(() => { filters.setPatientSearch('alice'); });
    expect(filters.filteredPatients).toHaveLength(1);
    expect(filters.filteredPatients[0].name).toBe('Alice Smith');
  });

  it('filters patients by gender', () => {
    render(React.createElement(HookTestComponent, { callback: getFilters }));
    act(() => { filters.setPatientGenderFilter('male'); });
    expect(filters.filteredPatients).toHaveLength(1);
    expect(filters.filteredPatients[0].name).toBe('Bob Jones');
  });

  it('filters patients by DOB range', () => {
    render(React.createElement(HookTestComponent, { callback: getFilters }));
    act(() => {
      filters.setDobFrom('1990-01-01');
      filters.setDobTo('2001-01-01');
    });
    expect(filters.filteredPatients).toHaveLength(2);
    expect(filters.filteredPatients.map(p => p.name)).toEqual([
      'Alice Smith', 'Carol White'
    ]);
  });

  it('clears patient filters', () => {
    render(React.createElement(HookTestComponent, { callback: getFilters }));
    act(() => {
      filters.setPatientSearch('alice');
      filters.setPatientGenderFilter('female');
      filters.setDobFrom('1990-01-01');
      filters.setDobTo('1991-01-01');
      filters.clearPatientFilters();
    });
    expect(filters.patientSearch).toBe('');
    expect(filters.patientGenderFilter).toBe('');
    expect(filters.dobFrom).toBe('');
    expect(filters.dobTo).toBe('');
    expect(filters.filteredPatients).toHaveLength(3);
  });

  it('returns all unique genders', () => {
    render(React.createElement(HookTestComponent, { callback: getFilters }));
    expect(filters.allGenders.sort()).toEqual(['female', 'male']);
  });

  it('paginates patients', () => {
    render(React.createElement(HookTestComponent, { callback: getFilters }));
    act(() => { filters.setPatientPage(1); });
    expect(filters.paginatedPatients.length).toBeLessThanOrEqual(10);
  });
}); 