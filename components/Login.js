import React, { useState, useEffect } from 'react';
import {
  Text,
  View,
  ImageBackground,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Alert,
  Modal
} from 'react-native';
import { inputBox, button, buttonText, text } from './styles/MainStyle';
import { useTranslation } from 'react-i18next';
import { horizontalScale, moderateScale, verticalScale } from './styles/Metrics';
import { ActivityIndicator, MD2Colors } from 'react-native-paper';
import auth from '@react-native-firebase/auth';
import { getUser, setDomain, setlogUserDetail, setlogUserDetailFull, setVehicle } from './functions/helper';
import firestore from '@react-native-firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from "@react-native-community/netinfo";
import firestore from '@react-native-firebase/firestore';

export default function Login({ navigation }) {
  const user = getUser();
  const [lang, setlang] = useState('en');
  const { t, i18n } = useTranslation();
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [domain, seturl] = useState('');

  useState(() => {
    console.log(lang);
    setLoading(false)
  }, [lang]);


  const uploadPending = async () => {
    var pendingRequests = await AsyncStorage.getItem('pendingDelivery');
    if (pendingRequests) {
      console.log("pendingRequests", pendingRequests);
      var pendingData = JSON.parse(pendingRequests);
      if (pendingData && pendingData.length > 0) {
        pendingData.map(val => {
          fetch(val.url, {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify(val.data)
          })
            .then(response => response.json())
            .then(result => {
              console.log("pendingRequests result", result);
              AsyncStorage.removeItem('pendingDelivery');
            })
            .catch(error => {
              console.log("Error:", error);
              AsyncStorage.removeItem('pendingDelivery');

            })
        })
      }

    }
  }

  useEffect(() => {
    setLoading(false);
    checkLogin();
    console.log("useffect called")
    NetInfo.addEventListener(networkState => {
      console.log('listening', networkState.isConnected);

      if (networkState.isConnected) {
        // console.log('listening')
        uploadPending();
      }
    });

    return (() => {
      // netListener();
    })
  }, [])

  const checkLogin = async () => {

    if (user.uid) {
      // console.log(user.uid);
      NetInfo.fetch().then(async networkState => {

        console.log("Is connected? - ", networkState.isConnected);
        if (networkState.isConnected) {
          setLoading(true);
          firestore().collection('users').doc(user.uid).get().then(async document => {
            console.log(document.data().url);
            setDomain(document.data().url);
            seturl(document.data().url);
            var localusername = await AsyncStorage.getItem('username');
            var localpassword = await AsyncStorage.getItem('password');
            AsyncStorage.setItem('domainurl', document.data().url);
            if (localusername && localpassword) {
              setLoading(false);
              handleLogin(document.data().url, localusername, localpassword);
            }
            else {
              setLoading(false);
            }

          }).catch(e => {
            setLoading(false);
          });

        }
        else {
          var localusername = await AsyncStorage.getItem('username');
          var localpassword = await AsyncStorage.getItem('password');
          var localdomain = await AsyncStorage.getItem('domainurl');
          var localvehicle = await AsyncStorage.getItem('vehicleDetails');
          if (localusername && localpassword && localvehicle) {
            Alert.alert('You are offline', 'Using offline data to login');
            setLoading(false);
            setDomain(localdomain);
            setlogUserDetail(localusername);
            var vDetails = JSON.parse(localvehicle);
            setVehicle(vDetails);
            navigation.replace('Main', {
              vehicleInfo: vDetails.VEHICLE_INFO,
              driverId: vDetails.driver_id,
              driverName: vDetails.driver_name
            })
            // handleLogin(document.data().url, localusername, localpassword)
          }
          else {
            Alert.alert('You have no internet connectivity');
            setLoading(false);
          }
        }
      });


    }
  }
  const handleLogin = (dom, un, pass) => {
    setLoading(true);
    const token = 'b95909e1-d33f-469f-90c6-5a2fb1e5627c';
    const url = `${dom}/GetUserLogin?_token=${token}&_opco=&username=${encodeURIComponent(un)}&pw=${encodeURIComponent(pass)}`;
    console.log(url);
    fetch(url)
      .then(res => res.json())
      .then(data => {
        if (data.length > 0 && data[0].ACCESS_RIGHT !== null && data[0].CID !== null) {
          console.log(data);
          AsyncStorage.setItem('username', un);
          AsyncStorage.setItem('password', pass);
          setlogUserDetail(un);
          setlogUserDetailFull(data[0])
          setLoading(false);
          navigation.replace('VehicleList')
        }
        else {
          Alert.alert('Wrong credentials!')
          setLoading(false)
        }
      })
      .catch(e => {
        console.log('error:', e)
        Alert.alert('Access Denied!')
        setLoading(false)
      })
  }

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior="height">
      <View style={{ flexDirection: 'row', flex: 1 }}>
        <ImageBackground
          source={require('../assets/bg.png')}
          style={{ flex: 1, backgroundColor: 'white', alignItems: 'center' }}>
          <ImageBackground
            source={require('../assets/bgtext.png')}
            resizeMode="contain"
            style={{ flex: 1, width: '80%' }}>
            <View
              style={{
                width: horizontalScale(100),
                justifyContent: 'flex-start',
                alignSelf: 'flex-start',
              }}>
              <View
                style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <TouchableOpacity
                  onPress={() => {
                    i18n.changeLanguage('en');
                    setlang('en');
                  }}>
                  <Text
                    style={[
                      lang === 'en' && {
                        borderWidth: 1,
                        borderColor: 'cornflowerblue',
                      },
                      {
                        color: '#000',
                        fontSize: moderateScale(16),
                        padding: moderateScale(8),
                        fontWeight: 'bold',
                      },
                    ]}>
                    English
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    i18n.changeLanguage('ch');
                    setlang('ch');
                  }}>
                  <Text
                    style={[
                      lang === 'ch' && {
                        borderWidth: 1,
                        borderColor: 'cornflowerblue',
                      },
                      {
                        color: '#000',
                        fontSize: moderateScale(16),
                        padding: moderateScale(8),
                        fontWeight: 'bold',
                      },
                    ]}>
                    Chinese
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </ImageBackground>
        </ImageBackground>
        <Modal
          animationType='none'
          transparent={true}
          visible={loading}
        >
          <ActivityIndicator animating={true} color={MD2Colors.red800} style={{ marginTop: '25%' }} size='large' />
        </Modal>
        <View
          style={{
            width: horizontalScale(150),
            backgroundColor: '#EEF7FF',
            padding: moderateScale(25),
            justifyContent: 'space-around',
          }}>
          <TouchableOpacity
            style={[button, {
              width: horizontalScale(50),
              height: verticalScale(70),
              position: 'absolute',
              right: 5,
              padding: 0,
              justifyContent: 'center'
            }]}
            onPress={() => auth().signOut().then(() => navigation.replace('MasterLogin'))}
          >
            <Text style={[buttonText, { fontSize: moderateScale(10) }]}>Log Out</Text>
          </TouchableOpacity>
          <View style={{ marginTop: verticalScale(20) }}>
            <Text style={text}>{`Welcome back,\n${t('login_message')}`}</Text>
            <View
              style={{
                borderBottomWidth: 1,
                borderBottomColor: '#01315C',
                marginVertical: verticalScale(15),
              }} />
            <TextInput
              style={[inputBox, { color: '#000' }]}
              placeholder="username"
              placeholderTextColor='#000'
              value={userName}
              onChangeText={text => setUserName(text)}
            />
            <TextInput
              style={[inputBox, { color: '#000' }]}
              placeholder="password"
              placeholderTextColor='#000'
              textContentType="password"
              secureTextEntry={true}
              value={password}
              onChangeText={text => setPassword(text)}
            />
          </View>
          <TouchableOpacity
            style={button}
            onPress={() => handleLogin(domain, userName, password)}
          >
            <Text style={buttonText}>Login</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView >
  );
}
