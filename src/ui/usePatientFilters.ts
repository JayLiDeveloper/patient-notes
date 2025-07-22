import { useState, useMemo } from 'react';
import type { Patient } from '../domain/types';

export function usePatientFilters(patients: Patient[]) {
  const [patientSearch, setPatientSearch] = useState('');
  const [patientGenderFilter, setPatientGenderFilter] = useState('');
  const [dobFrom, setDobFrom] = useState('');
  const [dobTo, setDobTo] = useState('');
  const [patientPage, setPatientPage] = useState(1);
  const [patientPageSize] = useState(10);

  const filteredPatients = useMemo(() => patients.filter((p) => {
    const matchesName = p.name.toLowerCase().includes(patientSearch.toLowerCase());
    const matchesGender = patientGenderFilter ? p.gender === patientGenderFilter : true;
    let matchesDOB = true;
    if (dobFrom) {
      matchesDOB = matchesDOB && new Date(p.date_of_birth) >= new Date(dobFrom);
    }
    if (dobTo) {
      matchesDOB = matchesDOB && new Date(p.date_of_birth) <= new Date(dobTo);
    }
    return matchesName && matchesGender && matchesDOB;
  }), [patients, patientSearch, patientGenderFilter, dobFrom, dobTo]);

  const totalPatientPages = useMemo(() => Math.ceil(filteredPatients.length / patientPageSize), [filteredPatients.length, patientPageSize]);
  const paginatedPatients = useMemo(() => filteredPatients.slice((patientPage - 1) * patientPageSize, patientPage * patientPageSize), [filteredPatients, patientPage, patientPageSize]);
  const allGenders = useMemo(() => Array.from(new Set(patients.map((p) => p.gender))), [patients]);

  function clearPatientFilters() {
    setPatientSearch('');
    setPatientGenderFilter('');
    setDobFrom('');
    setDobTo('');
    setPatientPage(1);
  }

  return {
    patientSearch,
    setPatientSearch,
    patientGenderFilter,
    setPatientGenderFilter,
    dobFrom,
    setDobFrom,
    dobTo,
    setDobTo,
    patientPage,
    setPatientPage,
    patientPageSize,
    filteredPatients,
    paginatedPatients,
    totalPatientPages,
    allGenders,
    clearPatientFilters,
  };
}

export default usePatientFilters; 