import { useState } from "react";
import Button from "@mui/material/Button"; // Import MUI Button
import "./App.css";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <header className="text-white py-4 text-center text-2xl font-bold">
        TailwindCSS + Material UI Test
      </header>

      <div className="flex flex-col items-center mt-6 space-y-4">
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700 transition"
          onClick={() => setCount((count) => count + 1)}
        >
          Tailwind Count is {count}
        </button>

        <Button 
          variant="contained" 
          color="primary" 
          onClick={() => setCount((count) => count + 1)}
        >
          MUI Count is {count}
        </Button>
      </div>
    </>
  );
}

export default App;
