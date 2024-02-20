import {
  Text,
  View,
  Dimensions,
  FlatList,
  TextInput,
  TouchableOpacity,
  Modal, Alert, KeyboardAvoidingView
} from 'react-native';
import React, { useState, useEffect } from 'react';
import { searchBox, button, buttonText, text } from './styles/MainStyle';
import Icon from 'react-native-vector-icons/Ionicons';
import SideBar from './ui/SideBar';
import { setVehicle } from './functions/helper';
import { useTranslation } from 'react-i18next';
import { horizontalScale, moderateScale, verticalScale } from './styles/Metrics';
import { ActivityIndicator, MD2Colors } from 'react-native-paper';
import { getDomain } from './functions/helper';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window');

export default function VehicleList({ navigation }) {

  const formatDate = (inputDate) => {

    let day = inputDate.getDate();

    let month = inputDate.getMonth() + 1;

    let year = inputDate.getFullYear();
    if (day < 10) {
      day = '0' + day;
    }

    if (month < 10) {
      month = `0${month}`;
    }

    let formatted = `${year}-${month}-${day}`;
    return formatted;
  };
  const { t } = useTranslation();
  const domain = getDomain();

  const [listData, setListData] = useState([]);
  const [showDialog, setshowDialog] = useState(false);
  const [vlload, setvlload] = useState([]);
  const [selectedVehicle, setselectedVehicle] = useState(null);
  const [driverId, setDriverId] = useState(null)
  const [driverName, setDriverName] = useState('')
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  const getVehicleList = async () => {
    try {
      const response = await fetch(domain + '/GetVehicleList?_token=4B3B5C99-57E8-4593-A0AD-3D4EEA3C2F53');
      const json = await response.json();
      setListData(json);
      setLoading(false)
    } catch (error) {
      console.error(error);
      setLoading(false)
    }
  }

  useEffect(() => { getVehicleList() }, [])

  const ItemView = ({ item }) => {
    return (
      <TouchableOpacity
        style={{ marginVertical: verticalScale(20) }}
        onPress={() => {

          var vehicleData = { ...item?.Vehicle[0], driver_id: item?.driver_id };
          console.log(vehicleData);
          setselectedVehicle(vehicleData),
            setDriverId(item?.driver_id),
            setDriverName(item?.Vehicle[0]?.driver_name)
        }}>
        <Text style={[text, { fontSize: moderateScale(18) }]}>{item?.Vehicle[0]?.VEHICLE_INFO}</Text>
      </TouchableOpacity>
    );
  };

  const filteredListData = listData.filter((item) =>
    item?.Vehicle[0]?.VEHICLE_INFO.toLowerCase().includes(search.toLowerCase())
  );
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
      <SideBar all={false} navigation={navigation} onLog={() => setonLogOut(true)} />
      <View style={{ flex: 1, padding: moderateScale(15) }}>
        <View style={searchBox}>
          <Icon name="search" color="#01315C" size={20} />
          <TextInput
            style={{ marginLeft: horizontalScale(5), color: '#000' }}
            placeholderTextColor={'#01315C'}
            placeholder="Search for vehicle number"
            value={search}
            onChangeText={setSearch}
          />
        </View>
        <Text style={[text, { marginTop: 20 }]}>{`Vehicle List`}</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <View
            style={{
              borderBottomWidth: 3,
              borderBottomColor: '#01315C',
              marginVertical: verticalScale(25),
              width: 40,
            }} />
          <View
            style={{
              borderBottomWidth: 1,
              borderBottomColor: '#01315C',
              marginVertical: verticalScale(15),
              flex: 1,
            }} />
        </View>
        <FlatList
          data={search ? filteredListData : listData}
          showsVerticalScrollIndicator={true}
          renderItem={ItemView}
          keyExtractor={item => item?.driver_id}
        />
      </View>
      <Modal
        animationType='none'
        transparent={true}
        visible={loading}
      >
        <ActivityIndicator animating={true} color={MD2Colors.red800} style={{ marginTop: '25%' }} size='large' />
      </Modal>
      <View
        style={{
          width: width * 0.35,
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
            }} />
          <Text
            style={[
              text,
              { marginTop: verticalScale(18) },
            ]}>{t('homepage_message')}</Text>

          {selectedVehicle && (
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginTop: verticalScale(45),
              }}>
              <Icon name="md-checkmark-sharp" color="green" size={28} />
              <Text style={[text, { fontSize: moderateScale(15) }]}>{selectedVehicle.VEHICLE_INFO}</Text>
            </View>
          )}
        </View>
        {selectedVehicle && (
          <TouchableOpacity
            style={button}
            onPress={async () => {
              setLoading(true);
              setVehicle(selectedVehicle);
              AsyncStorage.setItem('vehicleDetails', JSON.stringify(selectedVehicle));
              const response = await fetch(domain + `/getJobDetail?_token=404BF898-501C-469B-9FB0-C1C1CCDD7E29&PLATE_NO=${selectedVehicle.VEHICLE_INFO}&date=${formatDate(new Date())}`);

              const json = await response.json();
              console.log(json);
              setLoading(false);

              if (json && json.length > 0) {

                AsyncStorage.setItem('JOBDATA', JSON.stringify(json));
              }
              navigation.navigate('Main', {
                vehicleInfo: selectedVehicle.VEHICLE_INFO,
                driverId: driverId,
                driverName: driverName
              })
            }}>
            <Text style={buttonText}>Proceed</Text>
          </TouchableOpacity>
        )}
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
    </View >
  );
}
