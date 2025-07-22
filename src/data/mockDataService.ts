import type { Patient, Note } from '../domain/types';

import patientsData from './mock_patients.json';
import notesDataRaw from './mock_notes.json';

export function getPatients(): Patient[] {
  // TODO: replace this with a real API call
  // e.g. fetch('https://api.example.com/patients?page=1&limit=10').then(res => res.json()).catch(err => {
  //   console.error('Error fetching patients:', err);
  //   throw err;
  // }).finally(() => {
  //   console.log('Patients fetched');
  // });
  return patientsData as Patient[];
}

export function getNotes(): Note[] {
  // TODO: replace this with a real API call
  // e.g. fetch('https://api.example.com/notes?patientId=1&page=1&limit=10').then(res => res.json()).catch(err => {
  //   console.error('Error fetching notes:', err);
  //   throw err;
  // }).finally(() => {
  //   console.log('Notes fetched');
  // });
  return notesDataRaw as Note[];
} 