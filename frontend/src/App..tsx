import React, { useState } from 'react';
import { LandingPage } from './components/LandingPage';
import { AuthModal } from './components/AuthModal';
import { PatientDashboard } from './components/PatientDashboard';
import { DoctorDashboard } from './components/DoctorDashboard';
import { HospitalDashboard } from './components/HospitalDashboard';
import { InsuranceDashboard } from './components/InsuranceDashboard';
import { ResearcherDashboard } from './components/ResearcherDashboard';
import { useAuth, User } from './utils/supabase/useAuth';

type UserRole = 'patient' | 'doctor' | 'hospital_admin' | 'insurance' | 'researcher';

export default function App() {
  const { user, loading, error, signOut, setUser } = useAuth();
  const [showAuth, setShowAuth] = useState(false);
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const [selectedRole, setSelectedRole] = useState<UserRole>('patient');

  const handleAuthSuccess = (userData: User) => {
    setUser(userData);
    setShowAuth(false);
  };

  const openAuth = (mode: 'signin' | 'signup', role: UserRole = 'patient') => {
    setAuthMode(mode);
    setSelectedRole(role);
    setShowAuth(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-pulse">
          <div className="h-8 w-32 bg-slate-200 rounded mb-4"></div>
          <div className="h-4 w-48 bg-slate-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 bg-red-500 rounded-full mx-auto mb-4"></div>
          <h2 className="text-lg font-medium text-slate-900 mb-2">Authentication Error</h2>
          <p className="text-slate-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <>
        <LandingPage onAuth={openAuth} />
        {showAuth && (
          <AuthModal
            mode={authMode}
            role={selectedRole}
            onClose={() => setShowAuth(false)}
            onSuccess={handleAuthSuccess}
          />
        )}
      </>
    );
  }

  const renderDashboard = () => {
    switch (user.role) {
      case 'patient':
        return <PatientDashboard user={user} onSignOut={signOut} />;
      case 'doctor':
        return <DoctorDashboard user={user} onSignOut={signOut} />;
      case 'hospital_admin':
        return <HospitalDashboard user={user} onSignOut={signOut} />;
      case 'insurance':
        return <InsuranceDashboard user={user} onSignOut={signOut} />;
      case 'researcher':
        return <ResearcherDashboard user={user} onSignOut={signOut} />;
      default:
        return <PatientDashboard user={user} onSignOut={signOut} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {renderDashboard()}
    </div>
  );
}