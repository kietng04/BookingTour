import PropTypes from 'prop-types';
import { Mail, Shield } from 'lucide-react';
import Table from '../common/Table.jsx';
import Button from '../common/Button.jsx';
import StatusPill from '../common/StatusPill.jsx';

const providerLabel = (value, isOAuth) => {
  if (!value || value.toLowerCase() === 'local') {
    return isOAuth ? 'OAUTH' : 'LOCAL';
  }
  return value.toUpperCase();
};

const UserTable = ({ users }) => {
  const columns = [
    {
      key: 'fullName',
      label: 'User',
      render: (_, row) => (
        <div>
          <p className="font-medium text-slate-800">{row.fullName || row.username}</p>
          <p className="inline-flex items-center gap-1 text-xs text-slate-400">
            <Mail className="h-3.5 w-3.5" />
            {row.email}
          </p>
        </div>
      )
    },
    {
      key: 'username',
      label: 'Username'
    },
    {
      key: 'provider',
      label: 'Provider',
      render: (value, row) => (
        <span className="inline-flex items-center gap-1 text-sm font-medium text-slate-600">
          <Shield className="h-3.5 w-3.5" />
          {providerLabel(value, row.isOAuthUser)}
        </span>
      )
    },
    {
      key: 'isOAuthUser',
      label: 'OAuth user?',
      render: (value) => <StatusPill status={value ? 'live' : 'draft'} />
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
