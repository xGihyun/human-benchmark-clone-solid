import { For } from "solid-js";
import { A } from "solid-start";
import { games } from '../constants/games';

export default function Home() {

  return (
    <div class="h-full flex justify-center items-center gap-4">
      <For each={games}>
        {game => 
          <A href={game.path} data-game={game.data} class='p-4 bg-neutral-800 hover:bg-neutral-700'>
            {game.title}
          </A>
        }
      </For>
    </div>
  )
}
