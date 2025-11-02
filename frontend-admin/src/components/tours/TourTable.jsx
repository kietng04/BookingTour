import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Edit3 } from 'lucide-react';
import Table from '../common/Table.jsx';
import StatusPill from '../common/StatusPill.jsx';
import Button from '../common/Button.jsx';
import { formatCurrency, formatDate } from '../../utils/format.js';

const buildDurationLabel = (tour) => {
  const days = tour?.days ?? null;
  const nights = tour?.nights ?? null;
  if (!days && !nights) {
    return tour?.duration || 'Chưa cập nhật lịch trình';
  }
  if (days && nights !== null) {
    return `${days} ngày${nights ? ` ${nights} đêm` : ''}`;
  }
  if (days) {
    return `${days} ngày`;
  }
  if (nights) {
    return `${nights} đêm`;
  }
  return 'Chưa cập nhật lịch trình';
};

const TourTable = ({ tours }) => {
  const columns = [
    {
      key: 'tourName',
      label: 'Tour',
      render: (_, row) => (
        <div>
          <p className="font-medium text-slate-800">{row.tourName}</p>
          <p className="text-xs text-slate-400">{buildDurationLabel(row)}</p>
          {row.mainDestination && (
            <p className="text-xs text-slate-400">Điểm đến chính: {row.mainDestination}</p>
          )}
        </div>
      )
    },
    {
      key: 'status',
      label: 'Status',
      render: (value) => <StatusPill status={value?.toString() ?? ''} />
    },
    {
      key: 'adultPrice',
      label: 'Giá người lớn',
      render: (value) => formatCurrency(value ?? 0)
    },
    {
      key: 'childPrice',
      label: 'Giá trẻ em',
      render: (value) => formatCurrency(value ?? 0)
    },
    {
      key: 'provinceId',
      label: 'Province',
      render: (_, row) => row.provinceId ?? '—'
    },
    {
      key: 'createdAt',
      label: 'Created',
      render: (value) => (value ? formatDate(value) : '—')
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
