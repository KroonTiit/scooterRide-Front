import './App.css';
import { Login } from './components/login.js';
import { Home } from './components/home.js'
import { Register } from './components/register.js';
import { Header } from './components/header.js'; 
import { useRoutes  } from 'react-router-dom';

function App() {
  const routesArray = [
    {
      path: "*",
      element: <Login />,
    },
    {
      path: "/login",
      element: <Login />,
    },
    {
      path: "/register",
      element: <Register />,
    },
    {
      path: "/home",
      element: <Home />,
    },
  ];
  let routesElement = useRoutes(routesArray);
  return (
    <>
      <Header />
      <div className="w-full h-screen flex flex-col">{routesElement}</div>
    </>
  );
}

export default App;
