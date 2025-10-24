import PropTypes from 'prop-types';
import Card from '../common/Card.jsx';

const TourGallery = ({ gallery, thumbnail }) => (
  <div className="grid gap-4 md:grid-cols-5">
    <div className="md:col-span-3">
      <Card className="overflow-hidden p-0">
        <img src={thumbnail} alt="Hình ảnh tiêu biểu của tour" className="h-full w-full object-cover" />
      </Card>
    </div>
    <div className="grid gap-4 md:col-span-2">
      {gallery.map((image) => (
        <Card key={image} className="overflow-hidden p-0">
          <img src={image} alt="Thư viện ảnh tour" className="h-48 w-full object-cover" />
        </Card>
      ))}
    </div>
  </div>
);

TourGallery.propTypes = {
  gallery: PropTypes.arrayOf(PropTypes.string).isRequired,
  thumbnail: PropTypes.string.isRequired
};

export default TourGallery;
