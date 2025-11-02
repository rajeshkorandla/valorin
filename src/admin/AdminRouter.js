import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import AdminLayout from './layout/AdminLayout';
import Dashboard from './dashboard/Dashboard';
import QuotesPage from './quotes/QuotesPage';
import ClientsPage from './clients/ClientsPage';
import UsersPage from './users/UsersPage';
import UserFormPage from './users/UserFormPage';
import TasksPage from './tasks/TasksPage';
import SettingsPage from './settings/SettingsPage';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      refetchOnWindowFocus: false,
    },
  },
});

export default function AdminRouter() {
  return (
    <QueryClientProvider client={queryClient}>
      <AdminLayout>
        <Routes>
          <Route path="/" element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="quotes" element={<QuotesPage />} />
          <Route path="clients" element={<ClientsPage />} />
          <Route path="users" element={<UsersPage />} />
          <Route path="users/new" element={<UserFormPage />} />
          <Route path="users/:id/edit" element={<UserFormPage />} />
          <Route path="tasks" element={<TasksPage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Routes>
      </AdminLayout>
    </QueryClientProvider>
  );
}
