import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  FlatList,
  TextInput,
  TouchableOpacity,
  Alert,
  Modal
} from 'react-native';
import React, { useState } from 'react';
import {
  searchBox,
  button,
  buttonText,
  text,
  boxContainer,
} from './styles/MainStyle';
import Icon from 'react-native-vector-icons/FontAwesome';
import Icons from 'react-native-vector-icons/MaterialCommunityIcons';
import SideBar from './ui/SideBar';
import { useTranslation } from 'react-i18next';
import { moderateScale, verticalScale } from './styles/Metrics';
import NetInfo from "@react-native-community/netinfo";
import AsyncStorage from '@react-native-async-storage/async-storage';

import { getVehicle } from './functions/helper';

const { width, height } = Dimensions.get('window');
export default function Main({ navigation, route }) {

  const { t, i18n } = useTranslation();
  const parameter = getVehicle();

  const [onLogOut, setonLogOut] = useState(false)
  const LogOut = () => {
    AsyncStorage.removeItem('vehicleDetails')
    AsyncStorage.removeItem('JOBDATA')
    AsyncStorage.removeItem('pendingDelivery')
    AsyncStorage.removeItem('username')
    AsyncStorage.removeItem('domainurl')
    AsyncStorage.removeItem('password');
    navigation.replace('Login');
    setonLogOut(false);
  }

  return (
    <View style={{ flexDirection: 'row', flex: 1, backgroundColor: 'white' }}>
      <SideBar all={true} navigation={navigation} onLog={() => setonLogOut(true)} />
      <View style={{ flex: 1, padding: 20 }}>
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>

          <Text style={text}>{parameter?.vehicle?.VEHICLE_INFO}</Text>
          <TouchableOpacity
            style={{
              borderWidth: 1,
              borderColor: '#01315C',
              borderRadius: 8,
              flexDirection: 'row',
              alignItems: 'center',
              padding: 10,
            }}
            onPress={() => navigation.navigate('VehicleList')}>
            <Icon name="exchange" color="#01315C" size={20} />

            <Text style={[text, { marginLeft: 10 }]}>Change vehicle</Text>
          </TouchableOpacity>
        </View>

        <Text style={[text, { marginTop: verticalScale(25) }]}>{`Main`}</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <View
            style={{
              borderBottomWidth: 3,
              borderBottomColor: '#01315C',
              marginVertical: verticalScale(10),
              width: 40,
            }} />
          <View
            style={{
              borderBottomWidth: 1,
              borderBottomColor: '#01315C',
              marginVertical: verticalScale(20),
              flex: 1,
            }} />
        </View>
        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            marginVertical: verticalScale(30),
            marginRight: 20,
          }}>
          <TouchableOpacity
            style={boxContainer}
            onPress={() => {
              NetInfo.fetch().then(async networkState => {
                console.log("Is connected? - ", networkState.isConnected);
                if (networkState.isConnected) {
                  navigation.navigate('DieselTransferList', {
                    info: route?.params
                  })
                }
                else {
                  Alert.alert('Offline mode', 'Cannot use this function in offline mode. Connect to the internet.');
                }
              })
            }
            }>
            <Icons name="truck-fast" color="#01315C" size={moderateScale(20)} />
            <Text style={[text, { fontSize: moderateScale(12) }]}>{t('tank_fill_up')}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={boxContainer}
            onPress={() => navigation.navigate('DeliveryOrder', {
              vehicle: route?.params?.vehicleInfo,
              name: route?.params?.driverName
            })}>
            <Icons name="format-list-bulleted" color="#01315C" size={moderateScale(20)} />
            <Text style={[text, { fontSize: moderateScale(12) }]}>{t('delivery_order')}</Text>
          </TouchableOpacity>
        </View>
        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            marginVertical: verticalScale(10),
            marginRight: 20,
          }}>
          <TouchableOpacity style={boxContainer}
            onPress={() => {
              NetInfo.fetch().then(async networkState => {
                console.log("Is connected? - ", networkState.isConnected);
                if (networkState.isConnected) {
                  navigation.navigate('AdHocService', {
                    info: route?.params
                  })
                }
                else {
                  Alert.alert('Offline mode', 'Cannot use this function in offline mode. Connect to the internet.');
                }
              })
            }

            }>
            <Icon name="file-text" color="#01315C" size={moderateScale(17)} />
            <Text style={[text, { fontSize: moderateScale(12) }]}>{t('ad_hoc_service')}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={boxContainer}
            onPress={() => {
              NetInfo.fetch().then(async networkState => {
                console.log("Is connected? - ", networkState.isConnected);
                if (networkState.isConnected) {

                  navigation.navigate('DieselOutTransfer')
                }
                else {
                  Alert.alert('Offline mode', 'Cannot use this function in offline mode. Connect to the internet.');
                }
              })
            }

            }>
            <Icon name="building" color="#01315C" size={moderateScale(17)} />
            <Text style={[text, { fontSize: moderateScale(12) }]}>{t('diesel_transfer')}</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View
        style={{
          width: width * 0.30,
          backgroundColor: '#EEF7FF',
          padding: 20,
          justifyContent: 'space-between',
        }}>
        <View style={{ marginTop: verticalScale(40) }}>
          <Text style={text}>{`Welcome back,`}</Text>
          <View
            style={{
              borderBottomWidth: 1,
              borderBottomColor: '#01315C',
              marginVertical: verticalScale(30),
            }}></View>
          <Text
            style={[
              text,
              { marginTop: verticalScale(18) },
            ]}>{`Select a module to continue`}</Text>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginTop: verticalScale(45),
              marginBottom: verticalScale(45),
            }}>
            <Text style={[text, { fontSize: 25 }]}>{parameter.vehicle?.VEHICLE_INFO}</Text>

          </View>
          <TouchableOpacity
            onPress={() => navigation.navigate('InOut')}
            style={button}>
            <Text style={buttonText}>In/Out</Text>
          </TouchableOpacity>

        </View>
      </View>
      <Modal transparent={true} visible={onLogOut} style={{ position: 'absolute', width: '100%' }}>
        <View style={{ backgroundColor: 'rgba(0,0,0,0.5)', flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <View style={{ backgroundColor: 'white', padding: 20, margin: 20, borderRadius: 8, alignItems: 'center' }}>
            <Text style={{ color: 'black', fontWeight: 'bold', fontSize: width / 30 }}>Are you sure you want to Log Out ?</Text>
            <View style={{ flexDirection: 'row', marginTop: 20 }}>
              <TouchableOpacity onPress={LogOut} style={[button, { backgroundColor: 'white', }]}>
                <Text style={[buttonText, { color: 'black', paddingHorizontal: 10 }]}>Yes</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setonLogOut(false)} style={[button, { marginLeft: 20 }]}>
                <Text style={[buttonText, { paddingHorizontal: 10 }]}>No</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}
