import PropTypes from 'prop-types';
import { Mail, Shield } from 'lucide-react';
import Table from '../common/Table.jsx';
import StatusPill from '../common/StatusPill.jsx';
import Button from '../common/Button.jsx';
import { formatDate } from '../../utils/format.js';

const roleLabels = {
  customer: 'Customer',
  concierge: 'Concierge',
  admin: 'Admin'
};

const UserTable = ({ users }) => {
  const columns = [
    {
      key: 'name',
      label: 'User',
      render: (value, row) => (
        <div>
          <p className="font-medium text-slate-800">{value}</p>
          <p className="inline-flex items-center gap-1 text-xs text-slate-400">
            <Mail className="h-3.5 w-3.5" />
            {row.email}
          </p>
        </div>
      )
    },
    {
      key: 'role',
      label: 'Role',
      render: (value) => (
        <span className="inline-flex items-center gap-1 text-sm font-medium text-slate-600">
          <Shield className="h-3.5 w-3.5" />
          {roleLabels[value] ?? value}
        </span>
      )
    },
    {
      key: 'bookings',
      label: 'Bookings'
    },
    {
      key: 'joinedAt',
      label: 'Joined',
      render: (value) => formatDate(value)
    },
    {
      key: 'status',
      label: 'Status',
      render: (value) => <StatusPill status={value} />
    }
  ];

  return (
    <Table
      columns={columns}
      data={users}
      renderRowActions={(row) => (
        <Button variant="ghost" size="sm">
          Manage
        </Button>
      )}
    />
  );
};

UserTable.propTypes = {
  users: PropTypes.arrayOf(PropTypes.object).isRequired
};

export default UserTable;
