import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  FlatList,
  TouchableOpacity,
  Image,
  TextInput,
  Alert,
  Modal
} from 'react-native';
import React, { useState, useRef, useEffect } from 'react';
import {
  searchBox,
  text,
  boxContainer,
} from './styles/MainStyle';
import Icon from 'react-native-vector-icons/FontAwesome';
import Check from 'react-native-vector-icons/Ionicons'
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, MD2Colors } from 'react-native-paper';
import SideBar from './ui/SideBar';
import RightInputBar from './ui/RightInputBar';
import RightConfirm from './ui/RightConfirm';
import { getVehicle } from './functions/helper';
import { verticalScale, horizontalScale, moderateScale } from './styles/Metrics';
import { ScrollView } from 'react-native-gesture-handler';
const { width, height } = Dimensions.get('window');

export default function TankFill({ navigation, route }) {
  const { t, i18n } = useTranslation();
  const rightBar = useRef(null);

  const parameter = getVehicle();
  const [selected, setSelected] = useState(null);
  const [showInput, setshowInput] = useState(false);
  const [showConfirm, setshowConfirm] = useState(false);
  const [showList, setShowList] = useState(false)
  const [checked, setChecked] = useState([])
  const [listData, setListData] = useState([])
  const [prodId, setProdId] = useState('')
  const [dieselValue, setDieselValue] = useState(0)
  const [showWareHouse, setShowWareHouse] = useState(false)
  const [wareHouseList, setWareHouseList] = useState([])
  const [wareHouseId, setWareHouseId] = useState(null)
  const [loading, setLoading] = useState(true)

  const handleGetInputDiesel = (value) => setDieselValue(value)

  const getBrandList = async () => {
    try {
      const response = await fetch('https://demo.vellas.net:94/pump/api/Values/getBrandList?_token=67E38BF0-4B45-4D93-891D-8E4F60C5485D');
      const json = await response.json();
      // console.log(json);
      setListData(json);
      setLoading(false)
    } catch (error) {
      console.error(error);
    }
  }

  const getWareHouseList = async () => {
    try {
      const response = await fetch('https://demo.vellas.net:94/pump/api/Values/GetWarehouseList?_token=FF9B60E6-5DB4-4A58-BBA9-4C3F84CE9105')
      const json = await response.json();
      console.log('Warehouse List:', json)
      setWareHouseList(json);
    } catch (error) {
      console.error('Error fetching warehouse list:', error);
    }
  };

  const postJobPurchase = () => {
    const url = "https://demo.vellas.net:94/pump/api/Values/PostjobPurchase"
    const data = {
      "VEHICLE_CODE": route?.params?.info?.vehicleInfo,
      "DRIVER_ID": route?.params?.info?.driverId,
      "PROD_ID": prodId,
      "QTY": dieselValue,
      "UPDATE_BY": route?.params?.info?.driverName
    }
    console.log(data)
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
        if (result == 'success') {
          setSelected(null);
          setshowInput(false);
          setshowConfirm(true);
          setChecked([]);
        } else {
          Alert.alert("Job Failed");
        }
      })
      .catch(error => {
        console.log("Error:", error);
      })
  }

  const postJobTransfer = () => {
    var vehicleData = getVehicle().vehicle;
    const url = "https://demo.vellas.net:94/pump/api/Values/PostJobTransfer"
    const data = {
      "VEHICLE_FROM": vehicleData.VEHICLE_INFO,
      "VEHICLE_TO": "",
      "LOCATION_FROM": wareHouseId,
      "LOCATION_TO": "",
      "REMARK": "",
      "UPDATE_BY": vehicleData.DRIVER_NAME ? vehicleData.DRIVER_NAME : 'admin',
      "PROD_ID": 0,
      "QTY": dieselValue,
      "TRANSFER_TYPE": 0
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
        setSelected(null);
        setshowInput(false);
        setshowConfirm(true);
        setChecked([]);
      })
      .catch(error => {
        console.log("Error:", error);
      })
  }

  useEffect(() => {
    getBrandList()
    getWareHouseList()
  }, [])

  const getProductListForBrand = () => {
    const selectedBrandData = selected
    return selectedBrandData ? selectedBrandData.productList : [];
  }

  const ItemView = ({ item, index }) => {
    return (
      <TouchableOpacity
        style={{ marginVertical: verticalScale(20), flexDirection: 'row' }}
        onPress={() => { setChecked([index]), setProdId(item.Id), setshowInput(true) }}
      >
        <Text style={[text, { fontSize: moderateScale(18) }]}>{item.Desc_Eng}</Text>
        {checked.includes(index) ? <Check name="md-checkmark-sharp" color="green" size={28} /> : <></>}
      </TouchableOpacity>
    );
  }

  return (
    <View style={{ flexDirection: 'row', flex: 1, backgroundColor: 'white' }}>
      <SideBar all={true} navigation={navigation} />
      {!showList ? <View style={{ flex: 1, padding: 20 }}>
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'flex-start',
              alignItems: 'center',
            }}>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('Main');
              }}>
              <Icon
                name="chevron-left"
                color="#01315C"
                size={30}
                style={{ marginRight: 10 }}
              />
            </TouchableOpacity>
            <Text style={text}>{parameter.vehicle.VEHICLE_INFO}</Text>
          </View>
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
        <View style={{ flexDirection: 'row', justifyContent: 'flex-start' }}>
          <TouchableOpacity onPress={() => setShowWareHouse(!showWareHouse)}>
            <Text style={[text, { marginTop: verticalScale(20), color: !showWareHouse ? '#fff' : '#01315C', backgroundColor: !showWareHouse ? 'rgba(1, 49, 92, 0.7)' : '#fff', borderRadius: 2, padding: 5 }]}>
              {t('brand')}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setShowWareHouse(true)}>
            <Text style={[text, { marginTop: verticalScale(20), marginLeft: horizontalScale(20), color: showWareHouse ? '#fff' : '#01315C', backgroundColor: showWareHouse ? 'rgba(1, 49, 92, 0.7)' : '#fff', borderRadius: 2, padding: 5 }]}>
              {t('Warehouse')}
            </Text>
          </TouchableOpacity>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <View
            style={{
              borderBottomWidth: 3,
              borderBottomColor: '#01315C',
              marginVertical: verticalScale(10),
              width: 40,
            }}
          />
          <View
            style={{
              borderBottomWidth: 1,
              borderBottomColor: '#01315C',
              marginVertical: verticalScale(20),
              flex: 1,
            }}
          />
        </View>
        <Modal
          animationType='none'
          transparent={true}
          visible={loading}>
          <View style={{ justifyContent: 'center', flex: 1 }}>
            <ActivityIndicator animating={true} color={MD2Colors.red800} style={{ position: 'absolute', alignSelf: 'center' }} size='large' />
          </View>
        </Modal>
        {!showWareHouse ? <ScrollView style={{ flex: 1 }}>
          <View style={{ flexWrap: 'wrap', flexDirection: 'row', }}>
            {listData.length > 0 && listData?.slice(2)?.map((val, index) => {
              let imageSource;

              switch (val.Brand_Desc) {
                case "SPC":
                  imageSource = require('../assets/spc.png');
                  break;
                case "SHELL":
                  imageSource = require('../assets/shell.png');
                  break;
                case "Mobil":
                  imageSource = require('../assets/mobil.jpeg');
                  break;
                case "Chevron":
                  imageSource = require('../assets/chevron.png');
                  break;
                default:
                  imageSource = require('../assets/spc.png');
              }
              return <View
                key={index}
                style={{
                  marginVertical: verticalScale(20),
                  width: '47%',
                }}>
                <TouchableOpacity
                  onPress={() => {
                    setshowInput(false);
                    setSelected(val);
                    setShowList(true);
                    setChecked([])
                  }}
                  style={[
                    boxContainer,
                    { borderWidth: selected?.Brand_Desc == val.Brand_Desc ? 3 : 0, borderColor: 'green' },
                  ]}>
                  <Image source={imageSource} style={{ width: '90%', resizeMode: 'contain' }} />
                </TouchableOpacity>
              </View>
            })}
          </View>

        </ScrollView> :
          <ScrollView style={{ flex: 1 }}>
            <View style={{ flexWrap: 'wrap', flexDirection: 'row', }}>
              {wareHouseList.length > 0 && wareHouseList?.map((val, index) => {
                let imageSource

                switch (val.id) {
                  case 1:
                    imageSource = require('../assets/jin.png');
                    break;
                  case 2:
                    imageSource = require('../assets/chin.png');
                    break;
                  case 3:
                    imageSource = require('../assets/penjuru.jpeg');
                    break;
                  default:
                    imageSource = require('../assets/shell.png');
                }
                return <View
                  key={index}
                  style={{
                    marginVertical: verticalScale(20),
                    width: '45%',
                  }}>
                  <TouchableOpacity
                    onPress={() => {
                      setshowInput(true);
                      setSelected(val);
                      setChecked([])
                      setWareHouseId(val?.id)
                    }}
                    style={[
                      boxContainer,
                      { borderWidth: selected?.name == val.name ? 3 : 0, borderColor: 'green', height: 120 },
                    ]}>
                    <Image source={imageSource} style={styles.img} />
                    <Text style={{ fontSize: width / 35, color: 'red', fontWeight: '900' }}>{val.name}</Text>
                  </TouchableOpacity>
                </View>
              })}
            </View>

          </ScrollView>}

      </View> :
        <View style={{ flex: 1, padding: moderateScale(15) }}>
          <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
            <TouchableOpacity style={{ alignSelf: 'center' }}
              onPress={() => { setShowList(false), setshowInput(false) }}>
              <Icon
                name="chevron-left"
                color="#01315C"
                size={30}
                style={{ marginRight: 10 }}
              />
            </TouchableOpacity>
            <View style={[searchBox, { width: horizontalScale(150) }]}>
              <Icon name="search" color="#01315C" size={20} />
              <TextInput
                style={{ marginLeft: horizontalScale(5) }}
                placeholderTextColor={'#01315C'}
                placeholder="Search for Product"
              />
            </View>
          </View>
          <Text style={[text, { marginTop: 20 }]}>{`Product List`}</Text>
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
            data={getProductListForBrand()}
            showsVerticalScrollIndicator={true}
            renderItem={ItemView}
            keyExtractor={(item) => item.Id.toString()}
          />
        </View>
      }
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
              marginVertical: 20,
            }}
          />
          <Text
            style={[
              text,
              { marginTop: verticalScale(18) },
            ]}>{`Select a module to continue`}</Text>
        </View>
      </View>

      <RightInputBar
        header="Liters of Diesel Pumped"
        subHeader="Enter quantity of diesel pumped"
        show={showInput}
        getInputDiesel={handleGetInputDiesel}
        hide={() => { setshowInput(false), setShowList(false) }}
        onSubmit={() => {
          handleGetInputDiesel(dieselValue)
          if (showWareHouse == true) {
            postJobTransfer()
          } else {
            postJobPurchase()
          }
        }}
      />
      <RightConfirm show={showConfirm} hide={() => setshowConfirm(false)} />
    </View >
  );
}

const styles = StyleSheet.create({
  img: {
    width: '100%',
    height: '65%',
    resizeMode: 'contain',
  },
});
