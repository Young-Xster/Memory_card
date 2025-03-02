import PropTypes from 'prop-types';
import '../styles/card.css';

function Card({ name, image, onClick, ref }) {
  return (
    <button className="card" onClick={onClick} ref={ref}>
      <img src={image} alt={name} />
      <h3>{name}</h3>
    </button>
  );
}

Card.propTypes = {
  name: PropTypes.string,
  image: PropTypes.string,
  onClick: PropTypes.func,
  ref: PropTypes.object,
};

export default Card;
