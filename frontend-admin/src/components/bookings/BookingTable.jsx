import PropTypes from 'prop-types';
import { Eye } from 'lucide-react';
import Table from '../common/Table.jsx';
import StatusPill from '../common/StatusPill.jsx';
import Button from '../common/Button.jsx';
import { formatCurrency, formatDate } from '../../utils/format.js';

const BookingTable = ({ bookings }) => {
  const columns = [
    {
      key: 'id',
      label: 'Booking ID',
      render: (value) => <span className="font-mono text-xs text-slate-500">{value}</span>
    },
    {
      key: 'guestName',
      label: 'Guest / tour',
      render: (value, row) => (
        <div>
          <p className="font-medium text-slate-800">{value}</p>
          <p className="text-xs text-slate-400">{row.tourName}</p>
        </div>
      )
    },
    {
      key: 'travelDate',
      label: 'Travel date',
      render: (value) => formatDate(value)
    },
    {
      key: 'guests',
      label: 'Guests'
    },
    {
      key: 'amount',
      label: 'Amount',
      render: (value) => formatCurrency(value)
    },
    {
      key: 'status',
      label: 'Status',
      render: (value) => <StatusPill status={value} />
    },
    {
      key: 'assignedTo',
      label: 'Concierge'
    }
  ];

  return (
    <Table
      columns={columns}
      data={bookings}
      renderRowActions={(row) => (
        <Button to={`/bookings/${row.id}`} size="sm" variant="ghost">
          <Eye className="h-4 w-4" />
          View
        </Button>
      )}
    />
  );
};

BookingTable.propTypes = {
  bookings: PropTypes.arrayOf(PropTypes.object).isRequired
};

export default BookingTable;
