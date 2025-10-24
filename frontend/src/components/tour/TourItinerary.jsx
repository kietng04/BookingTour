import PropTypes from 'prop-types';
import Card from '../common/Card.jsx';

const TourItinerary = ({ itinerary }) => (
  <Card className="space-y-6">
    <h3 className="text-lg font-semibold text-slate-900">Lịch trình chi tiết</h3>
    <div className="space-y-5">
      {itinerary.map((day) => (
        <div key={day.day} className="rounded-2xl border border-slate-100 bg-slate-50/60 p-5">
          <p className="text-sm font-semibold uppercase tracking-widest text-primary-500">Ngày {day.day}</p>
          <h4 className="mt-1 text-lg font-semibold text-slate-800">{day.title}</h4>
          <ul className="mt-3 space-y-2 text-sm text-slate-600">
            {day.items.map((item) => (
              <li key={item}>• {item}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  </Card>
);

TourItinerary.propTypes = {
  itinerary: PropTypes.arrayOf(PropTypes.shape({
    day: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    items: PropTypes.arrayOf(PropTypes.string).isRequired
  })).isRequired
};

export default TourItinerary;
