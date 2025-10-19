import PropTypes from 'prop-types';
import Badge from './Badge.jsx';

const SectionTitle = ({ eyebrow, title, description, align = 'left', actions }) => (
  <div className={`mx-auto flex max-w-4xl flex-col gap-3 ${align === 'center' ? 'text-center' : 'text-left'}`}>
    {eyebrow && (
      <Badge
        variant="highlight"
        className={align === 'center' ? 'mx-auto' : 'mx-0'}
      >
        {eyebrow}
      </Badge>
    )}
    {title && <h2 className="text-3xl font-semibold tracking-tight text-slate-900 md:text-4xl">{title}</h2>}
    {description && <p className="text-base text-slate-500 md:text-lg">{description}</p>}
    {actions && (
      <div className={`flex gap-3 ${align === 'center' ? 'justify-center' : ''}`}>
        {actions}
      </div>
    )}
  </div>
);

SectionTitle.propTypes = {
  eyebrow: PropTypes.string,
  title: PropTypes.string.isRequired,
  description: PropTypes.string,
  align: PropTypes.oneOf(['left', 'center']),
  actions: PropTypes.node
};

export default SectionTitle;
