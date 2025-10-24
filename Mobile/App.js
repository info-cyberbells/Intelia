import React, { useState } from "react";
import { NavigationContainer } from '@react-navigation/native'
import AuthNavigator from './src/navigation/AuthNavigator'
import { ThemeProvider } from './src/contexts/ThemeContext'

const App = () => {
  return (
    <ThemeProvider>
      <NavigationContainer>
        <AuthNavigator />
      </NavigationContainer>
    </ThemeProvider>
  )
}


export default App;

