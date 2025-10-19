import PropTypes from 'prop-types';
import Button from './Button.jsx';

const EmptyState = ({ title, description, actionLabel, actionTo, onAction, icon: Icon }) => (
  <div className="flex flex-col items-center justify-center gap-4 rounded-3xl border border-dashed border-slate-200 bg-white/70 p-10 text-center">
    {Icon && <Icon className="h-12 w-12 text-primary-400" />}
    <div className="space-y-1">
      <h3 className="text-lg font-semibold text-slate-700">{title}</h3>
      <p className="text-sm text-slate-500">{description}</p>
    </div>
    {actionLabel && (
      <Button to={actionTo} onClick={onAction}>
        {actionLabel}
      </Button>
    )}
  </div>
);

EmptyState.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  actionLabel: PropTypes.string,
  actionTo: PropTypes.string,
  onAction: PropTypes.func,
  icon: PropTypes.elementType
};

export default EmptyState;
