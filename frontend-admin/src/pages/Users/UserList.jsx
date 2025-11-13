import { useEffect, useState, useCallback } from 'react';
import UserTable from '../../components/users/UserTable.jsx';
import Card from '../../components/common/Card.jsx';
import Button from '../../components/common/Button.jsx';
import { usersAPI } from '../../services/api.js';
import { useToast } from '../../context/ToastContext.jsx';

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const toast = useToast();

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const data = await usersAPI.getAll();
      // API có thể trả page.content hoặc mảng trực tiếp
      const list = (data && data.content) ? data.content : data || [];
      setUsers(list);
    } catch (err) {
      console.error('Failed to fetch users', err);
      setError('Không thể tải danh sách người dùng.');
      setUsers([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // Quick-create via prompt (thay bằng modal/form khi cần UX tốt hơn)
  const handleCreate = async () => {
    const username = prompt('Username (unique)');
    if (!username) return;
    const fullName = prompt('Full name', username) || username;
    const email = prompt('Email', `${username}@example.com`) || `${username}@example.com`;
    const role = prompt('Role (customer|concierge|admin)', 'customer') || 'customer';

    try {
      setLoading(true);
      await usersAPI.create({ username, fullName, email, role });
      toast?.success?.('User created');
      await fetchUsers();
    } catch (err) {
      console.error('Create user failed', err);
      toast?.error?.('Tạo người dùng thất bại');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = async (row) => {
    const fullName = prompt('Full name', row.fullName || row.username);
    if (fullName == null) return;
    const role = prompt('Role (customer|concierge|admin)', row.role || 'customer') || row.role;
    try {
      setLoading(true);
      await usersAPI.update(row.id, { fullName, role });
      toast?.success?.('User updated');
      await fetchUsers();
    } catch (err) {
      console.error('Update user failed', err);
      toast?.error?.('Cập nhật người dùng thất bại');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (row) => {
    const ok = confirm(`Xác nhận xóa user "${row.username || row.fullName}"?`);
    if (!ok) return;
    try {
      setLoading(true);
      await usersAPI.delete(row.id);
      toast?.success?.('User deleted');
      await fetchUsers();
    } catch (err) {
      console.error('Delete user failed', err);
      toast?.error?.('Xóa người dùng thất bại');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Users & roles</h1>
          <p className="text-sm text-slate-500">Manage customers, concierge team, and admin permissions.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="primary" onClick={handleCreate}>Create user</Button>
          <Button variant="secondary" className="w-full md:w-auto">
            Invite teammate
          </Button>
        </div>
      </div>

      {loading ? (
        <Card className="py-12 text-center text-sm text-slate-500">Đang tải danh sách người dùng...</Card>
      ) : error ? (
        <Card className="py-12 text-center text-sm text-danger">{error}</Card>
      ) : (
        <UserTable users={users} onEdit={handleEdit} onDelete={handleDelete} />
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