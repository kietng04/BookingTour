import React, { useState, useEffect } from 'react';
import { User, Mail, Phone, Lock, Edit2, Save, X, Eye, EyeOff, Shield } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Profile = () => {
  const { user, logout } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  // Form states
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  // Modal states
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
  const [showChangePhoneModal, setShowChangePhoneModal] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [newPhone, setNewPhone] = useState('');

  useEffect(() => {
    if (user) {
      setFormData({
        fullName: user.fullName || '',
        email: user.email || '',
        phone: user.phoneNumber || '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        throw new Error('Không tìm thấy token xác thực');
      }

      const response = await fetch('/api/users/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          fullName: formData.fullName,
          phoneNumber: formData.phone
        })
      });

      if (!response.ok) {
        throw new Error('Cập nhật thất bại');
      }

      // Update localStorage
      if (formData.fullName) {
        localStorage.setItem('fullName', formData.fullName);
      }
      if (formData.phone) {
        localStorage.setItem('phoneNumber', formData.phone);
      }
      
      // Trigger auth context refresh
      window.dispatchEvent(new Event('auth-changed'));
      
      alert('Cập nhật thông tin thành công!');
      setIsEditing(false);
    } catch (error) {
      alert('Có lỗi xảy ra khi cập nhật thông tin: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async () => {
    if (formData.newPassword !== formData.confirmPassword) {
      alert('Mật khẩu xác nhận không khớp!');
      return;
    }
    
    setLoading(true);
    try {
      // Gửi mã xác nhận qua email
      // await userAPI.sendPasswordChangeVerification(formData.currentPassword, formData.newPassword);
      alert('Mã xác nhận đã được gửi qua email của bạn!');
      setShowChangePasswordModal(true);
    } catch (error) {
      alert('Có lỗi xảy ra khi gửi mã xác nhận!');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyPasswordChange = async () => {
    setIsVerifying(true);
    try {
      // await userAPI.verifyPasswordChange(verificationCode);
      alert('Đổi mật khẩu thành công!');
      setShowChangePasswordModal(false);
      setVerificationCode('');
      setFormData(prev => ({ ...prev, currentPassword: '', newPassword: '', confirmPassword: '' }));
    } catch (error) {
      alert('Mã xác nhận không đúng!');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleChangePhone = async () => {
    setLoading(true);
    try {
      // Gửi mã xác nhận qua email
      // await userAPI.sendPhoneChangeVerification(newPhone);
      alert('Mã xác nhận đã được gửi qua email của bạn!');
      setShowChangePhoneModal(true);
    } catch (error) {
      alert('Có lỗi xảy ra khi gửi mã xác nhận!');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyPhoneChange = async () => {
    setIsVerifying(true);
    try {
      // await userAPI.verifyPhoneChange(newPhone, verificationCode);
      alert('Thay đổi số điện thoại thành công!');
      setShowChangePhoneModal(false);
      setVerificationCode('');
      setNewPhone('');
      setFormData(prev => ({ ...prev, phone: newPhone }));
    } catch (error) {
      alert('Mã xác nhận không đúng!');
    } finally {
      setIsVerifying(false);
    }
  };

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <p className="text-gray-600">Vui lòng đăng nhập để xem hồ sơ</p>
        </div>
      </div>
    );
  }

  // Kiểm tra nếu user đăng nhập qua OAuth (Google/GitHub) thì không cho chỉnh sửa mật khẩu
    const isOAuthUser = user?.provider && (user.provider === 'google' || user.provider === 'github');
  
  // Check if user has missing information
  const hasMissingInfo = !user?.phoneNumber || !user?.fullName;

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Hồ sơ của tôi</h1>
        <p className="text-gray-600">Quản lý thông tin cá nhân và bảo mật tài khoản</p>
        {isOAuthUser && (
          <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-md">
            <p className="text-sm text-blue-800">
              <Shield className="w-4 h-4 inline mr-1" />
              Tài khoản được bảo mật bởi {user.provider === 'google' ? 'Google' : 'GitHub'}. 
              Một số thông tin không thể chỉnh sửa.
            </p>
          </div>
        )}
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-brand-100 rounded-full flex items-center justify-center">
                {user.avatar ? (
                  <img 
                    src={user.avatar} 
                    alt={user.fullName || 'Avatar'} 
                    className="w-16 h-16 rounded-full object-cover"
                  />
                ) : (
                  <User className="w-8 h-8 text-brand-600" />
                )}
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">{user.fullName || 'Người dùng'}</h2>
                <p className="text-gray-600">{user.email}</p>
                {isOAuthUser && (
                  <p className="text-xs text-blue-600 mt-1">
                    Đăng nhập qua {user.provider === 'google' ? 'Google' : 'GitHub'}
                  </p>
                )}
              </div>
            </div>
            {(!isOAuthUser || (isOAuthUser && hasMissingInfo)) && (
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500"
              >
                {isEditing ? (
                  <>
                    <X className="w-4 h-4" />
                    Hủy
                  </>
                ) : (
                  <>
                    <Edit2 className="w-4 h-4" />
                    {isOAuthUser ? 'Hoàn thiện thông tin' : 'Chỉnh sửa'}
                  </>
                )}
              </button>
            )}
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Thông tin cơ bản */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Thông tin cơ bản</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <User className="w-4 h-4 inline mr-2" />
                  Họ và tên
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  disabled={!isEditing || (isOAuthUser && user?.fullName)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 disabled:bg-gray-50 disabled:text-gray-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Mail className="w-4 h-4 inline mr-2" />
                  Email
                </label>
                <input
                  type="email"
                  value={formData.email}
                  disabled
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-500"
                />
                <p className="text-xs text-gray-500 mt-1">Email không thể thay đổi</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Phone className="w-4 h-4 inline mr-2" />
                  Số điện thoại
                </label>
                <div className="flex gap-2">
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 disabled:bg-gray-50 disabled:text-gray-500"
                  />
                  {!isEditing && !isOAuthUser && (
                    <button
                      onClick={() => setShowChangePhoneModal(true)}
                      className="px-3 py-2 text-sm font-medium text-brand-600 border border-brand-300 rounded-md hover:bg-brand-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500"
                    >
                      Thay đổi
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Bảo mật - chỉ hiển thị cho tài khoản thường (không phải OAuth) */}
          {!isOAuthUser && (
            <div className="space-y-4 border-t border-gray-200 pt-6">
              <h3 className="text-lg font-medium text-gray-900">Bảo mật</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Lock className="w-4 h-4 inline mr-2" />
                    Mật khẩu hiện tại
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="currentPassword"
                      value={formData.currentPassword}
                      onChange={handleInputChange}
                      placeholder="Nhập mật khẩu hiện tại"
                      className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4 text-gray-400" />
                      ) : (
                        <Eye className="h-4 w-4 text-gray-400" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Mật khẩu mới
                    </label>
                    <input
                      type="password"
                      name="newPassword"
                      value={formData.newPassword}
                      onChange={handleInputChange}
                      placeholder="Nhập mật khẩu mới"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Xác nhận mật khẩu mới
                    </label>
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        placeholder="Nhập lại mật khẩu mới"
                        className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="h-4 w-4 text-gray-400" />
                        ) : (
                          <Eye className="h-4 w-4 text-gray-400" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Action buttons */}
          <div className="flex justify-center gap-4 pt-6 border-t border-gray-200">
            {isEditing && (
              <button
                onClick={handleSave}
                disabled={loading}
                className="inline-flex items-center gap-2 px-6 py-2 bg-brand-600 text-white font-medium rounded-md hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Đang cập nhật...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    {isOAuthUser ? 'Lưu thông tin' : 'Cập nhật thông tin'}
                  </>
                )}
              </button>
            )}
            
            {!isOAuthUser && (
              <button
                onClick={handleChangePassword}
                disabled={loading || !formData.currentPassword || !formData.newPassword || !formData.confirmPassword}
                className="inline-flex items-center gap-2 px-6 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Shield className="w-4 h-4" />
                Thay đổi mật khẅu
              </button>
            )}
          </div>

          {/* Thông báo cho OAuth users */}
          {isOAuthUser && (
            <div className="pt-6 border-t border-gray-200">
              <div className="bg-gray-50 border border-gray-200 rounded-md p-4 text-center">
                <Shield className="w-6 h-6 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-600">
                  Tài khoản của bạn được bảo mật bởi <strong>{user.provider === 'google' ? 'Google' : 'GitHub'}</strong>.
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Để thay đổi mật khẩu, vui lòng truy cập trang cài đặt của {user.provider === 'google' ? 'Google' : 'GitHub'}.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Change Password Modal */}
      {showChangePasswordModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Xác nhận thay đổi mật khẩu</h3>
              <button 
                onClick={() => setShowChangePasswordModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="mb-6">
              <p className="text-gray-600 mb-4">
                Chúng tôi đã gửi mã xác nhận đến email <strong>{user.email}</strong>
              </p>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mã xác nhận
              </label>
              <input
                type="text"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                placeholder="Nhập mã xác nhận 6 số"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
              />
            </div>
            
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowChangePasswordModal(false)}
                className="px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500"
              >
                Hủy bỏ
              </button>
              <button
                onClick={handleVerifyPasswordChange}
                disabled={isVerifying || !verificationCode}
                className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isVerifying ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Đang xác nhận...
                  </>
                ) : (
                  'Xác nhận'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Change Phone Modal */}
      {showChangePhoneModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Thay đổi số điện thoại</h3>
              <button 
                onClick={() => setShowChangePhoneModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="mb-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Số điện thoại mới
                </label>
                <input
                  type="tel"
                  value={newPhone}
                  onChange={(e) => setNewPhone(e.target.value)}
                  placeholder="Nhập số điện thoại mới"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
                />
              </div>
              
              {!verificationCode && (
                <button
                  onClick={handleChangePhone}
                  disabled={loading || !newPhone}
                  className="w-full px-4 py-2 bg-brand-600 text-white font-medium rounded-md hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Đang gửi mã...' : 'Gửi mã xác nhận'}
                </button>
              )}
              
              {verificationCode !== '' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mã xác nhận
                  </label>
                  <input
                    type="text"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value)}
                    placeholder="Nhập mã xác nhận từ email"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
                  />
                </div>
              )}
            </div>
            
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => {
                  setShowChangePhoneModal(false);
                  setVerificationCode('');
                  setNewPhone('');
                }}
                className="px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500"
              >
                Hủy bỏ
              </button>
              {verificationCode && (
                <button
                  onClick={handleVerifyPhoneChange}
                  disabled={isVerifying || !verificationCode}
                  className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isVerifying ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Đang xác nhận...
                    </>
                  ) : (
                    'Xác nhận'
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
