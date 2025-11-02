import { useEffect, useState } from 'react';
import UserTable from '../../components/users/UserTable.jsx';
import Card from '../../components/common/Card.jsx';
import Button from '../../components/common/Button.jsx';
import { usersAPI } from '../../services/api.js';

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        setError('');
        const data = await usersAPI.getAll();
        setUsers(data || []);
      } catch (err) {
        console.error('Failed to fetch users', err);
        setError('Không thể tải danh sách người dùng.');
        setUsers([]);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Users & roles</h1>
          <p className="text-sm text-slate-500">Manage customers, concierge team, and admin permissions.</p>
        </div>
        <Button variant="secondary" className="w-full md:w-auto">
          Invite teammate
        </Button>
      </div>

      {loading ? (
        <Card className="py-12 text-center text-sm text-slate-500">Đang tải danh sách người dùng...</Card>
      ) : error ? (
        <Card className="py-12 text-center text-sm text-danger">{error}</Card>
      ) : (
        <UserTable users={users} />
      )}

      <Card className="space-y-3 bg-slate-900 text-slate-100">
        <h3 className="text-lg font-semibold">Role management tips</h3>
        <ul className="space-y-2 text-sm text-slate-200">
          <li>• Customers see bookings, profiles, payment methods.</li>
          <li>• Concierge users can update bookings and itineraries.</li>
          <li>• Admins manage tours, pricing, reviews, and settings.</li>
        </ul>
      </Card>
    </div>
  );
};

export default UserList;
