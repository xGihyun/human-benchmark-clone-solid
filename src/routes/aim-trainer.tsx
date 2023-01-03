import { createSignal, Show } from 'solid-js';
import { createStore } from 'solid-js/store';
import Result from '~/components/Result';
import GameLayout, { areaRef } from "~/layout/GameLayout";

// Target
const TOTAL_TARGETS = 20;

const MAX = 80;
const MIN = 20;

const AimTrainer = () => {

  // State for the target's position
  const [pos, setPos] = createStore({
    x: 0,
    y: 0,
    xPos: 50,
    yPos: 50,
  });

  // State for time
  const [time, setTime] = createStore({
    current: performance.now(),
    elapsed: 0,
    arr: [] as number[],
    start: false
  });

  const [targets, setTargets] = createSignal(TOTAL_TARGETS);

  function handleClick(){

    // Width and height of the div (screen)
    const width = areaRef.offsetWidth;
    const height = areaRef.offsetHeight;

    // Randomize position
    setPos({
      // Subtract 100 just incase to avoid going outside the screen
      x: Math.random() * (width - 100),
      y: Math.random() * (height - 100),

      // Position out of 100%
      // Has a range between MIN and MAX to set a limit || Don't go too close to the edge of the screen
      xPos: Math.min(Math.max(((pos.x / width) * 100), MIN), MAX),
      yPos: Math.min(Math.max(((pos.y / height) * 100), MIN), MAX)
    });

    setTime({
      current: performance.now(),
      elapsed: performance.now() - time.current,
    });
    
    // Start appending the elapsed time only after the user starts clicking
    if(time.start){
      setTime({ arr: [...time.arr, time.elapsed] });
      setTargets(targets() - 1);
    }
    else{
      setTime('start', true);
    }
  }

  function getAverageTime(){
    const sum = time.arr.reduce((acc, val) => acc + val, 0);
    return Math.round(sum / time.arr.length);
  }

  // Reset everything
  function restart(){
    setPos({
      x: 0,
      y: 0,
      xPos: 50,
      yPos: 50,
    });

    setTime({
      current: performance.now(),
      elapsed: 0,
      arr: [] as number[],
      start: false
    });

    setTargets(TOTAL_TARGETS);
  }

  return (
    <GameLayout>
      <h2 class='absolute top-0 pointer-events-none'>Remaining: {targets}</h2>
      <div class='target' onClick={handleClick} style={{ "left": `${pos.xPos}%`, "top": `${pos.yPos}%`, "translate": "-50% -50%" }} />
      <Show when={targets() === 0}
        fallback={ null }
      >
        <Result restart={restart}>
          <h2>Average time per target:</h2>
          {getAverageTime()} ms
        </Result>
      </Show>
    </GameLayout>
  )
}

export default AimTrainer