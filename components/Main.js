import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  FlatList,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import React, {useState} from 'react';
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

import {getVehicle} from './functions/helper';

const {width, height} = Dimensions.get('window');
export default function Main({navigation, route}) {
  const {t,i18n}=useTranslation();
  
  const parameter = getVehicle();

  return (
    <View style={{flexDirection: 'row', flex: 1, backgroundColor: 'white'}}>
      <SideBar all={true} navigation={navigation} />
      <View style={{flex: 1, padding: 20}}>
        <Text style={text}>{parameter.vehicle}</Text>
        <TouchableOpacity
          style={searchBox}
          onPress={() => navigation.navigate('VehicleList')}>
          <Icon name="exchange" color="#01315C" size={20} />

          <Text style={[text, {marginLeft: 10}]}>Change vehicle</Text>
        </TouchableOpacity>
        <Text style={[text, {marginTop: 20}]}>{`Main`}</Text>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <View
            style={{
              borderBottomWidth: 3,
              borderBottomColor: '#01315C',
              marginVertical: 20,
              width: 40,
            }}></View>
          <View
            style={{
              borderBottomWidth: 1,
              borderBottomColor: '#01315C',
              marginVertical: 20,
              flex: 1,
            }}></View>
        </View>
        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            marginVertical: 20,
            marginRight: 20,
          }}>
          <TouchableOpacity
            style={boxContainer}
            onPress={() => navigation.navigate('TankFill')}>
            <Icons name="truck-fast" color="#01315C" size={width/20} />
            <Text style={[text, {fontSize: width/40}]}>{t('tank_fill_up')}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={boxContainer}
            onPress={() => navigation.navigate('DeliveryOrder')}>
            <Icons name="format-list-bulleted" color="#01315C" size={width/20} />
            <Text style={[text, {fontSize: width/40}]}>{t('delivery_order')}</Text>
          </TouchableOpacity>
        </View>
        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            marginVertical: 20,
            marginRight: 20,
          }}>
          <TouchableOpacity style={boxContainer}
          onPress={() => navigation.navigate('AdHocService')}>
            <Icon name="file-text" color="#01315C" size={width/20} />
            <Text style={[text, {fontSize: width/40}]}>{t('ad_hoc_service')}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={boxContainer}
            onPress={() => navigation.navigate('DieselTransfer')}>
            <Icon name="building" color="#01315C" size={width/20} />
            <Text style={[text, {fontSize: width/40}]}>{t('diesel_transfer')}</Text>
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
        <View style={{marginTop: 80}}>
          <Text style={text}>{`Welcome back,`}</Text>
          <View
            style={{
              borderBottomWidth: 1,
              borderBottomColor: '#01315C',
              marginVertical: 20,
            }}></View>
          <Text
            style={[
              text,
              {marginTop: 20},
            ]}>{`Select a module to continue`}</Text>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginTop: 20,
            }}>
            <Text style={[text, {fontSize: 25}]}>{parameter.vehicle}</Text>
          </View>
        </View>
      </View>
    </View>
  );
}
