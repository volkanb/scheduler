import { useState } from "react";

export default function useVisualMode(initial) {
  const [mode, setMode] = useState(initial);
  const [history, setHistory] = useState([initial]);

  function transition(newMode, replace = false) { 
    const historyCopy = [...history];
    if(replace) {
      historyCopy.pop();
    }
    historyCopy.push(newMode)
    setHistory(historyCopy);
    setMode(newMode); 
  }
  function back() {
    const historyCopy = [...history];
    historyCopy.length > 1 && historyCopy.pop();
    setHistory(historyCopy);
    setMode(historyCopy[historyCopy.length - 1]);
  }

  return { mode, transition, back };
};
