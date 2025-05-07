import { useState } from 'react';
import { Button } from 'flowbite-react';
import './App.css';

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <div className="bg-sky-200 h-full flex flex-col items-center justify-center gap-5">
        <Button className="my-custom-button">Flowbite React Button</Button>
      </div>
      <div className="bg-sky-700">
        <Button className="sss">Flowbite 버튼</Button>
        <Button color="red">Flowbite 버튼</Button>
      </div>
    </>
  );
}

export default App;
