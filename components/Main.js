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

  return (
    <View style={{ flexDirection: 'row', flex: 1, backgroundColor: 'white' }}>
      <SideBar all={true} navigation={navigation} />
      <View style={{ flex: 1, padding: 20 }}>
        <Text style={text}>{parameter.vehicle}</Text>
        <TouchableOpacity
          style={searchBox}
          onPress={() => navigation.navigate('VehicleList')}>
          <Icon name="exchange" color="#01315C" size={20} />

          <Text style={[text, { marginLeft: 10 }]}>Change vehicle</Text>
        </TouchableOpacity>
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
            onPress={() => navigation.navigate('TankFill')}>
            <Icons name="truck-fast" color="#01315C" size={moderateScale(20)} />
            <Text style={[text, { fontSize: moderateScale(12) }]}>{t('tank_fill_up')}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={boxContainer}
            onPress={() => navigation.navigate('DeliveryOrder')}>
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
            onPress={() => navigation.navigate('AdHocService')}>
            <Icon name="file-text" color="#01315C" size={moderateScale(17)} />
            <Text style={[text, { fontSize: moderateScale(12) }]}>{t('ad_hoc_service')}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={boxContainer}
            onPress={() => navigation.navigate('DieselTransfer')}>
            <Icon name="building" color="#01315C" size={moderateScale(17)} />
            <Text style={[text, { fontSize: moderateScale(12) }]}>{t('diesel_transfer')}</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View
        style={{
          width: width * 0.35,
          backgroundColor: '#EEF7FF',
          padding: 50,
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
            <Text style={[text, { fontSize: 25 }]}>{parameter.vehicle}</Text>
          </View>
        </View>
      </View>
    </View>
  );
}
