import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  FlatList,
  TextInput,
  TouchableOpacity,
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

import { getVehicle } from './functions/helper';

const { width, height } = Dimensions.get('window');
export default function Main({ navigation, route }) {

  const { t, i18n } = useTranslation();
  const parameter = getVehicle();

  // console.log('zjkgnkvrlzkv:', route?.params)

  return (
    <View style={{ flexDirection: 'row', flex: 1, backgroundColor: 'white' }}>
      <SideBar all={true} navigation={navigation} />
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
            onPress={() => navigation.navigate('DieselTransferList', {
              info: route?.params
            })}>
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
            onPress={() => navigation.navigate('AdHocService', {
              info: route?.params
            })}>
            <Icon name="file-text" color="#01315C" size={moderateScale(17)} />
            <Text style={[text, { fontSize: moderateScale(12) }]}>{t('ad_hoc_service')}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={boxContainer}
            onPress={() => navigation.navigate('DieselOutTransfer')}>
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
            }}>
            <Text style={[text, { fontSize: 25 }]}>{parameter.vehicle?.VEHICLE_INFO}</Text>
          </View>
        </View>
      </View>
    </View>
  );
}
