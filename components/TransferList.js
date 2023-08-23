import {
  Text,
  View,
  Dimensions,
  FlatList,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { searchBox, button, buttonText, text } from './styles/MainStyle';
import Icon from 'react-native-vector-icons/FontAwesome';
import Check from 'react-native-vector-icons/Ionicons'
import { setVehicle } from './functions/helper';
import { useTranslation } from 'react-i18next';
import { horizontalScale, moderateScale, verticalScale } from './styles/Metrics';
import { ActivityIndicator, MD2Colors } from 'react-native-paper';

const { width } = Dimensions.get('window');

export default function TransferList({ navigation, route }) {
  const { t } = useTranslation();

  const [checkVehicle, setCheckVehicle] = useState([])
  const [checkDriver, setCheckDriver] = useState([])
  const [proceed, setProceed] = useState(false)
  const [loading, setLoading] = useState(true)
  const [vehicleList, setVehicleList] = useState([]);

  const getVehicleList = async () => {
    try {
      const response = await fetch('https://demo.vellas.net:94/pump/api/Values/GetVehicleList?_token=4B3B5C99-57E8-4593-A0AD-3D4EEA3C2F53');
      const json = await response.json();
      setVehicleList(json);
      setLoading(false)
    } catch (error) {
      console.error(error);
      setLoading(false)
    }
  }

  const PostJobTransfer = () => {
    const url = `https://demo.vellas.net:94/pump/api/Values/PostJobTransfer`
    const data = {
      "VEHICLE_FROM": route?.params?.info?.vehicle,
      "VEHICLE_TO": "VEHICLE_TO2",
      "LOCATION_FROM": "",
      "LOCATION_TO": "",
      "REMARK": "your_remark",
      "UPDATE_BY": route?.params?.info?.name,
      "PROD_ID": 526,
      "QTY": 165,
      "TRANSFER_TYPE": 1
    }
    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    })
      .then(response => response.json())
      .then(result => {
        console.log(result);
        Alert.alert('Success')
      })
      .catch(error => {
        console.log("Error:", error);
      })
  }

  useEffect(() => {
    getVehicleList()
    onPressCheck()
  }, [checkDriver, checkVehicle])

  const [selectedVehicle, setselectedVehicle] = useState(null);

  const onPressCheck = () => {
    if (checkVehicle.length === 1 && checkDriver.length === 0) {
      setCheckDriver([checkVehicle[0]]);
      setProceed(true);
    } else if (checkVehicle.length === 1 && checkDriver.length === 1) {
      setProceed(true);
    } else {
      setProceed(false);
    }
  };


  // const DriverView = ({ item, index }) => {
  //   return (
  //     <TouchableOpacity
  //       style={{ marginVertical: verticalScale(20), flexDirection: 'row' }}
  //       onPress={() => setCheckDriver([index])}
  //     >
  //       <Text style={[text, { fontSize: moderateScale(15) }]}>{item?.Vehicle[0]?.driver_name}</Text>
  //       {checkDriver.includes(index) ? <Check name="md-checkmark-sharp" color="green" size={28} /> : <></>}
  //     </TouchableOpacity>
  //   );
  // }

  // const VehicleView = ({ item, index }) => {
  //   return (
  //     <TouchableOpacity
  //       style={{ marginVertical: verticalScale(20), flexDirection: 'row' }}
  //       onPress={() => { setCheckVehicle([index]); setCheckDriver([index]) }}>
  //       <Text style={[text, { fontSize: moderateScale(15) }]}>{item?.Vehicle[0]?.VEHICLE_INFO}</Text>
  //       {checkVehicle.includes(index) ? <Check name="md-checkmark-sharp" color="green" size={28} /> : <></>}
  //     </TouchableOpacity>
  //   );
  // }
  const DriverView = ({ item, index }) => {
    const isSelected = checkDriver.includes(index);

    return (
      <TouchableOpacity
        style={{
          marginVertical: verticalScale(20),
          flexDirection: 'row',
        }}
        onPress={() => setCheckDriver([index])}
      >
        <Text
          style={[
            text,
            {
              fontSize: moderateScale(15),
              color: isSelected ? 'green' : '#01315C',
            },
          ]}
        >
          {item?.Vehicle[0]?.driver_name}
        </Text>
      </TouchableOpacity>
    );
  };

  const VehicleView = ({ item, index }) => {
    const isSelected = checkVehicle.includes(index);

    return (
      <TouchableOpacity
        style={{
          marginVertical: verticalScale(20),
          flexDirection: 'row',
        }}
        onPress={() => {
          setCheckVehicle([index]);
          setCheckDriver([index]);
        }}
      >
        <Text
          style={[
            text,
            {
              fontSize: moderateScale(15),
              color: isSelected ? 'green' : '#01315C', 
            },
          ]}
        >
          {item?.Vehicle[0]?.VEHICLE_INFO}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={{ flexDirection: 'row', flex: 1, backgroundColor: 'white' }}>
      <View
        style={{
          backgroundColor: '#EEF7FF',
          justifyContent: 'space-between',
          paddingBottom: verticalScale(10),
          paddingTop: verticalScale(25),
        }}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{
            backgroundColor: '#01315C',
            justifyContent: 'center',
            alignItems: 'center',
            padding: moderateScale(8),
            marginHorizontal: 20,
            borderRadius: 8,
          }}>
          <Icon name="chevron-left" color="white" style={{ padding: 5 }} size={22} />
        </TouchableOpacity>
      </View>
      <View style={{ flex: 1, padding: moderateScale(15) }}>
        <View style={searchBox}>
          <Icon name="search" color="#01315C" size={20} />
          <TextInput
            style={{ marginLeft: horizontalScale(5) }}
            placeholderTextColor={'#01315C'}
            placeholder="Search for vehicle number"
          />
        </View>
        <View style={{ padding: 10 }} />
        {loading ? <View style={{ flex: 1, backgroundColor: 'white', justifyContent: 'center' }}>
          <ActivityIndicator animating={true} color={MD2Colors.red800} style={{ alignSelf: 'center' }} size='large' />
        </View> :
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', flex: 1 }}>
            <View style={{ flex: 1 }}>
              <Text style={text}>{`Vehicle List`}</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', paddingRight: horizontalScale(5) }}>
                <View
                  style={{
                    borderBottomWidth: 3,
                    borderBottomColor: '#01315C',
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
                data={vehicleList}
                renderItem={VehicleView}
                keyExtractor={(item, index) => index.toString()}
              />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={text}>{`Driver List`}</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <View
                  style={{
                    borderBottomWidth: 3,
                    borderBottomColor: '#01315C',
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
                data={vehicleList}
                renderItem={DriverView}
                keyExtractor={(item, index) => index.toString()}
              />
            </View>
          </View>
        }
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
            }} />
          <Text
            style={[
              text,
              { marginTop: verticalScale(18) },
            ]}>{t('Please select a vehicle and driver to proceed.')}</Text>

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
        {proceed && (
          <TouchableOpacity
            style={button}
            onPress={() => {
              // setVehicle(selectedVehicle);
              navigation.goBack();
            }}>
            <Text style={buttonText}>Proceed</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}
