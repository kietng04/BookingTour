import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Eye, CheckCircle } from 'lucide-react';
import Table from '../common/Table.jsx';
import StatusPill from '../common/StatusPill.jsx';
import Button from '../common/Button.jsx';
import { formatCurrency, formatDate } from '../../utils/format.js';
import { paymentsAPI, bookingsAPI } from '../../services/api.js';

const BookingTable = ({ bookings, onRefresh }) => {
  const [paymentStatuses, setPaymentStatuses] = useState({});
  const [confirmingIds, setConfirmingIds] = useState(new Set());

  useEffect(() => {
    // Fetch payment status for all bookings
    const fetchPaymentStatuses = async () => {
      console.log('[BookingTable] Fetching payment statuses for', bookings.length, 'bookings');
      const statuses = {};
      for (const booking of bookings) {
        try {
          console.log(`[BookingTable] Fetching payment for booking ID: ${booking.id}`);
          const payment = await paymentsAPI.getByBookingId(booking.id);
          console.log(`[BookingTable] Payment response for booking ${booking.id}:`, payment);
          statuses[booking.id] = payment?.status || 'UNKNOWN';
        } catch (err) {
          console.error(`[BookingTable] Failed to fetch payment for booking ${booking.id}:`, err);
          console.error(`[BookingTable] Error details:`, err.response || err.message);
          statuses[booking.id] = 'UNKNOWN';
        }
      }
      console.log('[BookingTable] Final payment statuses:', statuses);
      setPaymentStatuses(statuses);
    };

    if (bookings.length > 0) {
      fetchPaymentStatuses();
    }
  }, [bookings]);

  const handleConfirmBooking = async (bookingId) => {
    if (!window.confirm('Xác nhận đặt chỗ này? Khách hàng sẽ nhận email xác nhận.')) {
      return;
    }

    setConfirmingIds(prev => new Set(prev).add(bookingId));
    try {
      await bookingsAPI.confirm(bookingId);
      alert('Đã xác nhận đặt chỗ thành công!');
      if (onRefresh) {
        onRefresh();
      }
    } catch (err) {
      console.error('Failed to confirm booking:', err);
      alert('Lỗi khi xác nhận đặt chỗ: ' + (err.message || 'Unknown error'));
    } finally {
      setConfirmingIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(bookingId);
        return newSet;
      });
    }
  };

  const renderPaymentStatus = (bookingId) => {
    const status = paymentStatuses[bookingId];
    if (!status) return <span className="text-xs text-slate-400">Đang tải...</span>;

    const statusConfig = {
      COMPLETED: { label: 'Đã thanh toán', color: 'bg-green-100 text-green-700' },
      PENDING: { label: 'Chờ thanh toán', color: 'bg-yellow-100 text-yellow-700' },
      PROCESSING: { label: 'Đang xử lý', color: 'bg-blue-100 text-blue-700' },
      FAILED: { label: 'Thất bại', color: 'bg-red-100 text-red-700' },
      REFUNDED: { label: 'Đã hoàn tiền', color: 'bg-purple-100 text-purple-700' },
      UNKNOWN: { label: 'Không xác định', color: 'bg-slate-100 text-slate-500' }
    };

    const config = statusConfig[status] || statusConfig.UNKNOWN;

    return (
      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
        {config.label}
      </span>
    );
  };

  // Calculate booking count per user
  const userBookingCount = bookings.reduce((acc, booking) => {
    acc[booking.userId] = (acc[booking.userId] || 0) + 1;
    return acc;
  }, {});

  const columns = [
    {
      key: 'tourName',
      label: 'Tên Tour',
      render: (value, row) => (
        <div>
          <p className="font-medium text-slate-800">{value}</p>
          <p className="text-xs text-slate-400 font-mono">ID: {row.id}</p>
        </div>
      )
    },
    {
      key: 'guestName',
      label: 'Người dùng',
      render: (value, row) => (
        <div>
          <p className="font-medium text-slate-800">{value}</p>
          <p className="text-xs text-slate-400">User ID: {row.userId}</p>
        </div>
      )
    },
    {
      key: 'travelDate',
      label: 'Ngày khởi hành',
      render: (value) => formatDate(value)
    },
    {
      key: 'userId',
      label: 'Số booking',
      render: (value) => (
        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
          {userBookingCount[value] || 0} booking
        </span>
      )
    },
    {
      key: 'amount',
      label: 'Tổng tiền',
      render: (value) => formatCurrency(value)
    },
    {
      key: 'id',
      label: 'Thanh toán',
      render: (value) => renderPaymentStatus(value)
    },
    {
      key: 'status',
      label: 'Trạng thái',
      render: (value) => <StatusPill status={value} />
    }
  ];

  return (
    <Table
      columns={columns}
      data={bookings}
      renderRowActions={(row) => {
        const isPending = row.status === 'PENDING';
        const isPaymentCompleted = paymentStatuses[row.id] === 'COMPLETED';
        const showConfirmButton = isPending && isPaymentCompleted;
        const isConfirming = confirmingIds.has(row.id);

        // Debug log for button visibility
        if (isPending) {
          console.log(`[BookingTable] Row ${row.id} - Status: ${row.status}, Payment: ${paymentStatuses[row.id]}, Show button: ${showConfirmButton}`);
        }

        return (
          <div className="flex items-center gap-2">
            {showConfirmButton && (
              <Button
                onClick={() => handleConfirmBooking(row.id)}
                size="sm"
                variant="primary"
                disabled={isConfirming}
              >
                <CheckCircle className="h-4 w-4" />
                {isConfirming ? 'Đang xác nhận...' : 'Xác nhận'}
              </Button>
            )}
            <Button to={`/bookings/${row.id}`} size="sm" variant="ghost">
              <Eye className="h-4 w-4" />
              Xem chi tiết
            </Button>
          </div>
        );
      }}
    />
  );
};

BookingTable.propTypes = {
  bookings: PropTypes.arrayOf(PropTypes.object).isRequired,
  onRefresh: PropTypes.func
};

export default BookingTable;
