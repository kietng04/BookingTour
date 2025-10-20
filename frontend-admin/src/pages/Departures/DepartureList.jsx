import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../../components/common/Card.jsx';
import Table from '../../components/common/Table.jsx';
import Button from '../../components/common/Button.jsx';
import StatusPill from '../../components/common/StatusPill.jsx';
import { departuresAPI } from '../../services/api.js';

const DepartureList = () => {
  const navigate = useNavigate();
  const [departures, setDepartures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDepartures();
  }, []);

  const fetchDepartures = async () => {
    try {
      setLoading(true);
      const data = await departuresAPI.getAll();
      setDepartures(data);
      setError(null);
    } catch (err) {
      console.error('Failed to fetch departures:', err);
      setError('Failed to load departures');
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (departure) => {
    navigate(`/departures/${departure.departureId}`, { state: { departure } });
  };

  const columns = [
    {
      key: 'tourName',
      label: 'Tour',
      render: (row) => (
        <div>
          <p className="font-medium text-slate-900">{row.tourName}</p>
          <p className="text-xs text-slate-500">ID: {row.tourId}</p>
        </div>
      ),
    },
    {
      key: 'startDate',
      label: 'Departure Date',
      render: (row) => (
        <div>
          <p className="text-sm text-slate-900">
            {new Date(row.startDate).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            })}
          </p>
          <p className="text-xs text-slate-500">
            to {new Date(row.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
          </p>
        </div>
      ),
    },
    {
      key: 'slots',
      label: 'Availability',
      render: (row) => {
        const availabilityPercent = (row.remainingSlots / row.totalSlots) * 100;
        return (
          <div className="space-y-1">
            <p className="text-sm text-slate-900">
              {row.remainingSlots} / {row.totalSlots} seats
            </p>
            <div className="w-full bg-slate-200 rounded-full h-1.5">
              <div
                className={`h-full rounded-full ${
                  availabilityPercent > 50 ? 'bg-green-500' : 'bg-amber-500'
                }`}
                style={{ width: `${availabilityPercent}%` }}
              />
            </div>
          </div>
        );
      },
    },
    {
      key: 'status',
      label: 'Status',
      render: (row) => <StatusPill status={row.status} />,
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (row) => (
        <div className="flex gap-2">
          <Button size="sm" variant="outline" onClick={() => handleViewDetails(row)}>
            View Details
          </Button>
        </div>
      ),
    },
  ];

  if (loading) {
    return (
      <div className="space-y-8">
        <h1 className="text-2xl font-semibold text-slate-900">Departures</h1>
        <div className="text-center py-12">
          <p className="text-sm text-slate-500">Loading departures...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-8">
        <h1 className="text-2xl font-semibold text-slate-900">Departures</h1>
        <Card className="text-center py-12">
          <p className="text-sm text-red-600">{error}</p>
          <Button onClick={fetchDepartures} className="mt-4">
            Retry
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Departures</h1>
          <p className="text-sm text-slate-500">
            Manage tour departures and track availability
          </p>
        </div>
      </div>

      <Card>
        <Table columns={columns} data={departures} />
      </Card>

      {departures.length === 0 && (
        <Card className="text-center py-12">
          <p className="text-sm text-slate-500">No departures found</p>
        </Card>
      )}
    </div>
  );
};

export default DepartureList;
