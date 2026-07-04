import { Game } from './components/Game';
import { createWorkplaceGame } from './content/workplace';
import './App.css';

const game = createWorkplaceGame();

function App() {
  return <Game engine={game} />;
}

export default App;
