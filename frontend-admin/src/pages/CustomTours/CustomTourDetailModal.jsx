import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { regionsAPI } from '../../services/api';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';

const CustomTourDetailModal = ({ tour, onClose }) => {
  const [regions, setRegions] = useState([]);
  const [provinces, setProvinces] = useState([]);

  useEffect(() => {
    fetchRegionsAndProvinces();
  }, [tour]);

  const fetchRegionsAndProvinces = async () => {
    try {
      const regionsData = await regionsAPI.getAll();
      setRegions(regionsData || []);

      if (tour.regionId) {
        const provincesData = await regionsAPI.getProvinces(tour.regionId);
        setProvinces(provincesData || []);
      }
    } catch (err) {
      console.error('Error fetching regions/provinces:', err);
    }
  };

  const getRegionName = () => {
    const region = regions.find(r => r.id === tour.regionId);
    return region ? region.name : 'N/A';
  };

  const getProvinceName = () => {
    const province = provinces.find(p => p.id === tour.provinceId);
    return province ? province.name : 'N/A';
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  const getStatusVariant = (status) => {
    const variants = {
      PENDING: 'warning',
      COMPLETED: 'success',
      REJECTED: 'danger',
      CANCELLED: 'neutral'
    };
    return variants[status] || 'neutral';
  };

  const getStatusLabel = (status) => {
    const labels = {
      PENDING: 'Đang chờ',
      COMPLETED: 'Đã duyệt',
      REJECTED: 'Từ chối',
      CANCELLED: 'Đã hủy'
    };
    return labels[status] || status;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={onClose}>
      <div
        className="bg-white rounded-3xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-5 flex items-center justify-between rounded-t-3xl">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Chi tiết yêu cầu</p>
            <h2 className="text-2xl font-semibold text-slate-900 mt-1">Tour Tùy Chỉnh #{tour.id}</h2>
            <div className="flex items-center gap-2 mt-2">
              <Badge variant={getStatusVariant(tour.status)}>
                {getStatusLabel(tour.status)}
              </Badge>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 transition-colors p-2 hover:bg-slate-100 rounded-full"
            title="Đóng"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-6 space-y-6">

          {/* Tour Info Card */}
          <Card>
            <div className="space-y-4">
              <div>
                <p className="text-xs uppercase tracking-wide text-slate-400 mb-1">Tên tour</p>
                <p className="text-base font-medium text-slate-900">{tour.tourName}</p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <p className="text-xs uppercase tracking-wide text-slate-400 mb-1">Ngày khởi hành</p>
                  <p className="text-sm text-slate-900">{formatDate(tour.startDate)}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wide text-slate-400 mb-1">Ngày kết thúc</p>
                  <p className="text-sm text-slate-900">{formatDate(tour.endDate)}</p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <p className="text-xs uppercase tracking-wide text-slate-400 mb-1">Số người lớn</p>
                  <p className="text-sm text-slate-900">{tour.numAdult} người</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wide text-slate-400 mb-1">Số trẻ em</p>
                  <p className="text-sm text-slate-900">{tour.numChildren} trẻ</p>
                </div>
              </div>
            </div>
          </Card>

          {/* Location Card */}
          <Card>
            <p className="text-xs uppercase tracking-[0.3em] text-slate-400 mb-4">Địa điểm</p>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <p className="text-xs uppercase tracking-wide text-slate-400 mb-1">Khu vực</p>
                <p className="text-sm text-slate-900">{getRegionName()}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide text-slate-400 mb-1">Tỉnh/Thành phố</p>
                <p className="text-sm text-slate-900">{getProvinceName()}</p>
              </div>
            </div>
          </Card>

          {/* Description Card */}
          {tour.description && (
            <Card>
              <p className="text-xs uppercase tracking-[0.3em] text-slate-400 mb-3">Mô tả chi tiết</p>
              <p className="text-sm text-slate-700 whitespace-pre-wrap leading-relaxed">
                {tour.description}
              </p>
            </Card>
          )}

          {/* Metadata Card */}
          <Card className="bg-slate-50">
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-xs uppercase tracking-wide text-slate-400 mb-1">Ngày tạo</p>
                <p className="text-slate-700">{tour.createdAt ? formatDate(tour.createdAt) : 'N/A'}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide text-slate-400 mb-1">Cập nhật lần cuối</p>
                <p className="text-slate-700">{tour.updatedAt ? formatDate(tour.updatedAt) : 'N/A'}</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white border-t border-slate-200 px-6 py-4 rounded-b-3xl">
          <Button
            onClick={onClose}
            variant="ghost"
            className="w-full"
          >
            Đóng
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CustomTourDetailModal;
