import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Plus } from 'lucide-react';
import Card from '../../components/common/Card.jsx';
import Table from '../../components/common/Table.jsx';
import Button from '../../components/common/Button.jsx';
import StatusPill from '../../components/common/StatusPill.jsx';
import DepartureFilters from '../../components/departures/DepartureFilters.jsx';
import { departuresAPI, toursAPI } from '../../services/api.js';

const DepartureList = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [departures, setDepartures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    tourId: searchParams.get('tourId') || '',
    fromDate: '',
    toDate: '',
    status: ''
  });

  useEffect(() => {
    fetchDepartures();
  }, []);

  useEffect(() => {
    const tourIdFromQuery = searchParams.get('tourId');
    if (tourIdFromQuery && tourIdFromQuery !== filters.tourId) {
      const newFilters = { ...filters, tourId: tourIdFromQuery };
      setFilters(newFilters);
      fetchDepartures(newFilters);
    }
  }, [searchParams]);

  const fetchDepartures = async (appliedFilters = filters) => {
    try {
      setLoading(true);

      if (appliedFilters.tourId) {
        const params = {};
        if (appliedFilters.fromDate) params.from = appliedFilters.fromDate;
        if (appliedFilters.toDate) params.to = appliedFilters.toDate;
        if (appliedFilters.status) params.status = appliedFilters.status;

        let tourName = 'Unknown Tour';
        let tourData = null;
        try {
          tourData = await toursAPI.getById(appliedFilters.tourId);
          tourName = tourData?.tourName || tourData?.tour_name || 'Unknown Tour';
        } catch (err) {
          console.error('Failed to fetch tour details:', err);
        }

        const data = await departuresAPI.getByTour(appliedFilters.tourId, params);

        const normalizedData = (data || [])
          .filter(d => d && typeof d === 'object')
          .map(d => ({
            ...d,
            departureId: d.id || d.departureId,
            tourId: d.tourId || parseInt(appliedFilters.tourId),
            tourName: d.tourName || tourName,
            startDate: d.startDate || d.start_date,
            endDate: d.endDate || d.end_date,
            totalSlots: d.totalSlots ?? d.total_slots,
            remainingSlots: d.remainingSlots ?? d.remaining_slots,
            status: d.status || 'CONCHO'
          }));

        setDepartures(normalizedData);
      } else {
        const data = await departuresAPI.getAll();

        let validData = (data || []).filter(d =>
          d &&
          typeof d === 'object' &&
          d.departureId &&
          d.startDate &&
          d.endDate &&
          d.totalSlots !== undefined &&
          d.tourName
        );

        let filteredData = validData;

        if (appliedFilters.fromDate) {
          filteredData = filteredData.filter(d =>
            d.startDate && new Date(d.startDate) >= new Date(appliedFilters.fromDate)
          );
        }

        if (appliedFilters.toDate) {
          filteredData = filteredData.filter(d =>
            d.endDate && new Date(d.endDate) <= new Date(appliedFilters.toDate)
          );
        }

        if (appliedFilters.status) {
          filteredData = filteredData.filter(d =>
            d.status && d.status.toLowerCase() === appliedFilters.status.toLowerCase()
          );
        }

        setDepartures(filteredData);
      }

      setError(null);
    } catch (err) {
      console.error('Failed to fetch departures:', err);
      setError('Failed to load departures');
      setDepartures([]);
    } finally {
      setLoading(false);
    }
  };

  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleApplyFilters = () => {
    fetchDepartures(filters);
  };

  const handleResetFilters = () => {
    const resetFilters = {
      tourId: '',
      fromDate: '',
      toDate: '',
      status: ''
    };
    setFilters(resetFilters);
    fetchDepartures(resetFilters);
  };

  const handleAddDeparture = () => {
    if (filters.tourId) {
      navigate(`/departures/new?tourId=${filters.tourId}`);
    } else {
      navigate('/departures/new');
    }
  };

  const handleViewDetails = (departure) => {
    navigate(`/departures/${departure.departureId}`, { state: { departure } });
  };

  const columns = [
    {
      key: 'tourName',
      label: 'Tour',
      render: (value, row) => {
        if (!row) return <span className="text-slate-400">N/A</span>;
        return (
          <div>
            <p className="font-medium text-slate-900">{row.tourName || 'Unknown Tour'}</p>
            <p className="text-xs text-slate-500">ID: {row.tourId || 'N/A'}</p>
          </div>
        );
      },
    },
    {
      key: 'startDate',
      label: 'Departure Date',
      render: (value, row) => {
        if (!row || !row.startDate || !row.endDate) {
          return <span className="text-sm text-slate-400">Date not available</span>;
        }
        try {
          const startDate = new Date(row.startDate);
          const endDate = new Date(row.endDate);
          if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
            return <span className="text-sm text-slate-400">Invalid date</span>;
          }
          return (
            <div>
              <p className="text-sm text-slate-900">
                {startDate.toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </p>
              <p className="text-xs text-slate-500">
                to {endDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              </p>
            </div>
          );
        } catch (error) {
          return <span className="text-sm text-slate-400">Invalid date</span>;
        }
      },
    },
    {
      key: 'slots',
      label: 'Availability',
      render: (value, row) => {
        if (!row || row.remainingSlots === undefined || row.totalSlots === undefined) {
          return <span className="text-sm text-slate-400">N/A</span>;
        }
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
      render: (value, row) => <StatusPill status={row.status} />,
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (value, row) => (
        <div className="flex gap-2">
          <Button size="sm" variant="secondary" onClick={() => handleViewDetails(row)}>
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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Departures</h1>
          <p className="text-sm text-slate-500">
            Manage tour departures and track availability
          </p>
        </div>
        <Button
          onClick={handleAddDeparture}
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Add Departure
        </Button>
      </div>

      {/* Filters */}
      <DepartureFilters
        filters={filters}
        onFiltersChange={handleFiltersChange}
        onApply={handleApplyFilters}
        onReset={handleResetFilters}
      />

      {departures.length === 0 ? (
        <Card className="text-center py-12">
          <svg className="mx-auto h-12 w-12 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-slate-900">No departures found</h3>
          <p className="mt-1 text-sm text-slate-500">
            {Object.values(filters).some(v => v)
              ? 'Try adjusting your filters or create a new departure.'
              : 'Get started by creating a new departure.'}
          </p>
          <div className="mt-6">
            <Button onClick={handleAddDeparture}>
              <Plus className="h-4 w-4 mr-2" />
              Add Departure
            </Button>
          </div>
        </Card>
      ) : (
        <Card>
          <Table columns={columns} data={departures} />
          <div className="mt-4 pt-4 border-t text-sm text-slate-600 flex justify-between items-center">
            <span>
              Showing <span className="font-semibold">{departures.length}</span> departure{departures.length !== 1 ? 's' : ''}
            </span>
            {Object.values(filters).some(v => v) && (
              <button
                onClick={handleResetFilters}
                className="text-primary-600 hover:text-primary-700"
              >
                Clear all filters
              </button>
            )}
          </div>
        </Card>
      )}
    </div>
  );
};

export default DepartureList;
