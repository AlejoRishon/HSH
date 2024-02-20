import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  StatusBar,
  View,
  Text,
  Image,
  ScrollView,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Icons from 'react-native-vector-icons/FontAwesome';
import { verticalScale } from '../styles/Metrics';
import auth from '@react-native-firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Modal } from 'react-native-paper';

const SideBar = props => {
  return (
    <View
      style={{
        backgroundColor: '#EEF7FF',
        justifyContent: 'space-between',
        paddingBottom: verticalScale(10),
        paddingTop: verticalScale(25),
      }}>
      {props.all && (
        <TouchableOpacity
          onPress={() => props.navigation.navigate('Main')}
          style={{
            backgroundColor: '#01315C',
            justifyContent: 'center',
            alignItems: 'center',
            padding: 10,
            marginHorizontal: 20,
            borderRadius: 8,
          }}>
          <Icon name="home" color="white" style={{ padding: 5 }} size={20} />
        </TouchableOpacity>
      )}
      {props.all && (
        <TouchableOpacity
          onPress={() => props.navigation.navigate('DieselTransferList')}
          style={{
            backgroundColor: '#01315C',
            justifyContent: 'center',
            alignItems: 'center',
            padding: 10,
            marginHorizontal: 20,
            borderRadius: 8,
          }}>
          <Icon
            name="truck-fast"
            color="white"
            style={{ padding: 5 }}
            size={20}
          />
        </TouchableOpacity>
      )}
      {props.all && (
        <TouchableOpacity
          onPress={() => props.navigation.navigate('DeliveryOrder')}
          style={{
            backgroundColor: '#01315C',
            justifyContent: 'center',
            alignItems: 'center',
            padding: 10,
            marginHorizontal: 20,
            borderRadius: 8,
          }}>
          <Icon
            name="format-list-bulleted"
            color="white"
            style={{ padding: 5 }}
            size={20}
          />
        </TouchableOpacity>
      )}
      {props.all && (
        <TouchableOpacity
          onPress={() => props.navigation.navigate('AdHocService')}
          style={{
            backgroundColor: '#01315C',
            justifyContent: 'center',
            alignItems: 'center',
            padding: 10,
            marginHorizontal: 20,
            borderRadius: 8,
          }}>
          <Icons
            name="file-text"
            color="white"
            style={{ padding: 5 }}
            size={20}
          />
        </TouchableOpacity>
      )}
      {props.all && (
        <TouchableOpacity
          onPress={() =>
            props.navigation.navigate('DieselOutTransfer', {
              vehicle: props.vehicle,
            })
          }
          style={{
            backgroundColor: '#01315C',
            justifyContent: 'center',
            alignItems: 'center',
            padding: 10,
            marginHorizontal: 20,
            borderRadius: 8,
          }}>
          <Icons name="building" color="white" style={{ padding: 5 }} size={20} />
        </TouchableOpacity>
      )}
      <TouchableOpacity
        onPress={props.onLog}
        style={{
          backgroundColor: '#bd2d2d',
          justifyContent: 'center',
          alignItems: 'center',
          padding: 10,
          marginHorizontal: 20,
          borderRadius: 8,
        }}>
        <Icon name="power" color="white" style={{ padding: 5 }} size={20} />
      </TouchableOpacity>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 100,
    alignItems: 'center',
  },
});

export default SideBar;
