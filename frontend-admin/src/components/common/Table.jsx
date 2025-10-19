import PropTypes from 'prop-types';
import clsx from 'clsx';

const Table = ({ columns, data, renderRowActions, className }) => (
  <div className={clsx('overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm', className)}>
    <div className="max-h-[560px] overflow-y-auto">
      <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
        <thead className="bg-slate-50">
          <tr>
            {columns.map((column) => (
              <th key={column.key} className="px-6 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                {column.label}
              </th>
            ))}
            {renderRowActions && <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">Actions</th>}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 bg-white">
          {data.map((row) => (
            <tr key={row.id} className="hover:bg-slate-50">
              {columns.map((column) => (
                <td key={column.key} className="px-6 py-4 text-sm text-slate-600">
                  {column.render ? column.render(row[column.key], row) : row[column.key]}
                </td>
              ))}
              {renderRowActions && (
                <td className="px-6 py-4 text-sm text-slate-500">
                  {renderRowActions(row)}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

Table.propTypes = {
  columns: PropTypes.arrayOf(PropTypes.shape({
    key: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    render: PropTypes.func
  })).isRequired,
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
  renderRowActions: PropTypes.func,
  className: PropTypes.string
};

export default Table;
