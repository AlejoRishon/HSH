import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  FlatList,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import React, {useEffect, useState} from 'react';


 
import {searchBox, button, buttonText, text} from './styles/MainStyle';
import Icon from 'react-native-vector-icons/Ionicons';
import SideBar from './ui/SideBar';
import {setVehicle} from './functions/helper';
import { useTranslation } from 'react-i18next';

const {width, height} = Dimensions.get('window');
export default function VehicleList({navigation}) {
  const {t,i18n}=useTranslation();

  const [listData, setListDate] = useState([
    'TRB8888A',
    'TCB9990X',
    'THL8822B',
    'TLC1234S',
  ]);
  const [selectedVehicle, setselectedVehicle] = useState(null);
  const ItemView = ({item}) => {
    return (
      // FlatList Item
      <TouchableOpacity
        style={{marginVertical: 20}}
        onPress={() => setselectedVehicle(item)}>
        <Text style={[text, {fontSize: 25}]}>{item}</Text>
      </TouchableOpacity>
    );
  };
  return (
    <View style={{flexDirection: 'row', flex: 1, backgroundColor: 'white'}}>
      <SideBar all={false} navigation={navigation} />
      <View style={{flex: 1, padding: 20}}>
        <View style={searchBox}>
          <Icon name="search" color="#01315C" size={20} />
          <TextInput
            style={{marginLeft: 10}}
            placeholderTextColor={'#01315C'}
            placeholder="Search for vehicle number"
          />
        </View>
        <Text style={[text, {marginTop: 20}]}>{`Vehicle List`}</Text>
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
        <FlatList
          data={listData}
          showsVerticalScrollIndicator={true}
          renderItem={ItemView}
          keyExtractor={(item, index) => index.toString()}
        />
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
            ]}>{t('homepage_message')}</Text>

          {selectedVehicle && (
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginTop: 20,
              }}>
              <Icon name="md-checkmark-sharp" color="green" size={30} />
              <Text style={[text, {fontSize: 25}]}>{selectedVehicle}</Text>
            </View>
          )}
        </View>
        {selectedVehicle && (
          <TouchableOpacity
            style={button}
            onPress={() => {
              setVehicle(selectedVehicle);
              navigation.navigate('Main');
            }}>
            <Text style={buttonText}>Proceed</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}
