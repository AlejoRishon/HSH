//import liraries
import React, {Component} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Login from './components/Login';
import VehicleList from './components/VehicleList';
import Main from './components/Main';
import TankFill from './components/TankFill';
import DieselTransfer from './components/DieselTransfer';
import DeliveryOrder from './components/DeliveryOrder';
// create a component
const Stack = createNativeStackNavigator();
const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{headerShown: false}}>
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="VehicleList" component={VehicleList} />
        <Stack.Screen name="Main" component={Main} />
        <Stack.Screen name="TankFill" component={TankFill} />
        <Stack.Screen name="DieselTransfer" component={DieselTransfer} />
        <Stack.Screen name="DeliveryOrder" component={DeliveryOrder} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

//make this component available to the app
export default App;
