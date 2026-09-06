import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { DashboardChart } from '../../components/ui/DashboardChart';
import { DataTable } from '../../components/ui/DataTable';
import { ColumnDef } from '@tanstack/react-table';

type UserSummary = {
  id: string;
  name: string;
  email: string;
  role: string;
  status: 'Active' | 'Inactive';
};

const dummyUsers: UserSummary[] = [
  { id: '1', name: 'John Doe', email: 'john@unicore.edu', role: 'Faculty', status: 'Active' },
  { id: '2', name: 'Jane Smith', email: 'jane@unicore.edu', role: 'Student', status: 'Active' },
  { id: '3', name: 'Bob Johnson', email: 'bob@unicore.edu', role: 'Staff', status: 'Inactive' },
  { id: '4', name: 'Alice Williams', email: 'alice@unicore.edu', role: 'Student', status: 'Active' },
  { id: '5', name: 'Charlie Brown', email: 'charlie@unicore.edu', role: 'Student', status: 'Active' },
];

const columns: ColumnDef<UserSummary>[] = [
  { accessorKey: 'name', header: 'Name' },
  { accessorKey: 'email', header: 'Email' },
  { accessorKey: 'role', header: 'Role' },
  { 
    accessorKey: 'status', 
    header: 'Status',
    cell: ({ row }) => (
      <span className={row.original.status === 'Active' ? 'text-green-500 font-medium' : 'text-gray-400'}>
        {row.original.status}
      </span>
    )
  },
];

export default function AdminDashboard() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div>
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <p className="text-[var(--text-muted)]">Overview of the university system.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-[var(--text-muted)]">Total Students</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12,450</div>
            <p className="text-xs text-green-500 mt-1">+12% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-[var(--text-muted)]">Total Faculty</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">842</div>
            <p className="text-xs text-green-500 mt-1">+3% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-[var(--text-muted)]">Active Courses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,204</div>
            <p className="text-xs text-gray-500 mt-1">Same as last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-[var(--text-muted)]">System Health</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">99.9%</div>
            <p className="text-xs text-gray-500 mt-1">All systems operational</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Activity Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <DashboardChart />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Users</CardTitle>
          </CardHeader>
          <CardContent>
            <DataTable columns={columns} data={dummyUsers} />
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
}
