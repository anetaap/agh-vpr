import {useState} from 'react';
import reactLogo from './assets/react.svg';
import Hero from './components/Hero';

function App() {
  return (
    <div className="bg-stone-900 text-stone-100">
      <Hero />
      <div className="container mt-2 mx-auto p-4">
        <h3 className="text-lg">Jak to działa?</h3>
        <p className="text-sm text-stone-300">
          Aplikacja wykorzystuje...
        </p>
      </div>
    </div>
  );
}

export default App;
