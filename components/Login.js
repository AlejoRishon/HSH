import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  ImageBackground,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
} from 'react-native';
import React from 'react';
import {inputBox, button, buttonText, text} from './styles/MainStyle';
const {width, height} = Dimensions.get('window');
import { useTranslation } from 'react-i18next';
export default function Login({navigation}) {
  const {t,i18n}=useTranslation();
  return (
    <KeyboardAvoidingView style={{flex: 1}} behavior="height">
      <View style={{flexDirection: 'row', flex: 1}}>
        
        <ImageBackground
          source={require('../assets/bg.png')}
          style={{flex: 1, backgroundColor: 'white', alignItems: 'center'}}>
            
          <ImageBackground
            source={require('../assets/bgtext.png')}
            resizeMode="contain"
            style={{flex: 1, width: '80%'}}>
              <View style={{width:200,justifyContent:'flex-start',alignSelf:'flex-end'}}>
              <View style={{flexDirection:'row',justifyContent:'space-between'}}>
              <TouchableOpacity onPress={()=>{
i18n.changeLanguage('en')
              }}>
                <Text style={{
                color:'#000',
                fontSize:22,
                fontWeight:'bold'
              }}>English</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={()=>{
                i18n.changeLanguage('ch')
              }}>
                <Text style={{
                color:'#000',
                fontSize:22,
                fontWeight:'bold'
              }}>Chinese</Text>
              </TouchableOpacity>
            </View>
            </View>
            </ImageBackground>
        </ImageBackground>
        <View
          style={{
            width: width * 0.4,
            backgroundColor: '#EEF7FF',
            padding: 50,
            justifyContent: 'space-between',
          }}>
          <View style={{marginTop: 80}}>
            <Text
              style={text}>{`Welcome back,\nPlease login to continue.`}</Text>
            <View
              style={{
                borderBottomWidth: 1,
                borderBottomColor: '#01315C',
                marginVertical: 20,
              }}></View>
            <TextInput style={inputBox} placeholder="username" />
            <TextInput
              style={inputBox}
              placeholder="password"
              textContentType="password"
              secureTextEntry={true}
            />
          </View>
          <TouchableOpacity
            style={button}
            onPress={() => navigation.navigate('VehicleList')}>
            <Text style={buttonText}>Login</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
