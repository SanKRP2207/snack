import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import "./App.css";

const GRID_SIZE = 20;
const SPEED = 150;

const SnakeGame = () => {
  const [snake, setSnake] = useState([{ x: 10, y: 10 }]);
  const [food, setFood] = useState({ x: 5, y: 5 });
  const [direction, setDirection] = useState("RIGHT");
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(Number(localStorage.getItem("bestScore")) || 0);

  const boardRef = useRef(null);
  const touchStart = useRef(null);
  const touchEnd = useRef(null);

  useEffect(() => {
    const handleKeyPress = (event) => {
      setDirection((prevDirection) => {
        if (event.key === "ArrowUp" && prevDirection !== "DOWN") return "UP";
        if (event.key === "ArrowDown" && prevDirection !== "UP") return "DOWN";
        if (event.key === "ArrowLeft" && prevDirection !== "RIGHT") return "LEFT";
        if (event.key === "ArrowRight" && prevDirection !== "LEFT") return "RIGHT";
        return prevDirection;
      });
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, []);

  useEffect(() => {
    if (gameOver) return;

    const moveSnake = () => {
      setSnake((prevSnake) => {
        const newSnake = [...prevSnake];
        const head = { ...newSnake[0] };

        switch (direction) {
          case "UP":
            head.y -= 1;
            break;
          case "DOWN":
            head.y += 1;
            break;
          case "LEFT":
            head.x -= 1;
            break;
          case "RIGHT":
            head.x += 1;
            break;
          default:
            break;
        }

        newSnake.unshift(head);

        if (head.x === food.x && head.y === food.y) {
          setFood({
            x: Math.floor(Math.random() * GRID_SIZE),
            y: Math.floor(Math.random() * GRID_SIZE),
          });
          setScore((prevScore) => prevScore + 10);
        } else {
          newSnake.pop();
        }

        if (
          head.x < 0 ||
          head.x >= GRID_SIZE ||
          head.y < 0 ||
          head.y >= GRID_SIZE ||
          newSnake.slice(1).some((segment) => segment.x === head.x && segment.y === head.y)
        ) {
          setGameOver(true);

          if (score > bestScore) {
            setBestScore(score);
            localStorage.setItem("bestScore", score);
          }

          return prevSnake;
        }

        return newSnake;
      });
    };

    const interval = setInterval(moveSnake, SPEED);
    return () => clearInterval(interval);
  }, [direction, food, gameOver, score, bestScore]);

  // Swipe gesture detection
  const handleTouchStart = (e) => {
    touchStart.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  };

  const handleTouchEnd = (e) => {
    if (!touchStart.current) return;
    const deltaX = e.changedTouches[0].clientX - touchStart.current.x;
    const deltaY = e.changedTouches[0].clientY - touchStart.current.y;

    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      if (deltaX > 50 && direction !== "LEFT") setDirection("RIGHT");
      if (deltaX < -50 && direction !== "RIGHT") setDirection("LEFT");
    } else {
      if (deltaY > 50 && direction !== "UP") setDirection("DOWN");
      if (deltaY < -50 && direction !== "DOWN") setDirection("UP");
    }
  };

  return (
    <div 
      className="game-container"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <div className="score-container">
        <h1>Score: {score}</h1>
      </div>
      <div className="score-container-h6">
        <h6>Best Score: {bestScore}</h6>
      </div>

      {gameOver ? (
        <div className="game-over">Game Over! Press Refresh to Play Again.</div>
      ) : (
        <div ref={boardRef} className="board">
          {snake.map((segment, index) => (
            <motion.div
              key={index}
              className="snake-segment"
              initial={{ scale: index === snake.length - 1 ? 0 : 1 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.2 }}
              style={{ left: segment.x * 20, top: segment.y * 20 }}
            />
          ))}

          <motion.div
            key={`${food.x}-${food.y}`}
            className="food"
            initial={{ scale: 1 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            style={{ left: food.x * 20, top: food.y * 20 }}
          />
        </div>
      )}

      {/* On-Screen Buttons */}
      <div className="touch-button">
          <button onClick={() => direction !== "RIGHT" && setDirection("LEFT")}>⬅️</button>
        <div className="touch-button2">
        <button className="upbutton" onClick={() => direction !== "DOWN" && setDirection("UP")}>⬆️</button>
        <button onClick={() => direction !== "UP" && setDirection("DOWN")}>⬇️</button>
        </div>
          <button onClick={() => direction !== "LEFT" && setDirection("RIGHT")}>➡️</button>
      </div>
    </div>
  );
};

export default SnakeGame;
