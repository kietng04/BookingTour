import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Edit3 } from 'lucide-react';
import Table from '../common/Table.jsx';
import StatusPill from '../common/StatusPill.jsx';
import Button from '../common/Button.jsx';
import { formatCurrency } from '../../utils/format.js';

const TourTable = ({ tours }) => {
  const columns = [
    {
      key: 'name',
      label: 'Tour',
      render: (_, row) => (
        <div>
          <p className="font-medium text-slate-800">{row.name}</p>
          <p className="text-xs text-slate-400">{row.duration}</p>
        </div>
      )
    },
    {
      key: 'status',
      label: 'Status',
      render: (value) => <StatusPill status={value} />
    },
    {
      key: 'price',
      label: 'Base price',
      render: (value) => formatCurrency(value)
    },
    {
      key: 'seatsLeft',
      label: 'Seats left',
      render: (value) => (
        <span className={`font-medium ${value <= 4 ? 'text-danger' : 'text-slate-600'}`}>
          {value} seats
        </span>
      )
    },
    {
      key: 'rating',
      label: 'Rating'
    },
    {
      key: 'tags',
      label: 'Tags',
      render: (value) => (
        <div className="flex flex-wrap gap-1.5">
          {value.map((tag) => (
            <span key={tag} className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-500">
              {tag}
            </span>
          ))}
        </div>
      )
    },
    {
      key: 'lastUpdated',
      label: 'Updated'
    }
  ];

  return (
    <Table
      columns={columns}
      data={tours}
      renderRowActions={(row) => (
        <Button to={`/tours/${row.id}`} size="sm" variant="ghost">
          <Edit3 className="h-4 w-4" />
          Edit
        </Button>
      )}
    />
  );
};

TourTable.propTypes = {
  tours: PropTypes.arrayOf(PropTypes.object).isRequired
};

export default TourTable;
