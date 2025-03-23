
import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import "./App.css";

const GRID_SIZE = 20;
const SPEED = 150; // Speed of snake movement in milliseconds

const SnakeGame = () => {
  const [snake, setSnake] = useState([{ x: 10, y: 10 }]);
  const [food, setFood] = useState({ x: 5, y: 5 });
  const [direction, setDirection] = useState("RIGHT");
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const boardRef = useRef(null);

  useEffect(() => {
    const handleKeyPress = (event) => {
      setDirection((prevDirection) => {
        if (event.key === "ArrowUp" && prevDirection !== "DOWN") {
          return "UP";
        }
        if (event.key === "ArrowDown" && prevDirection !== "UP") {
          return "DOWN";
        }
        if (event.key === "ArrowLeft" && prevDirection !== "RIGHT") {
          return "LEFT";
        }
        if (event.key === "ArrowRight" && prevDirection !== "LEFT") {
          return "RIGHT";
        }
        return prevDirection; // If invalid move, keep the same direction
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
          setScore(score + 10);
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
          return prevSnake;
        }

        return newSnake;
      });
    };

    const interval = setInterval(moveSnake, SPEED);
    return () => clearInterval(interval);
  }, [direction, food, gameOver]);

  return (
    <div className="game-container">
      <div className="score-container">
        <h1>Score {score}</h1>
      </div>
      {gameOver ? (
        <div className="game-over">Game Over! Press Refresh to Play Again.</div>
        ) : (
          <div ref={boardRef} className="board">
          
          {snake.map((segment, index) => (
            <motion.div
              key={index}
              className="snake-segment"
              initial={{ scale: index === snake.length - 1 ? 0 : 1 }} // New segment starts small
              animate={{ scale: 1 }} // Expands smoothly
              transition={{ duration: 0.2 }} // Smooth transition
              style={{ left: segment.x * 20, top: segment.y * 20 }}
            />
          ))}

          ))}
          <motion.div
            key={`${food.x}-${food.y}`}  // Ensure food re-renders when position changes
            className="food"
            initial={{ scale: 1 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0, opacity: 0 }}  // Shrinking effect when eaten
            transition={{ duration: 0.2 }}   // Smooth transition
            style={{ left: food.x * 20, top: food.y * 20 }}
          />

        </div>
      )}
    </div>
  );
};

export default SnakeGame;
