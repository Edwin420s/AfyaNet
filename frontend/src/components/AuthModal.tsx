import React, { useState } from 'react';
import { X, Shield, User, Building, CreditCard, FlaskConical, Eye, EyeOff } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { supabase } from '../utils/supabase/client';
import { projectId } from '../utils/supabase/info';

type UserRole = 'patient' | 'doctor' | 'hospital_admin' | 'insurance' | 'researcher';

interface AuthModalProps {
  mode: 'signin' | 'signup';
  role: UserRole;
  onClose: () => void;
  onSuccess: (user: any) => void;
}

const roleConfig = {
  patient: {
    icon: User,
    title: 'Patient Account',
    description: 'Manage your health records and control data access'
  },
  doctor: {
    icon: Shield,
    title: 'Doctor Portal',
    description: 'Access patient records and manage treatments'
  },
  hospital_admin: {
    icon: Building,
    title: 'Hospital Administration',
    description: 'Manage institution staff and patient data'
  },
  insurance: {
    icon: CreditCard,
    title: 'Insurance Provider',
    description: 'Access claims data and validate treatments'
  },
  researcher: {
    icon: FlaskConical,
    title: 'Research Access',
    description: 'Request anonymized datasets for research'
  }
};

export function AuthModal({ mode, role, onClose, onSuccess }: AuthModalProps) {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    institution: '',
    licenseNumber: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const config = roleConfig[role];
  const Icon = config.icon;

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (mode === 'signup') {
        // Sign up new user
        const response = await fetch(
          `https://${projectId}.supabase.co/functions/v1/make-server-0345afcc/signup`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${publicAnonKey}`,
            },
            body: JSON.stringify({
              email: formData.email,
              password: formData.password,
              name: formData.name,
              role,
              institution: formData.institution,
              licenseNumber: formData.licenseNumber
            }),
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to create account');
        }

        const userData = await response.json();
        onSuccess(userData);
      } else {
        // Sign in existing user
        const { data, error } = await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password,
        });

        if (error) throw error;

        if (data.session) {
          // Fetch user profile
          const response = await fetch(
            `https://${projectId}.supabase.co/functions/v1/make-server-0345afcc/user-profile`,
            {
              headers: {
                'Authorization': `Bearer ${data.session.access_token}`,
              },
            }
          );

          if (!response.ok) {
            throw new Error('Failed to fetch user profile');
          }

          const userData = await response.json();
          onSuccess(userData);
        }
      }
    } catch (err: any) {
      console.error('Authentication error:', err);
      setError(err.message || 'An error occurred during authentication');
    } finally {
      setLoading(false);
    }
  };

  const needsAdditionalFields = mode === 'signup' && (role === 'doctor' || role === 'hospital_admin');

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-green-500 rounded-lg flex items-center justify-center">
                <Icon className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-slate-900">{config.title}</h2>
                <p className="text-sm text-slate-600">{config.description}</p>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'signup' && (
              <div>
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  required
                  className="mt-1"
                  placeholder="Enter your full name"
                />
              </div>
            )}

            <div>
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                required
                className="mt-1"
                placeholder="Enter your email"
              />
            </div>

            <div>
              <Label htmlFor="password">Password</Label>
              <div className="relative mt-1">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  required
                  className="pr-10"
                  placeholder="Enter your password"
                  minLength={6}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </Button>
              </div>
            </div>

            {needsAdditionalFields && (
              <>
                <div>
                  <Label htmlFor="institution">Institution/Hospital</Label>
                  <Input
                    id="institution"
                    type="text"
                    value={formData.institution}
                    onChange={(e) => handleInputChange('institution', e.target.value)}
                    required
                    className="mt-1"
                    placeholder="Your workplace"
                  />
                </div>

                {role === 'doctor' && (
                  <div>
                    <Label htmlFor="licenseNumber">Medical License Number</Label>
                    <Input
                      id="licenseNumber"
                      type="text"
                      value={formData.licenseNumber}
                      onChange={(e) => handleInputChange('licenseNumber', e.target.value)}
                      required
                      className="mt-1"
                      placeholder="Your license number"
                    />
                  </div>
                )}
              </>
            )}

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            <Button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700"
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>{mode === 'signup' ? 'Creating Account...' : 'Signing In...'}</span>
                </div>
              ) : (
                mode === 'signup' ? 'Create Account' : 'Sign In'
              )}
            </Button>
          </form>

          {/* Footer */}
          <div className="mt-6 text-center">
            <p className="text-sm text-slate-600">
              {mode === 'signup' ? 'Already have an account?' : "Don't have an account?"}
              <Button variant="link" className="p-0 ml-1 h-auto font-medium text-blue-600">
                {mode === 'signup' ? 'Sign In' : 'Sign Up'}
              </Button>
            </p>
          </div>

          {mode === 'signup' && (
            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-xs text-blue-700">
                <strong>Note:</strong> This is a demo platform. Do not enter real medical data or personal health information.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}