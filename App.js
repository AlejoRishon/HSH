import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from './components/Login';
import VehicleList from './components/VehicleList';
import Main from './components/Main';
import TankFill from './components/TankFill';
import DieselTransfer from './components/DieselTransfer';
import DeliveryOrder from './components/DeliveryOrder';
import EditTrip from './components/editTrip';
import AdHocService from './components/adHocService';
import TransferList from './components/TransferList';
import MasterLogin from './components/MasterLogin';
import DieselTransferList from './components/DieselTransferList';
import DieselOutTransfer from './components/DieselOutTransfer';
import auth from '@react-native-firebase/auth';
import { setUserDetail } from './components/functions/helper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from "@react-native-community/netinfo";
const Stack = createNativeStackNavigator();
const App = () => {

  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState();

  function onAuthStateChanged(user) {
    console.log(user);
    setUserDetail(user);
    setUser(user);
    if (initializing) setInitializing(false);
  }



  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);


    return (() => {
      subscriber();

    });
  }, []);

  if (initializing) return null;

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={!user ? 'MasterLogin' : 'Login'} screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="VehicleList" component={VehicleList} />
        <Stack.Screen name="Main" component={Main} />
        <Stack.Screen name="TankFill" component={TankFill} />
        <Stack.Screen name="DieselTransfer" component={DieselTransfer} />
        <Stack.Screen name="DeliveryOrder" component={DeliveryOrder} />
        <Stack.Screen name="EditTrip" component={EditTrip} />
        <Stack.Screen name="AdHocService" component={AdHocService} />
        <Stack.Screen name='TransferList' component={TransferList} />
        <Stack.Screen name='MasterLogin' component={MasterLogin} />
        <Stack.Screen name='DieselTransferList' component={DieselTransferList} />
        <Stack.Screen name='DieselOutTransfer' component={DieselOutTransfer} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
