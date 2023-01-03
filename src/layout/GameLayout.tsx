import { JSXElement } from "solid-js";

// Reference to the element
export let areaRef: HTMLDivElement;

const GameLayout = ({ children }: {children: JSXElement}) => {

  return (
    <div class='h-full flex justify-center items-center p-16'>
      <div class='area' ref={areaRef}>
        {children}
      </div>
    </div>
  )
}

export default GameLayout