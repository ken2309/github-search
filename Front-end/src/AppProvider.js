import React, { createContext, useState } from "react";
export const AppContext = createContext();
export default function AppProvider({ children }) {
  const [user, setUser] = useState();
  const [listUser, setListUser] = useState();
  const [key, setKey] = useState("");
  const value = {
    user,
    setUser,
    listUser,
    setListUser,
    key,
    setKey
  };
  return <AppContext.Provider value={value} > {children} </AppContext.Provider>;
}