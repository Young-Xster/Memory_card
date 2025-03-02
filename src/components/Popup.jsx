import '../styles/game.css';
import PropTypes from 'prop-types';
import pokeball from '../assets/pokeball.svg';

function Popup({ pokeBestScore, score, onClick, isVisible, isWin }) {
  return (
    <section id="popup" className={isVisible ? '' : 'hidden'}>
      <div className="popupContent">
        <h2>{isWin ? 'You WON!' : 'GAME OVER'}</h2>
        <img src={pokeball} alt="pokeball" />
        <p> Your final score is: {score}</p>
        <p>Your highest score was : {pokeBestScore}</p>
        <button className="restart" onClick={onClick}>
          Play Again
        </button>
      </div>
    </section>
  );
}

Popup.propTypes = {
  score: PropTypes.number,
  onClick: PropTypes.func,
  isVisible: PropTypes.bool,
  isWin: PropTypes.string,
};

export default Popup;
