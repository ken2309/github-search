import React, { useContext } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Main from './pages/main';
import LoginPage from './pages/login';
import { AppContext } from './AppProvider';
export default function RouterConfig() {
  const { user } = useContext(AppContext);
  const token = user;
  const routes = [
    {
      path: "/",
      component: token?<Main />:<LoginPage/>,
    },
    {
      path: "/login",
      component: <LoginPage />,
    }
  ]
  return (
    <BrowserRouter>
      <Routes>
        {
          routes.map((item, index) => (
            <Route
              key={index}
              path={`${item.path}`}
              element={item.component}
            />
          ))}
      </Routes>
    </BrowserRouter>
  );
}