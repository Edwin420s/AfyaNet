import React from 'react';
import { Badge } from '../ui/badge';
import { TabItem } from './types';

interface TabNavigationProps {
  tabs: TabItem[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
  badges?: Record<string, number>;
}

export function TabNavigation({ tabs, activeTab, onTabChange, badges }: TabNavigationProps) {
  return (
    <div className="border-b border-slate-200 mb-8">
      <nav className="flex space-x-8">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const badgeCount = badges?.[tab.id];
          
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
              }`}
            >
              <Icon className="w-4 h-4 mr-2" />
              {tab.label}
              {badgeCount && badgeCount > 0 && (
                <Badge className="ml-2 bg-red-500">{badgeCount}</Badge>
              )}
            </button>
          );
        })}
      </nav>
    </div>
  );
}