import { Link, Route } from "wouter";
import Home from "./pages/Home";
import "./app.css";
import { Button } from "./components/ui/button";
import Manufacturers from "./pages/Manufacturers";
import Products from "./pages/Products";

function App() {
  return (
    <div className="w-full min-h-full flex flex-col">
      <header className="bg-gray-100 border-gray-200 border-b-1 p-3 sticky top-0 flex justify-center">
        <nav className="flex gap-6 items-center">
          <div className="font-black text-xl tracking-widest">IMS5</div>
          <ul className="flex gap-2">
          <li><Link href="/"><Button variant="link">Home</Button></Link></li>
          <li><Link href="/products"><Button variant="link">Products</Button></Link></li>
          <li><Link href="/manufacturers"><Button variant="link">Manufacturers</Button></Link></li>
          </ul>
        </nav>
      </header>
      <main className="flex-1">
        <Route path="/" component={Home} />
        <Route path="/products" component={Products} />
        <Route path="/manufacturers" component={Manufacturers} />
      </main>
      <footer className="bg-gray-100 border-gray-200 border-t-1 text-center p-4">Footer produly presented by IMS5</footer>
    </div>
  );
}

export default App;
