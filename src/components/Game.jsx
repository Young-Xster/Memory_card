import { useImmer } from 'use-immer';
import { v4 as uuidv4 } from 'uuid';
import React, { useCallback } from 'react';
import { useState, useEffect, useRef } from 'react';
import Card from './Card';
import Popup from './Popup';
import '../styles/game.css';

export default function Game() {
  const [cardsAmount, setCardsAmount] = useState(10);
  let score = useRef(0);
  // const [score, setScore] = useState(0);
  const [pokeBestScore, setpokeBestScore] = useState(score.current);

  const [cards, setCards] = useImmer([]);
  const [showPopup, setShowPopup] = useState(false);
  const [isWin, setIsWin] = useState(false);
  const [newGame, setNewGame] = useState(true);

  const refs = useRef({});

  useEffect(() => {
    console.log('FETCH pokemon URL');
    let ignore = false;

    async function fetchPokemons(data) {
      console.log('FETCH pokemons');
      console.log(data);
      await data.results.forEach((p) => {
        fetch(p.url)
          .then((response) => response.json())
          .then((pokemon) => {
            const name = pokemon.name;
            const img =
              pokemon.sprites.versions[`generation-v`][`black-white`].animated
                .front_default;
            setCards((draft) => {
              draft.push({
                name: name,
                image: img,
                id: uuidv4(),
                isChecked: false,
              });
            });
          });
      });
      setNewGame(false);
    }

    async function fetchData() {
      try {
        const response = await fetch(
          `https://pokeapi.co/api/v2/pokemon?limit=${cardsAmount}&offset=${
            Math.random() * 100
          }`
        );
        if (!ignore && newGame) {
          if (response.ok) {
            const json = await response.json();
            console.log(json);
            await fetchPokemons(json);
          } else {
            throw new Error(response.status);
          }
        }
      } catch (error) {
        return error;
      }
    }

    fetchData();

    return () => {
      ignore = true;
    };
  }, [setCards, newGame, cardsAmount]);

  function gameHandler(item, index) {
    if (item.isChecked) {
      //Game OVer
      popupHandler();
    } else {
      score.current++;
      console.log(`Score: ${score.current} Cards: ${cardsAmount}`);
      if (score.current === Number(cardsAmount)) {
        console.log('Win?');
        //Win
        setIsWin(true);
        popupHandler();
      } else {
        //Next round
        setCards((draft) => {
          draft[index].isChecked = true;
        });
      }
    }
    setCards((draft) => {
      shuffleArray(draft);
    });
    refs[item.name].current.blur();
  }

  const popupHandler = () => {
    if (score.current > pokeBestScore) {
      setpokeBestScore(score.current);
    }
    setShowPopup(true);
  };

  const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const temp = array[i];
      array[i] = array[j];
      array[j] = temp;
    }
  };

  function restartGame() {
    setNewGame(true);
    score.current = 0;
    setCards([]);
    setShowPopup(false);
    setIsWin(false);
  }

  //const timer = (ms) => new Promise((res) => setTimeout(res, ms));

  const inputRef = useRef(null);

  function cardsAmountHandler() {
    setCardsAmount(inputRef.current.value);
    restartGame();
  }

  return (
    <section id="game">
      <Popup
        pokeBestScore={pokeBestScore}
        onClick={() => restartGame()}
        score={score.current}
        isVisible={showPopup}
        isWin={isWin}
      />
      <section id="main">
        <div className="title">
          <div className="ti">
            <h1 className="red">POKE </h1> <h1> MEMO</h1>
          </div>
          <label htmlFor="cardsAmount">
            <input
              type="number"
              name="cardsAmount"
              title="cardsAmount"
              placeholder="Cards amount:"
              ref={inputRef}
            ></input>
            <button onClick={() => cardsAmountHandler()}>Generate</button>
          </label>
        </div>
        <div className="scores">
          <p>Score: {score.current}</p>
          <p>Best Score: {pokeBestScore}</p>
        </div>
        <div className="loading">
          {newGame && <h2>Catching Pokemons...</h2>}
        </div>
        <div className="cards">
          {cards.map((item, index) => {
            //await timer(100);
            const newRef = React.createRef();
            refs[item.name] = newRef;
            return (
              <Card
                name={item.name}
                image={item.image}
                key={item.id}
                ref={newRef}
                onClick={() => gameHandler(item, index)}
              />
            );
          })}
        </div>
      </section>
    </section>
  );
}
