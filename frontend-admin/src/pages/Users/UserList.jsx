import { useEffect, useState, useCallback } from 'react';
import UserTable from '../../components/users/UserTable.jsx';
import Card from '../../components/common/Card.jsx';
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
      const list = (data && data.content) ? data.content : data || [];

      // Filter out admin users from the list
      const filteredUsers = list.filter(user => {
        const email = user.email?.toLowerCase();
        const username = user.username?.toLowerCase();
        // Exclude admin accounts
        return email !== 'admin@gmail.com' && username !== 'admin';
      });

      setUsers(filteredUsers);
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

  const handleToggleActive = async (user) => {
    const newActiveStatus = !user.active;
    const confirmMessage = newActiveStatus
      ? `Kích hoạt tài khoản "${user.username || user.fullName}"?`
      : `Vô hiệu hóa tài khoản "${user.username || user.fullName}"?`;

    const ok = confirm(confirmMessage);
    if (!ok) return;

    try {
      setLoading(true);
      await usersAPI.update(user.id, { active: newActiveStatus });
      toast?.success?.(newActiveStatus ? 'Đã kích hoạt tài khoản' : 'Đã vô hiệu hóa tài khoản');
      await fetchUsers();
    } catch (err) {
      console.error('Toggle user active failed', err);
      toast?.error?.('Không thể cập nhật trạng thái tài khoản');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (user) => {
    const confirmMessage = `Xóa vĩnh viễn tài khoản "${user.username || user.fullName}"?\n\nHành động này KHÔNG THỂ HOÀN TÁC!`;
    const ok = confirm(confirmMessage);
    if (!ok) return;

    try {
      setLoading(true);
      await usersAPI.delete(user.id);
      toast?.success?.('Đã xóa tài khoản thành công');
      await fetchUsers();
    } catch (err) {
      console.error('Delete user failed', err);
      toast?.error?.('Không thể xóa tài khoản. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Quản lý người dùng</h1>
      </div>

      {loading ? (
        <Card className="py-12 text-center text-sm text-slate-500">Đang tải danh sách người dùng...</Card>
      ) : error ? (
        <Card className="py-12 text-center text-sm text-danger">{error}</Card>
      ) : (
        <UserTable users={users} onToggleActive={handleToggleActive} onDelete={handleDelete} />
      )}

      <Card className="space-y-3 bg-slate-50 border border-slate-200">
        <h3 className="text-sm font-semibold text-slate-700">Lưu ý</h3>
        <ul className="space-y-1 text-sm text-slate-600">
          <li>• Tài khoản bị vô hiệu hóa (Inactive) không thể đăng nhập hệ thống</li>
          <li>• Tài khoản được tạo tự động khi khách hàng đăng ký trên website</li>
          <li>• Chỉ nên vô hiệu hóa tài khoản vi phạm hoặc theo yêu cầu khách hàng</li>
        </ul>
      </Card>
    </div>
  );
};

export default UserList;
