import React from 'react';
import { SafeAreaView, StatusBar } from 'react-native';
import AppNavigator from "./src/routes/AppNavigator";

const App = () => {
  return (
      <SafeAreaView style={{ flex: 1 }}>
        <StatusBar barStyle="light-content" />
        <AppNavigator />
      </SafeAreaView>
  );
};

export default App;
