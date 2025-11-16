import { useState, useEffect } from 'react';
import { useParams, useLocation, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, Users, MapPin, Edit, Trash2 } from 'lucide-react';
import Card from '../../components/common/Card.jsx';
import Table from '../../components/common/Table.jsx';
import StatusPill from '../../components/common/StatusPill.jsx';
import Badge from '../../components/common/Badge.jsx';
import Button from '../../components/common/Button.jsx';
import ConfirmDialog from '../../components/common/ConfirmDialog.jsx';
import { bookingsAPI, departuresAPI } from '../../services/api.js';
import { useToast } from '../../context/ToastContext';

const DepartureDetail = () => {
  const { departureId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const toast = useToast();
  const departure = location.state?.departure;

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 0, size: 20 });
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (departureId) {
      fetchBookings();
    }
  }, [departureId, pagination.page]);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const data = await bookingsAPI.getByDeparture(departureId, {
        page: pagination.page,
        size: pagination.size,
      });

      setBookings(data.content || data);
    } catch (err) {
      console.error('Failed to fetch bookings:', err);
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    navigate(`/departures/${departureId}/edit`, {
      state: { departure }
    });
  };

  const handleDeleteClick = () => {
    setShowDeleteDialog(true);
  };

  const handleDeleteConfirm = async () => {
    if (!departure) return;

    setIsDeleting(true);
    try {
      await departuresAPI.delete(departure.tourId, departureId);
      toast.success('Departure deleted successfully');
      navigate('/departures');
    } catch (error) {
      console.error('Failed to delete departure:', error);

      let errorMessage = 'Failed to delete departure';
      if (error.response?.status === 400) {
        errorMessage = 'Cannot delete departure with active bookings';
      } else if (error.response?.status === 404) {
        errorMessage = 'Departure not found';
      } else if (error.message) {
        errorMessage = error.message;
      }

      toast.error(errorMessage);
      setShowDeleteDialog(false);
    } finally {
      setIsDeleting(false);
    }
  };

  const hasBookings = bookings && bookings.length > 0;
  const reservedSlots = departure ? (departure.totalSlots - departure.remainingSlots) : 0;

  const columns = [
    {
      key: 'id',
      label: 'Booking ID',
      render: (value, row) => (
        <span className="font-mono text-sm text-slate-700">#{row.id}</span>
      ),
    },
    {
      key: 'userId',
      label: 'Customer',
      render: (value, row) => (
        <div>
          <p className="font-medium text-slate-900">User ID: {row.userId}</p>
          <p className="text-xs text-slate-500">Booked {new Date(row.createdAt).toLocaleDateString()}</p>
        </div>
      ),
    },
    {
      key: 'numSeats',
      label: 'Seats',
      render: (value, row) => (
        <Badge variant="secondary">
          {row.numSeats} {row.numSeats > 1 ? 'seats' : 'seat'}
        </Badge>
      ),
    },
    {
      key: 'totalAmount',
      label: 'Amount',
      render: (value, row) => (
        <span className="font-semibold text-slate-900">
          ${row.totalAmount.toLocaleString()}
        </span>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      render: (value, row) => <StatusPill status={row.status} />,
    },
  ];

  if (!departure && !loading) {
    return (
      <div className="space-y-8">
        <Link to="/departures" className="inline-flex items-center gap-2 text-sm font-semibold text-primary-500">
          <ArrowLeft className="h-4 w-4" />
          Back to departures
        </Link>
        <Card className="text-center py-12">
          <p className="text-sm text-slate-500">Departure not found</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <Link to="/departures" className="inline-flex items-center gap-2 text-sm font-semibold text-primary-500">
        <ArrowLeft className="h-4 w-4" />
        Back to all departures
      </Link>

      {departure && (
        <>
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-slate-900">{departure.tourName}</h1>
              <p className="text-sm text-slate-500">Departure Details</p>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={handleEdit}
                variant="secondary"
                className="flex items-center gap-2"
              >
                <Edit className="h-4 w-4" />
                Edit
              </Button>
              <Button
                onClick={handleDeleteClick}
                variant="danger"
                className="flex items-center gap-2"
                disabled={reservedSlots > 0}
                title={hasBookings && reservedSlots > 0 ? 'Cannot delete departure with bookings' : 'Delete departure'}
              >
                <Trash2 className="h-4 w-4" />
                Delete
              </Button>
            </div>
          </div>

          {hasBookings && reservedSlots > 0 && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <div className="flex gap-3">
                <div className="flex-shrink-0">
                  <svg className="w-5 h-5 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-amber-900">Cannot Delete</h3>
                  <p className="mt-1 text-sm text-amber-700">
                    This departure has {reservedSlots} active booking(s) and cannot be deleted.
                    Cancel all bookings before deleting the departure.
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="grid gap-6 md:grid-cols-3">
            <Card className="space-y-3">
              <div className="flex items-center gap-2 text-primary-600">
                <Calendar className="h-5 w-5" />
                <h3 className="font-semibold text-slate-900">Departure Dates</h3>
              </div>
              <div>
                <p className="text-sm text-slate-900">
                  {new Date(departure.startDate).toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </p>
                <p className="text-xs text-slate-500">
                  to {new Date(departure.endDate).toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </p>
              </div>
            </Card>

            <Card className="space-y-3">
              <div className="flex items-center gap-2 text-primary-600">
                <Users className="h-5 w-5" />
                <h3 className="font-semibold text-slate-900">Availability</h3>
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">{departure.remainingSlots}</p>
                <p className="text-sm text-slate-500">of {departure.totalSlots} seats remaining</p>
                <div className="mt-2 w-full bg-slate-200 rounded-full h-2">
                  <div
                    className={`h-full rounded-full ${
                      (departure.remainingSlots / departure.totalSlots) * 100 > 50
                        ? 'bg-green-500'
                        : 'bg-amber-500'
                    }`}
                    style={{
                      width: `${(departure.remainingSlots / departure.totalSlots) * 100}%`,
                    }}
                  />
                </div>
              </div>
            </Card>

            <Card className="space-y-3">
              <div className="flex items-center gap-2 text-primary-600">
                <MapPin className="h-5 w-5" />
                <h3 className="font-semibold text-slate-900">Status</h3>
              </div>
              <div>
                <StatusPill status={departure.status} />
                <p className="mt-2 text-xs text-slate-500">Departure ID: {departure.departureId}</p>
              </div>
            </Card>
          </div>
        </>
      )}

      <div>
        <h2 className="text-lg font-semibold text-slate-900 mb-4">Customer Bookings</h2>
        {loading ? (
          <Card className="text-center py-12">
            <p className="text-sm text-slate-500">Loading bookings...</p>
          </Card>
        ) : bookings.length === 0 ? (
          <Card className="text-center py-12">
            <p className="text-sm text-slate-500">No bookings for this departure yet</p>
          </Card>
        ) : (
          <Card>
            <Table columns={columns} data={bookings} />
            <div className="mt-4 text-sm text-slate-600 text-right">
              Total bookings: <span className="font-semibold">{bookings.length}</span>
            </div>
          </Card>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={handleDeleteConfirm}
        title="Delete Departure"
        message={`Are you sure you want to delete this departure? This action cannot be undone. ${
          hasBookings
            ? 'All bookings associated with this departure will be affected.'
            : ''
        }`}
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
        isLoading={isDeleting}
      />
    </div>
  );
};

export default DepartureDetail;
