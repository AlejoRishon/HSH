import {
  Text,
  View,
  Dimensions,
  FlatList,
  TextInput,
  TouchableOpacity,
  Modal
} from 'react-native';
import React, { useState, useEffect } from 'react';
import { searchBox, button, buttonText, text } from './styles/MainStyle';
import Icon from 'react-native-vector-icons/Ionicons';
import SideBar from './ui/SideBar';
import { setVehicle } from './functions/helper';
import { useTranslation } from 'react-i18next';
import { horizontalScale, moderateScale, verticalScale } from './styles/Metrics';
import { ActivityIndicator, MD2Colors } from 'react-native-paper';

const { width } = Dimensions.get('window');

export default function VehicleList({ navigation }) {

  const { t } = useTranslation();

  const [listData, setListData] = useState([]);
  const [selectedVehicle, setselectedVehicle] = useState(null);
  const [driverId, setDriverId] = useState(null)
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  const getVehicleList = async () => {
    try {
      const response = await fetch('https://demo.vellas.net:94/pump/api/Values/GetVehicleList?_token=4B3B5C99-57E8-4593-A0AD-3D4EEA3C2F53');
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
        onPress={() => { setselectedVehicle(item?.Vehicle[0]?.VEHICLE_INFO), setDriverId(item?.driver_id) }}>
        <Text style={[text, { fontSize: moderateScale(18) }]}>{item?.Vehicle[0]?.VEHICLE_INFO}</Text>
      </TouchableOpacity>
    );
  };

  const filteredListData = listData.filter((item) =>
    item?.Vehicle[0]?.VEHICLE_INFO.toLowerCase().includes(search.toLowerCase())
  );


  return (
    <View style={{ flexDirection: 'row', flex: 1, backgroundColor: 'white' }}>
      <SideBar all={false} navigation={navigation} />
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
              <Text style={[text, { fontSize: moderateScale(15) }]}>{selectedVehicle}</Text>
            </View>
          )}
        </View>
        {selectedVehicle && (
          <TouchableOpacity
            style={button}
            onPress={() => {
              setVehicle(selectedVehicle);
              navigation.navigate('Main', {
                vehicleInfo: selectedVehicle,
                driverId: driverId
              })
            }}>
            <Text style={buttonText}>Proceed</Text>
          </TouchableOpacity>
        )}
      </View>
    </View >
  );
}
