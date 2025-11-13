import PropTypes from "prop-types";
import { Mail, Shield } from "lucide-react";
import Table from "../common/Table.jsx";
import Button from "../common/Button.jsx";
import StatusPill from "../common/StatusPill.jsx";
import { useState } from "react";
import UserCreateModal from "./UserCreateModal.jsx";
import UserEditModal from "./UserEditModal.jsx";

const providerLabel = (value, isOAuth) => {
  if (!value || value.toLowerCase() === "local") {
    return isOAuth ? "OAUTH" : "LOCAL";
  }
  return value.toUpperCase();
};

const UserTable = ({ users, onCreate, onEdit, onDelete }) => {
  const [isCreateOpen, setCreateOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  const columns = [
    {
      key: "fullName",
      label: "User",
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
      /*...*/
    },
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Users</h2>
        <Button variant="primary" onClick={() => setCreateOpen(true)}>
          Create User
        </Button>
      </div>

      <Table
        columns={columns}
        data={users}
        renderRowActions={(row) => (
          <div className="flex gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setEditingUser(row)}
            >
              Edit
            </Button>
            <Button
              variant="danger"
              size="sm"
              onClick={() => onDelete && onDelete(row)}
            >
              Delete
            </Button>
          </div>
        )}
      />

      <UserCreateModal
        open={isCreateOpen}
        onClose={() => setCreateOpen(false)}
        onSubmit={(data) => {
          setCreateOpen(false);
          onCreate && onCreate(data);
        }}
      />

      <UserEditModal
        open={!!editingUser}
        user={editingUser}
        onClose={() => setEditingUser(null)}
        onSubmit={(data) => {
          setEditingUser(null);
          onEdit && onEdit(data);
        }}
      />
    </div>
  );
};

UserTable.propTypes = {
  users: PropTypes.arrayOf(PropTypes.object).isRequired,
  onCreate: PropTypes.func,
  onEdit: PropTypes.func,
  onDelete: PropTypes.func,
};

export default UserTable;
