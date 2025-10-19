import PropTypes from 'prop-types';
import Card from '../common/Card.jsx';
import TrendIndicator from '../common/TrendIndicator.jsx';

const StatCard = ({ title, value, change, icon: Icon, subtitle }) => (
  <Card className="flex flex-col gap-4" padding="p-5">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-xs uppercase tracking-widest text-slate-400">{title}</p>
        <p className="mt-1 text-2xl font-semibold text-slate-900">{value}</p>
      </div>
      <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-50 text-primary-600">
        <Icon className="h-6 w-6" />
      </div>
    </div>
    <div className="flex items-center justify-between">
      <TrendIndicator value={change} />
      <p className="text-xs text-slate-400">{subtitle}</p>
    </div>
  </Card>
);

StatCard.propTypes = {
  title: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  change: PropTypes.number.isRequired,
  icon: PropTypes.elementType.isRequired,
  subtitle: PropTypes.string
};

export default StatCard;
