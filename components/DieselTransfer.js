import {
  Text,
  View,
  Dimensions,
  FlatList,
  TouchableOpacity,
  Image,
  Alert,
  StyleSheet,
  Modal,
  ScrollView
} from 'react-native';
import React, { useState, useEffect } from 'react';
import {
  text,
  boxContainer,
} from './styles/MainStyle';
import Icon from 'react-native-vector-icons/FontAwesome';
import SideBar from './ui/SideBar';
import { getVehicle, getDomain, getlogUser } from './functions/helper';
import RightInputBar from './ui/RightInputBar';
import RightConfirm from './ui/RightConfirm';
import { moderateScale, verticalScale } from './styles/Metrics';
import { ActivityIndicator, MD2Colors } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window');
export default function DieselTransfer({ navigation }) {
  const parameter = getVehicle();
  const [selected, setSelected] = useState(null);
  const [showInput, setshowInput] = useState(false);
  const [productListVisible, setproductListVisible] = useState(false);
  const [WarehouseProductList, setWarehouseProductList] = useState([]);
  const [showConfirm, setshowConfirm] = useState(false);
  const [productSelected, setproductSelected] = useState(null);
  const [selectedButton, setSelectedButton] = useState(null);
  const [checkVehicle, setCheckVehicle] = useState([])
  const [checkDriver, setCheckDriver] = useState([])
  const [showList, setShowList] = useState(false)
  const [dieselValue, setDieselValue] = useState(0)
  const [listData, setListData] = useState([]);
  const [wareHouseList, setWareHouseList] = useState([])
  const [wareHouseId, setWareHouseId] = useState(null)
  const [loading, setLoading] = useState(true)
  const domain = getDomain();

  const getVehicleList = async () => {
    try {
      const response = await fetch(domain + '/GetVehicleList?_token=4B3B5C99-57E8-4593-A0AD-3D4EEA3C2F53');
      const json = await response.json();
      console.log(json)
      var filteredList = json.filter(val => val.Vehicle[0].VEHICLE_INFO !== parameter.vehicle.VEHICLE_INFO)
      setListData(filteredList);
      // setLoading(false)
    } catch (error) {
      console.error(error);
      // setLoading(false)
    }
  }

  const getWareHouseList = async () => {
    try {
      const response = await fetch(domain + '/GetWarehouseList?_token=FF9B60E6-5DB4-4A58-BBA9-4C3F84CE9105')
      const json = await response.json();
      json.push('Vehicle')
      // console.log('Warehouse List:', json)
      setWareHouseList(json);
      setLoading(false)
    } catch (error) {
      console.error('Error fetching warehouse list:', error);
    }
  }

  getWareHouseProductList = () => {
    fetch(domain + '/getProductList?_token=FAEB7E31-0DE5-48BE-9EC9-8D97D21EF8B3')
      .then(response => response.json())
      .then(result => {

        var fResult = result.filter(val => val.category === 'Bulk');
        console.log('Product list', JSON.stringify(fResult[0]));
        if (fResult && fResult.length > 0) {
          var productData = [];
          fResult[0].product.map(val => {
            productData.push({ "Desc_Eng": val.desc, "Id": val.id })
          })
          setWarehouseProductList(productData)
        }
        // setProductList(fResult);
        // 
      })
      .catch(error => console.error(error))
  }

  useEffect(() => {
    getVehicleList()
    getWareHouseList()
    getWareHouseProductList()
  }, [])

  const ItemView = ({ item, index }) => {
    return (
      <TouchableOpacity
        style={{ marginVertical: verticalScale(20), flexDirection: 'row' }}
        onPress={() => { setCheckDriver([index]), setproductListVisible(true); setShowList(false); setCheckVehicle(item?.Vehicle[0]?.VEHICLE_INFO) }}
      >
        <Text style={[text, { fontSize: moderateScale(15) }]}>{item?.Vehicle[0]?.VEHICLE_INFO}</Text>
        {/* {checkDriver.includes(index) ? <Check name="md-checkmark-sharp" color="green" size={28} /> : <></>} */}
      </TouchableOpacity>
    );
  }

  const handleButtonPress = (value) => setSelectedButton(value)

  const handleGetInputDiesel = (value) => setDieselValue(value)

  const postTransfer = async () => {
    const userlog = getlogUser();
    var vehicleData = getVehicle().vehicle;
    const url = domain + "/PostJobTransfer";
    const data = {
      "VEHICLE_FROM": vehicleData.VEHICLE_INFO,
      "VEHICLE_TO": selected == 'vehicle' ? checkVehicle : '',
      "LOCATION_FROM": "",
      "LOCATION_TO": selected != 'vehicle' ? wareHouseId : '',
      "REMARK": "",
      "UPDATE_BY": userlog,
      "PROD_ID": productSelected,
      "QTY": dieselValue,
      "TRANSFER_TYPE": 1,
      "VL_UID": 0
    }
    console.log("OUT", data)
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
        // Alert.alert('Success')
        setshowInput(false);
        setshowConfirm(true);
        setCheckVehicle('');
        setSelected(null);
      })
      .catch(error => {
        console.log("Error:", error);
        Alert.alert('Job Failed!')
      })
  }
  const renderItem = ({ item }) => {
    return (
      <TouchableOpacity style={{ justifyContent: 'center', borderBottomWidth: 1, borderColor: '#0465bd', padding: 6 }}
        onPress={() => { console.log(item); setproductSelected(item.Id), setshowInput(true); setproductListVisible(false) }}
      >
        <Text style={[text, { fontSize: moderateScale(12), alignSelf: 'center', color: '#0465bd' }]} >{item.Desc_Eng}</Text>
      </TouchableOpacity >
    )
  }

  return (
    <View style={{ flexDirection: 'row', flex: 1, backgroundColor: 'white' }}>
      {/* <SideBar all={true} navigation={navigation} /> */}
      <View style={{ flex: 1, padding: 20, paddingBottom: 0 }}>
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
                navigation.navigate('DieselOutTransfer');
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
              marginVertical: 10,
              flex: 1,
            }} />
        </View>
        <Modal
          animationType='none'
          transparent={true}
          visible={loading}>
          <View style={{ justifyContent: 'center', flex: 1 }}>
            <ActivityIndicator animating={true} color={MD2Colors.red800} style={{ position: 'absolute', alignSelf: 'center' }} size='large' />
          </View>
        </Modal>

        <Modal transparent={true} visible={productListVisible} onDismiss={() => setproductListVisible(false)} >
          <View style={{ width: '100%', backgroundColor: 'rgba(0,0,0,0.4)', flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <View style={{ backgroundColor: 'white', width: '40%' }}>
              <FlatList
                data={WarehouseProductList}
                renderItem={renderItem}
                keyExtractor={(item, index) => `${item}_${index}`}
              /></View></View>
        </Modal>
        <ScrollView>
          <View
            style={{
              flexDirection: 'row',
              margin: moderateScale(5),
              marginRight: 20,
              flexWrap: 'wrap',
              alignItems: 'center'
            }}>
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
                case 4:
                  imageSource = require('../assets/CBStore.jpeg');
                  break;
                default:
                  imageSource = require('../assets/shell.png');
              }
              return <View
                key={index}
                style={{
                  marginVertical: verticalScale(10),
                  width: '50%',
                  height: 150
                }}>
                {index === wareHouseList.length - 1 ? <TouchableOpacity
                  onPress={() => {
                    setshowInput(false);
                    setShowList(true);
                    setSelected('vehicle');
                    setCheckVehicle('');
                  }}
                  style={[
                    boxContainer,
                    { borderWidth: selected == 'vehicle' ? 3 : 0, borderColor: 'green' },
                  ]}>
                  <Icon name='truck' size={20} color='#01315C' />
                  <Text
                    style={[text, { fontSize: moderateScale(12) }]}>{`Vehicle`}</Text>
                </TouchableOpacity> : <TouchableOpacity
                  onPress={() => {
                    // setshowInput(true);
                    setproductListVisible(true);
                    setSelected(val);
                    setCheckVehicle('')
                    setWareHouseId(val?.id)
                  }}
                  style={[
                    boxContainer,
                    { borderWidth: selected?.name == val.name ? 3 : 0, borderColor: 'green', height: 120 },
                  ]}>

                  <Image source={imageSource} style={styles.img} />
                  <Text style={{ fontSize: width / 35, color: 'red', fontWeight: '900' }}>{val.name}</Text>
                </TouchableOpacity>}

              </View>
            })}

          </View>
        </ScrollView>
        <View
          style={{
            flex: 1,
            width: '46%',
            marginRight: 20,
            alignSelf: 'flex-end',
          }}>

        </View>
      </View>

      <View
        style={{
          width: width * 0.35,
          backgroundColor: '#EEF7FF',
          padding: 50,
          justifyContent: 'space-between',
        }}>
        {!showList ?
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
          :
          <>
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
              data={listData}
              showsVerticalScrollIndicator={true}
              renderItem={ItemView}
              keyExtractor={(item, index) => index.toString()}
            />
          </>
        }
      </View>
      <RightInputBar
        header="Liters of Diesel Pumped"
        subHeader="Enter quantity of diesel pumped"
        show={showInput}
        getInputDiesel={handleGetInputDiesel}
        hide={() => setshowInput(false)}
        onSubmit={() => { postTransfer() }}
      />
      <RightConfirm show={showConfirm} hide={() => setshowConfirm(false)} />
    </View>
  )
}

const styles = StyleSheet.create({
  img: {
    width: '100%',
    height: '65%',
    resizeMode: 'contain',
  },
});