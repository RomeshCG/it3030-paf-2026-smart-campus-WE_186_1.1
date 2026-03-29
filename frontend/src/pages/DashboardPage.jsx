import { useAuth } from '@/context/AuthContext';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppSidebar } from '@/components/app-sidebar';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { Bell } from 'lucide-react';

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

const SECTION_HEADINGS = {
  dashboard: 'Overview',
  bookings: 'Bookings',
  tickets: 'Tickets',
  admin: 'Admin',
  'user-management': 'User Management',
  'admin-management': 'Admin Management',
  'super-admin-management': 'Super Admin Management',
  technician: 'Technician',
  settings: 'System Settings',
};

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [managedUsers, setManagedUsers] = useState(DUMMY_USERS);
  const [activeNav, setActiveNav] = useState('dashboard');

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const role = user?.role ?? 'USER';
  const isSuperAdmin = role === 'SUPER_ADMIN';

  const filteredUsers = useMemo(
    () =>
      managedUsers.filter(
        (managedUser) =>
          managedUser.name.toLowerCase().includes(search.toLowerCase()) ||
          managedUser.email.toLowerCase().includes(search.toLowerCase())
      ),
    [managedUsers, search]
  );
  const roleCounts = useMemo(
    () =>
      ROLE_OPTIONS.reduce(
        (acc, currentRole) => ({
          ...acc,
          [currentRole]: managedUsers.filter((userItem) => userItem.role === currentRole).length,
        }),
        {}
      ),
    [managedUsers]
  );
  const adminUsers = useMemo(
    () => managedUsers.filter((managedUser) => managedUser.role === 'ADMIN'),
    [managedUsers]
  );
  const superAdminUsers = useMemo(
    () => managedUsers.filter((managedUser) => managedUser.role === 'SUPER_ADMIN'),
    [managedUsers]
  );

  const handleRoleChange = (id, nextRole) => {
    setManagedUsers((prev) =>
      prev.map((item) => (item.id === id ? { ...item, role: nextRole } : item))
    );
  };

  useEffect(() => {
    const allowedNav = isSuperAdmin
      ? ['user-management', 'admin-management', 'super-admin-management', 'settings']
      : ['dashboard', 'bookings', 'tickets', 'admin', 'technician', 'settings'];

    if (!allowedNav.includes(activeNav)) {
      setActiveNav(isSuperAdmin ? 'user-management' : 'dashboard');
    }
  }, [activeNav, isSuperAdmin]);

  const sectionTitle = SECTION_HEADINGS[activeNav] ?? 'Overview';

  return (
    <SidebarProvider>
      <AppSidebar
        role={role}
        activeNav={activeNav}
        onNavigate={setActiveNav}
        onLogout={handleLogout}
        onSettings={() => setActiveNav('settings')}
      />
      <SidebarInset>
        <header className="flex h-14 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger />
          <div className="flex flex-1 items-center justify-between gap-4">
            <div>
              <p className="text-xs font-medium text-muted-foreground">{sectionTitle}</p>
              <h1 className="text-lg font-semibold leading-tight md:text-xl">
                Welcome, {user?.name ?? 'User'}
              </h1>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="icon">
                <Bell className="size-4" />
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="gap-2">
                    <Avatar size="sm">
                      <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.name}`} />
                      <AvatarFallback>{user?.name?.charAt(0) ?? 'U'}</AvatarFallback>
                    </Avatar>
                    <span className="hidden sm:inline">{user?.name ?? 'User'}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuItem onClick={() => setActiveNav('settings')}>Settings</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>

        <div className="flex flex-1 flex-col gap-6 p-4 md:p-8">
          <div className="mx-auto w-full max-w-7xl flex-1 space-y-6">
            {activeNav === 'settings' ? (
              <Card>
                <CardHeader>
                  <CardTitle>System Settings</CardTitle>
                  <CardDescription>
                    Future configuration area for permissions, integrations, and campus-wide preferences.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Placeholder page reserved for future system settings.
                  </p>
                </CardContent>
              </Card>
            ) : isSuperAdmin && activeNav === 'user-management' ? (
              <>
                <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  {ROLE_OPTIONS.map((roleOption) => (
                    <Card key={roleOption}>
                      <CardHeader className="pb-2">
                        <CardDescription>{roleOption} users</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <CardTitle className="text-3xl">{roleCounts[roleOption] ?? 0}</CardTitle>
                      </CardContent>
                    </Card>
                  ))}
                </section>

                <section>
                  <Card>
                    <CardHeader className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                      <div>
                        <CardTitle>All Registered Users</CardTitle>
                        <CardDescription>Grouped and manageable by user type</CardDescription>
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
                          <tr className="border-b">
                            <th className="py-2">Name</th>
                            <th className="py-2">Email</th>
                            <th className="py-2">Type</th>
                            <th className="py-2">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredUsers.map((managedUser) => (
                            <tr key={managedUser.id} className="border-b border-border/60">
                              <td className="py-2">{managedUser.name}</td>
                              <td className="py-2">{managedUser.email}</td>
                              <td className="py-2">
                                <Badge variant="outline">{managedUser.role}</Badge>
                              </td>
                              <td className="py-2">
                                <select
                                  className="rounded-md border border-input bg-background px-2 py-1"
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
              </>
            ) : isSuperAdmin && activeNav === 'admin-management' ? (
              <Card>
                <CardHeader>
                  <CardTitle>Admin Management</CardTitle>
                  <CardDescription>Dedicated area for ADMIN accounts and responsibilities</CardDescription>
                </CardHeader>
                <CardContent>
                  <SimpleTable
                    headers={['Name', 'Email', 'Role', 'Permissions']}
                    rows={adminUsers.map((adminUser) => [
                      adminUser.name,
                      adminUser.email,
                      adminUser.role,
                      'Bookings + Tickets',
                    ])}
                  />
                </CardContent>
              </Card>
            ) : isSuperAdmin && activeNav === 'super-admin-management' ? (
              <Card>
                <CardHeader>
                  <CardTitle>Super Admin Management</CardTitle>
                  <CardDescription>
                    Dedicated area for SUPER_ADMIN accounts and governance controls
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <SimpleTable
                    headers={['Name', 'Email', 'Role', 'Scope']}
                    rows={superAdminUsers.map((superAdminUser) => [
                      superAdminUser.name,
                      superAdminUser.email,
                      superAdminUser.role,
                      'Full system governance',
                    ])}
                  />
                </CardContent>
              </Card>
            ) : (
              <>
                <p className="text-sm text-muted-foreground">
                  Role-based dashboard (dummy data). Use the sidebar for core navigation.
                </p>

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

                {role === 'ADMIN' && (
                  <section>
                    <Card>
                      <CardHeader>
                        <CardTitle>Admin Overview</CardTitle>
                        <CardDescription>Operational metrics for admins</CardDescription>
                      </CardHeader>
                      <CardContent className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                        {ADMIN_OVERVIEW_STATS.map((stat) => (
                          <div key={stat.label} className="rounded-lg border border-border p-4">
                            <p className="text-sm text-muted-foreground">{stat.label}</p>
                            <p className="text-2xl font-semibold">{stat.value}</p>
                          </div>
                        ))}
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

                {isSuperAdmin && showAddUserModal && (
                  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
                    <div className="w-full max-w-md rounded-xl border border-border bg-card p-6 text-card-foreground shadow-lg">
                      <h3 className="text-lg font-semibold">Add New User</h3>
                      <p className="mb-4 mt-1 text-sm text-muted-foreground">
                        Placeholder modal for future onboarding flow implementation.
                      </p>
                      <div className="space-y-3">
                        <Input placeholder="Full name" />
                        <Input placeholder="Email address" type="email" />
                        <select className="w-full rounded-md border border-input bg-background px-3 py-2">
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
              </>
            )}
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}

function SimpleTable({ headers, rows }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-left text-sm">
        <thead>
          <tr className="border-b">
            {headers.map((header) => (
              <th key={header} className="py-2">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rowIndex) => (
            <tr key={`row-${rowIndex}`} className="border-b border-border/60">
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
