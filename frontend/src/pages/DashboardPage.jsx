import { useAuth } from '@/context/AuthContext';
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

const USER_STATS = [
  { label: 'My Active Bookings', value: '4' },
  { label: 'My Open Tickets', value: '2' },
  { label: 'Unread Notifications', value: '7' },
];

const ADMIN_OVERVIEW_STATS = [
  { label: 'Pending Bookings', value: '12' },
  { label: 'Open Tickets', value: '9' },
  { label: 'Total Users', value: '386' },
  { label: 'Resources in Use', value: '42' },
];

const RECENT_BOOKINGS = [
  { id: 'BKG-1042', resource: 'Lab 02', date: '2026-03-27', status: 'Approved' },
  { id: 'BKG-1041', resource: 'Conference Room A', date: '2026-03-26', status: 'Pending' },
  { id: 'BKG-1038', resource: 'Projector P-12', date: '2026-03-24', status: 'Completed' },
];

const RECENT_TICKETS = [
  { id: 'TCK-711', title: 'WiFi outage in Block C', priority: 'High', status: 'Open' },
  { id: 'TCK-704', title: 'AC maintenance request', priority: 'Medium', status: 'In Progress' },
  { id: 'TCK-699', title: 'Printer replacement', priority: 'Low', status: 'Resolved' },
];

const ROLE_OPTIONS = ['USER', 'ADMIN', 'TECHNICIAN', 'SUPER_ADMIN'];
const DUMMY_USERS = [
  { id: 1, name: 'Nimal Perera', email: 'nimal@campus.com', role: 'USER' },
  { id: 2, name: 'Ishara Silva', email: 'ishara@campus.com', role: 'ADMIN' },
  { id: 3, name: 'Kavindu Fernando', email: 'kavindu@campus.com', role: 'TECHNICIAN' },
  { id: 4, name: 'Ayesha Fernando', email: 'ayesha@campus.com', role: 'SUPER_ADMIN' },
  { id: 5, name: 'Ruchira De Silva', email: 'ruchira@campus.com', role: 'USER' },
];

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [managedUsers, setManagedUsers] = useState(DUMMY_USERS);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const role = user?.role ?? 'USER';

  const filteredUsers = useMemo(
    () =>
      managedUsers.filter(
        (managedUser) =>
          managedUser.name.toLowerCase().includes(search.toLowerCase()) ||
          managedUser.email.toLowerCase().includes(search.toLowerCase())
      ),
    [managedUsers, search]
  );

  const handleRoleChange = (id, nextRole) => {
    setManagedUsers((prev) =>
      prev.map((item) => (item.id === id ? { ...item, role: nextRole } : item))
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8 text-slate-900 dark:bg-slate-950 dark:text-slate-100 md:px-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <header className="flex flex-col gap-4 rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold">Welcome, {user?.name ?? 'User'}</h1>
            <p className="text-sm text-slate-500">
              Role: <span className="font-semibold">{role}</span>
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">View Profile</Button>
            <Button variant="destructive" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        </header>

        <section className="grid gap-4 md:grid-cols-3">
          {USER_STATS.map((stat) => (
            <Card key={stat.label}>
              <CardHeader className="pb-2">
                <CardDescription>{stat.label}</CardDescription>
              </CardHeader>
              <CardContent>
                <CardTitle className="text-3xl">{stat.value}</CardTitle>
              </CardContent>
            </Card>
          ))}
        </section>

        <section className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Recent Bookings</CardTitle>
              <CardDescription>Latest 3 bookings</CardDescription>
            </CardHeader>
            <CardContent>
              <SimpleTable
                headers={['Booking ID', 'Resource', 'Date', 'Status']}
                rows={RECENT_BOOKINGS.map((item) => [item.id, item.resource, item.date, item.status])}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Tickets</CardTitle>
              <CardDescription>Latest 3 support tickets</CardDescription>
            </CardHeader>
            <CardContent>
              <SimpleTable
                headers={['Ticket ID', 'Title', 'Priority', 'Status']}
                rows={RECENT_TICKETS.map((item) => [item.id, item.title, item.priority, item.status])}
              />
            </CardContent>
          </Card>
        </section>

        <section className="flex flex-wrap gap-3">
          <Button>Book a Resource</Button>
          <Button variant="secondary">Report an Issue</Button>
          {(role === 'ADMIN' || role === 'SUPER_ADMIN') && (
            <>
              <Button variant="outline">Manage All Bookings</Button>
              <Button variant="outline">Manage All Tickets</Button>
            </>
          )}
        </section>

        {(role === 'ADMIN' || role === 'SUPER_ADMIN') && (
          <section>
            <Card>
              <CardHeader>
                <CardTitle>Admin Overview</CardTitle>
                <CardDescription>Operational metrics for admins</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {ADMIN_OVERVIEW_STATS.map((stat) => (
                  <div key={stat.label} className="rounded-lg border border-slate-200 p-4 dark:border-slate-700">
                    <p className="text-sm text-slate-500">{stat.label}</p>
                    <p className="text-2xl font-semibold">{stat.value}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </section>
        )}

        {role === 'SUPER_ADMIN' && (
          <section>
            <Card>
              <CardHeader className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div>
                  <CardTitle>User Management</CardTitle>
                  <CardDescription>Search and manage user roles</CardDescription>
                </div>
                <div className="flex w-full flex-col gap-2 md:w-auto md:flex-row">
                  <Input
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="Search by name or email"
                    className="md:w-72"
                  />
                  <Button onClick={() => setShowAddUserModal(true)}>Add New User</Button>
                </div>
              </CardHeader>
              <CardContent>
                <table className="w-full border-collapse text-left text-sm">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-slate-700">
                      <th className="py-2">Name</th>
                      <th className="py-2">Email</th>
                      <th className="py-2">Current Role</th>
                      <th className="py-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map((managedUser) => (
                      <tr key={managedUser.id} className="border-b border-slate-100 dark:border-slate-800">
                        <td className="py-2">{managedUser.name}</td>
                        <td className="py-2">{managedUser.email}</td>
                        <td className="py-2">{managedUser.role}</td>
                        <td className="py-2">
                          <select
                            className="rounded-md border border-slate-300 bg-white px-2 py-1 dark:border-slate-700 dark:bg-slate-900"
                            value={managedUser.role}
                            onChange={(event) => handleRoleChange(managedUser.id, event.target.value)}
                          >
                            {ROLE_OPTIONS.map((option) => (
                              <option key={option} value={option}>
                                {option}
                              </option>
                            ))}
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </CardContent>
            </Card>
          </section>
        )}

        {role === 'TECHNICIAN' && (
          <Card>
            <CardHeader>
              <CardTitle>Technician Dashboard Placeholder</CardTitle>
              <CardDescription>
                This role is enabled in RBAC and user management. A dedicated technician dashboard can be built next.
              </CardDescription>
            </CardHeader>
          </Card>
        )}

        {showAddUserModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
            <div className="w-full max-w-md rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
              <h3 className="text-lg font-semibold">Add New User</h3>
              <p className="mb-4 mt-1 text-sm text-slate-500">
                Placeholder modal for future onboarding flow implementation.
              </p>
              <div className="space-y-3">
                <Input placeholder="Full name" />
                <Input placeholder="Email address" type="email" />
                <select className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 dark:border-slate-700 dark:bg-slate-900">
                  {ROLE_OPTIONS.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mt-6 flex justify-end gap-2">
                <Button variant="outline" onClick={() => setShowAddUserModal(false)}>
                  Cancel
                </Button>
                <Button onClick={() => setShowAddUserModal(false)}>Save (Placeholder)</Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function SimpleTable({ headers, rows }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-left text-sm">
        <thead>
          <tr className="border-b border-slate-200 dark:border-slate-700">
            {headers.map((header) => (
              <th key={header} className="py-2">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rowIndex) => (
            <tr key={`row-${rowIndex}`} className="border-b border-slate-100 dark:border-slate-800">
              {row.map((value, colIndex) => (
                <td key={`${rowIndex}-${colIndex}`} className="py-2 pr-2">
                  {value}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
