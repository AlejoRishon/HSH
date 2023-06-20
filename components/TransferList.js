import {
  StyleSheet,
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
import SideBar from './ui/SideBar';
import Check from 'react-native-vector-icons/Ionicons'
import { setVehicle } from './functions/helper';
import { useTranslation } from 'react-i18next';
import { horizontalScale, moderateScale, verticalScale } from './styles/Metrics';

const { width, height } = Dimensions.get('window');

export default function TransferList({ navigation }) {

  const { t, i18n } = useTranslation();

  const [checkVehicle, setCheckVehicle] = useState([])
  const [checkDriver, setCheckDriver] = useState([])
  const [proceed, setProceed] = useState(false)

  const Data = [
    'TRB8888A',
    'TCB9990X',
    'THL8822B',
    'TLC1234S',
    'TRB8888A',
    'TCB9990X',
    'THL8822B',
    'TLC1234S',
  ]

  useEffect(() => {
    onPressCheck()
  }, [checkDriver, checkVehicle])

  const [selectedVehicle, setselectedVehicle] = useState(null);

  const onPressCheck = (item) => {
    if (checkVehicle.length === 1 && checkDriver.length === 1) {
      setProceed(true);
    } else {
      setProceed(false);
    }
  }

  const DriverView = ({ item, index }) => {
    return (
      // FlatList Item
      <TouchableOpacity
        style={{ marginVertical: verticalScale(20), flexDirection: 'row' }}
        onPress={() => setCheckDriver([index])}
      >
        <Text style={[text, { fontSize: moderateScale(15) }]}>{item}</Text>
        {checkDriver.includes(index) ? <Check name="md-checkmark-sharp" color="green" size={28} /> : <></>}
      </TouchableOpacity>
    );
  }

  const VehicleView = ({ item, index }) => {
    return (
      // FlatList Item
      <TouchableOpacity
        style={{ marginVertical: verticalScale(20), flexDirection: 'row' }}
        onPress={() => setCheckVehicle([index])}
      >
        <Text style={[text, { fontSize: moderateScale(15) }]}>{item}</Text>
        {checkVehicle.includes(index) ? <Check name="md-checkmark-sharp" color="green" size={28} /> : <></>}
      </TouchableOpacity>
    );
  }

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
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', flex: 1 }}>
          <View style={{ flex: 1 }}>
            <Text style={text}>{`Vehicle List`}</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', paddingRight: horizontalScale(5) }}>
              <View
                style={{
                  borderBottomWidth: 3,
                  borderBottomColor: '#01315C',
                  // marginVertical: verticalScale(25),
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
              data={Data}
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
              data={Data}
              renderItem={DriverView}
              keyExtractor={(item, index) => index.toString()}
            />
          </View>
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
              setVehicle(selectedVehicle);
              navigation.goBack();
            }}>
            <Text style={buttonText}>Proceed</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}
