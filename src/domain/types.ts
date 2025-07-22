export interface Patient {
  id: number;
  name: string;
  gender: string;
  date_of_birth: string;
}

export interface Note {
  id: number;
  provider_name: string;
  hospital_name: string;
  creation_date: string;
  patient_id: number;
  text: string;
} 