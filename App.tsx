import { createStackNavigator } from '@react-navigation/stack';
import TrucoScreen from "./src/screens/TrucoScreen/TrucoScreen.tsx";
import LittleFuckScreen from "./src/screens/LittleFuckScreen/LittleFuckScreen.tsx";
import { NavigationContainer } from '@react-navigation/native';
import Home from "./src/screens/Home/Home.tsx";
import {StatusBar, View} from "react-native";
import React from "react";
import {StyleSheet} from "react-native";


const Stack = createStackNavigator();

export default function App() {
    return (
       <View style={styles.backgroundContainer}>
           <StatusBar barStyle="light-content" backgroundColor="rgba(0, 0, 0, 0.3)" translucent={true} />
           <View style={styles.overlay} />
           <NavigationContainer>
               <Stack.Navigator initialRouteName={'Home'} screenOptions={{headerShown: false}}>
                   <Stack.Screen name="Home" component={Home} />
                   <Stack.Screen name="TrucoScreen" component={TrucoScreen} />
                   <Stack.Screen name="LittleFuckScreen" component={LittleFuckScreen} />
               </Stack.Navigator>
           </NavigationContainer>
       </View>
    );
}

export const styles = StyleSheet.create({
    backgroundContainer: {
        flex: 1,
        width: '100%',
        backgroundColor: '#1A2C42',
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(20, 30, 40, 0.85)',
    },

});
