import { JSXElement } from "solid-js";

const Result = ({ children, restart }: {children: JSXElement, restart?: () => void}) => {
  return (
    <div class='w-full h-screen fixed top-0 left-0 bg-black bg-opacity-25 flex justify-center items-center'>
      <div class='w-[60%] max-w-3xl relative p-8 bg-neutral-800 text-center'>
        { children }
        <button onClick={restart} class='flex z-40'>Restart</button>
      </div>
    </div>
  )
}

export default Result