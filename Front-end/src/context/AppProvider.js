/* eslint-disable react-hooks/exhaustive-deps */
import React, { createContext, useState, useEffect } from "react";


export const AppContext = createContext();
export default function AppProvider({ children }) {
    const tokenSignin = sessionStorage.getItem('TOKEN');
    const value = {
      tokenSignin
    };
    return <AppContext.Provider value={value} > {children} </AppContext.Provider>;
}