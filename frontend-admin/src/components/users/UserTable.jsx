import PropTypes from "prop-types";
import { Mail } from "lucide-react";
import Table from "../common/Table.jsx";
import Badge from "../common/Badge.jsx";

const providerLabel = (value, isOAuth) => {
  if (!value || value.toLowerCase() === "local") {
    return isOAuth ? "OAUTH" : "LOCAL";
  }
  return value.toUpperCase();
};

const UserTable = ({ users, onToggleActive }) => {
  const columns = [
    {
      key: "fullName",
      label: "Người dùng",
      render: (_, row) => (
        <div>
          <p className="font-medium text-slate-800">
            {row.fullName || row.username}
          </p>
          <p className="inline-flex items-center gap-1 text-xs text-slate-400">
            <Mail className="h-3.5 w-3.5" />
            {row.email}
          </p>
        </div>
      ),
    },
    {
      key: "username",
      label: "Username",
    },
    {
      key: "provider",
      label: "Provider",
      render: (_, row) => (
        <Badge variant="secondary">
          {providerLabel(row.provider, row.isOAuthUser)}
        </Badge>
      ),
    },
    {
      key: "role",
      label: "Role",
      render: (value) => (
        <Badge variant={value === "ADMIN" ? "primary" : "secondary"}>
          {value || "CUSTOMER"}
        </Badge>
      ),
    },
    {
      key: "active",
      label: "Trạng thái",
      render: (value) => (
        <Badge variant={value ? "success" : "danger"}>
          {value ? "Active" : "Inactive"}
        </Badge>
      ),
    },
  ];

  return (
    <Table
      columns={columns}
      data={users}
      renderRowActions={(row) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => onToggleActive && onToggleActive(row)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 ${
              row.active ? 'bg-primary-600' : 'bg-slate-300'
            }`}
            role="switch"
            aria-checked={row.active}
            title={row.active ? 'Vô hiệu hóa' : 'Kích hoạt'}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                row.active ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
          <span className="text-xs text-slate-500">
            {row.active ? 'Kích hoạt' : 'Vô hiệu hóa'}
          </span>
        </div>
      )}
    />
  );
};

UserTable.propTypes = {
  users: PropTypes.arrayOf(PropTypes.object).isRequired,
  onToggleActive: PropTypes.func,
};

export default UserTable;
