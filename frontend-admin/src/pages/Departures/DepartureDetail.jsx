import { useState, useEffect } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import { ArrowLeft, Calendar, Users, MapPin } from 'lucide-react';
import Card from '../../components/common/Card.jsx';
import Table from '../../components/common/Table.jsx';
import StatusPill from '../../components/common/StatusPill.jsx';
import Badge from '../../components/common/Badge.jsx';
import { bookingsAPI } from '../../services/api.js';

const DepartureDetail = () => {
  const { departureId } = useParams();
  const location = useLocation();
  const departure = location.state?.departure;

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 0, size: 20 });

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

  const columns = [
    {
      key: 'bookingId',
      label: 'Booking ID',
      render: (row) => (
        <span className="font-mono text-sm text-slate-700">#{row.id}</span>
      ),
    },
    {
      key: 'user',
      label: 'Customer',
      render: (row) => (
        <div>
          <p className="font-medium text-slate-900">User ID: {row.userId}</p>
          <p className="text-xs text-slate-500">Booked {new Date(row.bookingDate).toLocaleDateString()}</p>
        </div>
      ),
    },
    {
      key: 'seats',
      label: 'Seats',
      render: (row) => (
        <Badge variant="secondary">
          {row.seats} {row.seats > 1 ? 'seats' : 'seat'}
        </Badge>
      ),
    },
    {
      key: 'totalAmount',
      label: 'Amount',
      render: (row) => (
        <span className="font-semibold text-slate-900">
          ${row.totalAmount.toLocaleString()}
        </span>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      render: (row) => <StatusPill status={row.status} />,
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
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">{departure.tourName}</h1>
            <p className="text-sm text-slate-500">Departure Details</p>
          </div>

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
    </div>
  );
};

export default DepartureDetail;
