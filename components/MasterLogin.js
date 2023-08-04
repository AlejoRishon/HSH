import React, { useState } from 'react';
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

export default function MasterLoginLogin({ navigation }) {

    const [lang, setlang] = useState('en');
    const { t, i18n } = useTranslation();
    const [userEmail, setUserEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)

    useState(() => {
        console.log(lang);
    }, [lang]);

    const login = async () => {
        if (!userEmail || !password) {
            Alert.alert('Please enter your email and password.');
            return;
        }
    
        setLoading(true);
        await auth().signInWithEmailAndPassword(userEmail, password)
            .then(() => {
                console.log('Success');
                navigation.replace('Login');
            })
            .catch(error => {
                setLoading(false);
                if (error.code === 'auth/invalid-email') {
                    Alert.alert('Email address/password is invalid!');
                } else {
                    Alert.alert('An error occurred while logging in. Please try again.');
                }
                console.error(error);
            });
    };
    

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
                    <View style={{ marginTop: verticalScale(20) }}>
                        <Text style={text}>{`Welcome,\n${t('Sign In')}`}</Text>
                        <View
                            style={{
                                borderBottomWidth: 1,
                                borderBottomColor: '#01315C',
                                marginVertical: verticalScale(15),
                            }} />
                        <TextInput
                            style={[inputBox, { color: '#000' }]}
                            placeholder="user email"
                            placeholderTextColor='#000'
                            value={userEmail}
                            onChangeText={text => setUserEmail(text)}
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
                        style={[button, { marginTop: verticalScale(10) }]}
                        onPress={() => login()}
                    >
                        <Text style={buttonText}>Sign In</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </KeyboardAvoidingView >
    );
}
