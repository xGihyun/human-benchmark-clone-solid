import { Component, createEffect, createMemo, createSignal, Show } from "solid-js";
import { createStore } from "solid-js/store";
import Result from "~/components/Result";
import GameLayout from "~/layout/GameLayout";

type Props = {
  num?: number,
  spot: {row: number, col: number},
}

type ListProps = {
  items: Props[];
}

// Generates a random spot
function randomSpot(){
  const row = Math.trunc(Math.random() * 8) + 1;
  const col = Math.trunc(Math.random() * 10) + 1;
  
  return { row, col };
}

// Check if spot is occupied
// Avoids multiple squares going on the same spot
function checkOccupiedSpot(items: Props[], spot: { row: number, col: number }){
  let checkSpot = items.find((item) => JSON.stringify(item.spot) === JSON.stringify(spot));
  while (checkSpot !== undefined) {

    // Generate new random spot
    const row = randomSpot().row;
    const col = randomSpot().col;
    spot = { row, col };

    // Check if the new spot is occupied
    checkSpot = items.find((item) => JSON.stringify(item.spot) === JSON.stringify(spot));
  }

  return spot;
}

const ChimpTest = () => {

  const [items, setItems] = createSignal<Props[]>([]);
  const [state, setState] = createStore({
    hidden: false,
    gameOver: false,
    round: 1,
  });

  function handleClick(e: MouseEvent){
    let index = 0;
    const target = e.currentTarget as HTMLElement;
    const currentItemValue = items()[index].num;
    const clickedItemValue = parseInt((target.getAttribute("data-num")) as string);

    // Check if user is clicking on the right order
    if(currentItemValue !== clickedItemValue){
      setState('gameOver', true);
    }

    setState('hidden', true);
    setItems(items().slice(1));
    index++;

    // If array is empty === you didn't fail, then move to next round
    if(items().length === 0){
      setState('round', state.round + 1);
      setState('hidden', false);
    }
  }

  // The square element you click on
  const Square: Component<Props> = (props) => {
    return (
      <div class={state.hidden ? 'bg-white chimp-square' : 'bg-black chimp-square'}
        onClick={handleClick}
        style={{ "grid-row": props.spot.row, "grid-column": props.spot.col }}
        data-num={props.num}
      >
        <Show when={state.hidden} fallback={props.num}>
          {null}
        </Show>
      </div>
    )
  }

  // List of the squares
  const ItemList = ( item: ListProps ) => {
    const memoizedList = createMemo(() => (
      item.items.map(i => <Square {...i} />)
    ))

    return (
      <>
        {memoizedList}
      </>
    )
  }

  // Initialize squares
  function initialItems(){
    const newInitialItems: Props[] = [];

    for (let i = 0; i < state.round + 3; i++) {
      const row = randomSpot().row;
      const col = randomSpot().col;
      const spot = { row, col };
      const index = i + 1;

      const newInitialItem = {
        num: index,
        spot: checkOccupiedSpot(newInitialItems, spot),
      };
      newInitialItems.push(newInitialItem);
    }
    return newInitialItems;
  }

  // Reset everything
  function restart(){
    // If gameover by round 1, manually set initial items, otherwise, createEffect would do it
    // This solution seems fine but is there a way for createEffect to work the same way as React's useEffect to avoid this ternary?
    state.round === 1 ? setItems(initialItems()) : setItems([])
    setState({
      hidden: false,
      gameOver: false,
      round: 1,
    });
  }

  // Runs when changes happen
  // Responsible for making the game keep going after every round
  // Won't run after restarting in round 1 because nothing changed?
  createEffect(() => {
    setItems(items => [...initialItems(), ...items]);
  });

  return (
    <GameLayout>
      <Show when={state.gameOver}
        fallback={
          <div class='grid gap-2 grid-cols-10-90px grid-rows-8-90px'>
            <ItemList items={items()} />
          </div>
        }
      >
        <Result restart={restart}>
          <h2>Numbers: {state.round + 3}</h2>
        </Result>
      </Show>
    </GameLayout>
  )
}

export default ChimpTest