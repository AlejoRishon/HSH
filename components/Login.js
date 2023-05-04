import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ImageBackground,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
} from 'react-native';
import { inputBox, button, buttonText, text } from './styles/MainStyle';
import { useTranslation } from 'react-i18next';
import { horizontalScale, moderateScale, verticalScale } from './styles/Metrics';

export default function Login({ navigation }) {

  const [lang, setlang] = useState('en');
  const { t, i18n } = useTranslation();

  useState(() => {
    console.log(lang);
  }, [lang]);

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
        <View
          style={{
            width: horizontalScale(150),
            backgroundColor: '#EEF7FF',
            padding: moderateScale(25),
            justifyContent: 'space-around',
          }}>
          <View style={{ marginTop: verticalScale(20) }}>
            <Text style={text}>{`Welcome back,\n${t('login_message')}`}</Text>
            <View
              style={{
                borderBottomWidth: 1,
                borderBottomColor: '#01315C',
                marginVertical: verticalScale(15),
              }} />
            <TextInput style={inputBox} placeholder="username" placeholderTextColor='#000' />
            <TextInput
              style={inputBox}
              placeholder="password"
              placeholderTextColor='#000'
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
