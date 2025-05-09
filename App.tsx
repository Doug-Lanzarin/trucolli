import {SafeAreaView, useColorScheme} from "react-native";
import {Colors} from "react-native/Libraries/NewAppScreen";
import React from "react";
import TrucoScreen from "./src/screens/TrucoScreen/TrucoScreen.tsx";


function App(): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
    flex: 1
  };

  return (
    <SafeAreaView style={backgroundStyle}>
      <TrucoScreen/>
    </SafeAreaView>
  );
}

export default App;
