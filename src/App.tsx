import './App.css'
import { SignIn } from './pages/auth/SignIn'
import { Routes, Route, Navigate } from 'react-router-dom'
import { Chat } from './pages/chat/Chat';
import { useQuery } from '@tanstack/react-query';

function App() {

  const { data: isLoggedIn } = useQuery({ queryKey: ['isLoggedIn'], queryFn: async () => {
    const token = localStorage.getItem("userInfo");
    if (token) {
      return true;
    } else {
      return false;
    }
  } });

  return (
    <Routes>
      <Route
        path="/"
        element={
          isLoggedIn ? (
            <Navigate to="/protected" />
          ) : (
            <SignIn/>
          )
        }
      />
      <Route
        path="/protected"
        element={isLoggedIn ? <Chat /> : <Navigate to="/" />}
      />
      <Route path="*" element={<p>There's nothing here: 404!</p>} />
    </Routes>
  )
}

export default App
