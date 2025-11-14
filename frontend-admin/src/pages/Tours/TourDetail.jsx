import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, MapPin, Users, DollarSign, Clock } from 'lucide-react';
import Card from '../../components/common/Card.jsx';
import Button from '../../components/common/Button.jsx';
import Badge from '../../components/common/Badge.jsx';
import { toursAPI, departuresAPI } from '../../services/api.js';

const TourDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [tour, setTour] = useState(null);
  const [departures, setDepartures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError('');

        // Fetch tour details and departures in parallel
        const [tourData, departuresData] = await Promise.all([
          toursAPI.getById(id),
          departuresAPI.getByTour(id)
        ]);

        setTour(tourData);
        setDepartures(departuresData || []);
      } catch (err) {
        console.error('Failed to fetch tour details:', err);
        setError('Không thể tải thông tin tour. Vui lòng thử lại sau.');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchData();
    }
  }, [id]);

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0
    }).format(value || 0);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '—';
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  const getStatusBadge = (status) => {
    const variants = {
      'ACTIVE': 'success',
      'UNACTIVE': 'secondary',
      'FULL': 'danger',
      'END': 'secondary'
    };
    return variants[status] || 'secondary';
  };

  const getDepartureStatusBadge = (status) => {
    const variants = {
      'CONCHO': 'success',
      'SAPFULL': 'warning',
      'FULL': 'danger',
      'DAKHOIHANH': 'secondary'
    };
    const labels = {
      'CONCHO': 'Còn chỗ',
      'SAPFULL': 'Sắp full',
      'FULL': 'Đã đầy',
      'DAKHOIHANH': 'Đã khởi hành'
    };
    return { variant: variants[status] || 'secondary', label: labels[status] || status };
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Button variant="secondary" onClick={() => navigate('/tours')}>
          <ArrowLeft className="h-4 w-4" />
          Quay lại
        </Button>
        <Card className="py-12 text-center text-sm text-slate-500">
          Đang tải thông tin tour...
        </Card>
      </div>
    );
  }

  if (error || !tour) {
    return (
      <div className="space-y-6">
        <Button variant="secondary" onClick={() => navigate('/tours')}>
          <ArrowLeft className="h-4 w-4" />
          Quay lại
        </Button>
        <Card className="py-12 text-center text-sm text-danger">
          {error || 'Không tìm thấy tour'}
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3">
          <Button variant="secondary" onClick={() => navigate('/tours')}>
            <ArrowLeft className="h-4 w-4" />
            Quay lại
          </Button>
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">{tour.tourName}</h1>
            <p className="text-sm text-slate-500">Tour ID: {tour.id}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" to={`/tours/${id}/edit`}>
            Chỉnh sửa
          </Button>
          <Button to={`/departures/new?tourId=${id}`}>
            Thêm Departure
          </Button>
        </div>
      </div>

      {/* Tour Info Cards */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Basic Info */}
        <Card className="space-y-4">
          <h3 className="text-lg font-semibold text-slate-900">Thông tin cơ bản</h3>

          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <Badge variant={getStatusBadge(tour.status)}>{tour.status}</Badge>
            </div>

            <div className="flex items-start gap-3">
              <MapPin className="h-5 w-5 text-slate-400 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium text-slate-700">Tuyến đường</p>
                <p className="text-sm text-slate-600">
                  {tour.departurePoint} → {tour.mainDestination}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Clock className="h-5 w-5 text-slate-400 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium text-slate-700">Thời lượng</p>
                <p className="text-sm text-slate-600">
                  {tour.days} ngày {tour.nights} đêm
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <DollarSign className="h-5 w-5 text-slate-400 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium text-slate-700">Giá</p>
                <p className="text-sm text-slate-600">
                  Người lớn: {formatCurrency(tour.adultPrice)}<br />
                  Trẻ em: {formatCurrency(tour.childPrice)}
                </p>
              </div>
            </div>

            {tour.slug && (
              <div className="flex items-start gap-3">
                <div className="h-5 w-5"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-slate-700">Slug</p>
                  <p className="text-sm text-slate-600 font-mono">{tour.slug}</p>
                </div>
              </div>
            )}
          </div>
        </Card>

        {/* Image */}
        <Card className="space-y-4">
          <h3 className="text-lg font-semibold text-slate-900">Ảnh đại diện</h3>
          {tour.heroImageUrl ? (
            <img
              src={tour.heroImageUrl}
              alt={tour.tourName}
              className="w-full h-64 object-cover rounded-lg"
            />
          ) : (
            <div className="w-full h-64 bg-slate-100 rounded-lg flex items-center justify-center text-slate-400">
              Chưa có ảnh
            </div>
          )}
        </Card>
      </div>

      {/* Description */}
      {tour.description && (
        <Card className="space-y-4">
          <h3 className="text-lg font-semibold text-slate-900">Mô tả</h3>
          <p className="text-sm text-slate-600 whitespace-pre-wrap">{tour.description}</p>
        </Card>
      )}

      {/* Departures */}
      <Card className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-slate-900">
            Departures ({departures.length})
          </h3>
          <Button size="sm" to={`/departures/new?tourId=${id}`}>
            Thêm Departure
          </Button>
        </div>

        {departures.length === 0 ? (
          <div className="py-8 text-center text-sm text-slate-500">
            Chưa có departure nào. Hãy thêm departure mới!
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-slate-200 bg-slate-50">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold text-slate-700">ID</th>
                  <th className="px-4 py-3 text-left font-semibold text-slate-700">
                    <Calendar className="inline h-4 w-4 mr-1" />
                    Ngày khởi hành
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-slate-700">
                    <Calendar className="inline h-4 w-4 mr-1" />
                    Ngày kết thúc
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-slate-700">
                    <Users className="inline h-4 w-4 mr-1" />
                    Chỗ ngồi
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-slate-700">Trạng thái</th>
                  <th className="px-4 py-3 text-right font-semibold text-slate-700">Hành động</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {departures.map((departure) => {
                  const statusBadge = getDepartureStatusBadge(departure.status);
                  return (
                    <tr key={departure.id} className="hover:bg-slate-50">
                      <td className="px-4 py-3 text-slate-600">#{departure.id}</td>
                      <td className="px-4 py-3 text-slate-600">
                        {formatDate(departure.startDate)}
                      </td>
                      <td className="px-4 py-3 text-slate-600">
                        {formatDate(departure.endDate)}
                      </td>
                      <td className="px-4 py-3 text-slate-600">
                        {departure.remainingSlots}/{departure.totalSlots}
                      </td>
                      <td className="px-4 py-3">
                        <Badge variant={statusBadge.variant}>{statusBadge.label}</Badge>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <Button
                          variant="secondary"
                          size="sm"
                          to={`/departures/${departure.id}/edit?tourId=${id}`}
                        >
                          Chi tiết
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
};

export default TourDetail;
