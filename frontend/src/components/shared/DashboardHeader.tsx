import React from 'react';
import { LogOut } from 'lucide-react';
import { Button } from '../ui/button';
import { User } from './types';

interface DashboardHeaderProps {
  user: User;
  onSignOut: () => void;
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  subtitle: string;
}

export function DashboardHeader({ user, onSignOut, icon: Icon, title, subtitle }: DashboardHeaderProps) {
  return (
    <header className="bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-4">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-green-500 rounded-lg flex items-center justify-center">
              <Icon className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-slate-900">{title}</h1>
              <p className="text-sm text-slate-600">{subtitle}</p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="text-right">
              <p className="font-medium text-slate-900">
                {user.role === 'doctor' ? `Dr. ${user.name}` : user.name}
              </p>
              <p className="text-sm text-slate-500">
                {user.role === 'hospital_admin' ? 'Administrator' : 
                 user.role === 'insurance' ? 'Insurance Provider' :
                 user.role.charAt(0).toUpperCase() + user.role.slice(1)}
              </p>
            </div>
            <Button variant="outline" onClick={onSignOut}>
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}