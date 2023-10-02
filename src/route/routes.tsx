import { Suspense, lazy } from 'react';
import { Route, Routes } from "react-router-dom";
import { SignIn } from "../pages/auth/SignIn";
import { AuthProvider } from '../providers/AuthProvider';
import { RequireAuth } from "../components/RequireAuth";

const Chat = lazy(() => import("../pages/chat/Chat"));

export const AllRoutes = () => {
  return (
    <AuthProvider>
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route path="/" element={<SignIn/>} />
          <Route element={<RequireAuth />}>
            <Route path="chat" element={<Chat />} />
          </Route>
          <Route path="*" element={<p>There's nothing here: 404!</p>} />
        </Routes>
      </Suspense>
    </AuthProvider>
  )
}