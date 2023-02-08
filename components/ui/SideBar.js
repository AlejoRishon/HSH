import React, {useState, useEffect} from 'react';
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

const SideBar = props => {
  return (
    <View
      style={{
        backgroundColor: '#EEF7FF',
        justifyContent: 'space-between',
        paddingBottom: 30,
        paddingTop: 60,
      }}>
      {props.all && (
        <TouchableOpacity
          onPress={() => props.navigation.navigate('Main')}
          style={{
            backgroundColor: '#01315C',
            justifyContent: 'center',
            alignItems: 'center',
            padding: 15,
            marginHorizontal: 20,
            borderRadius: 8,
          }}>
          <Icon name="home" color="white" style={{padding: 5}} size={30} />
        </TouchableOpacity>
      )}
      {props.all && (
        <TouchableOpacity
          onPress={() => props.navigation.navigate('TankFill')}
          style={{
            backgroundColor: '#01315C',
            justifyContent: 'center',
            alignItems: 'center',
            padding: 15,
            marginHorizontal: 20,
            borderRadius: 8,
          }}>
          <Icon
            name="truck-fast"
            color="white"
            style={{padding: 5}}
            size={30}
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
            padding: 15,
            marginHorizontal: 20,
            borderRadius: 8,
          }}>
          <Icon
            name="format-list-bulleted"
            color="white"
            style={{padding: 5}}
            size={30}
          />
        </TouchableOpacity>
      )}
      {props.all && (
        <TouchableOpacity
          style={{
            backgroundColor: '#01315C',
            justifyContent: 'center',
            alignItems: 'center',
            padding: 15,
            marginHorizontal: 20,
            borderRadius: 8,
          }}>
          <Icons
            name="file-text"
            color="white"
            style={{padding: 5}}
            size={30}
          />
        </TouchableOpacity>
      )}
      {props.all && (
        <TouchableOpacity
          onPress={() =>
            props.navigation.navigate('DieselTransfer', {
              vehicle: props.vehicle,
            })
          }
          style={{
            backgroundColor: '#01315C',
            justifyContent: 'center',
            alignItems: 'center',
            padding: 15,
            marginHorizontal: 20,
            borderRadius: 8,
          }}>
          <Icons name="building" color="white" style={{padding: 5}} size={30} />
        </TouchableOpacity>
      )}
      <TouchableOpacity
        onPress={() => props.navigation.navigate('Login')}
        style={{
          backgroundColor: '#01315C',
          justifyContent: 'center',
          alignItems: 'center',
          padding: 15,
          marginHorizontal: 20,
          borderRadius: 8,
        }}>
        <Icon name="power" color="white" style={{padding: 5}} size={30} />
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
