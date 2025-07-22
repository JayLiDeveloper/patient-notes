import { useState } from 'react'
import { ErrorBoundary } from 'react-error-boundary';

import PatientListPanel from './ui/PatientListPanel';
import NotesPanel from './ui/NotesPanel';

import './App.css'

function ErrorFallback({ error }: { error: Error }) {
  return (
    <div className="panel loading-panel" style={{ color: 'red', flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <h2>Something went wrong.</h2>
      <pre style={{ whiteSpace: 'pre-wrap', color: '#b91c1c' }}>{String(error.message || error)}</pre>
    </div>
  );
}

function App() {
  // Selected patientId state
  const [selectedPatientId, setSelectedPatientId] = useState<number | null>(null);

  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <div id="root">
        <PatientListPanel
          selectedPatientId={selectedPatientId}
          setSelectedPatientId={setSelectedPatientId}
        />
        <NotesPanel
          selectedPatientId={selectedPatientId}
        />
      </div>
    </ErrorBoundary>
  );
}

export default App
