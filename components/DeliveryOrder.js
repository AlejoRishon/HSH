import {
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Modal,
  Dimensions,
  Alert
} from 'react-native';
import React, { useState, useEffect } from 'react';
import { tableHeader, text } from './styles/MainStyle';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useTranslation } from 'react-i18next';
import DateTimePickerModal from "react-native-modal-datetime-picker";

import SideBar from './ui/SideBar';
// import RightDeliveryDetails from './ui/RightDeliveryDetails';
import {
  Table,
  TableWrapper,
  Row,
  Cell,
} from 'react-native-table-component';
import { getVehicle, getDomain } from './functions/helper';
import { moderateScale, verticalScale } from './styles/Metrics';
import { Checkbox, ActivityIndicator, MD2Colors, Avatar, Button, TextInput } from 'react-native-paper';
import NetInfo from "@react-native-community/netinfo";
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window');

export default function DeliveryOrder({ navigation, route }) {
  const domain = getDomain();
  const { t, i18n } = useTranslation();
  const parameter = getVehicle();
  const [showInput, setshowInput] = useState(false);
  const [TotalLitres, setTotalLitres] = useState(0);
  const [checked, setChecked] = useState([])
  const [orderList, setOrderList] = useState([])
  const [loading, setLoading] = useState(true)
  const [detailData, setdetailData] = useState([])
  const [showDate, setShowDate] = useState(false)
  const headerData = ['     ', 'DO No.', 'Delivery Address', 'Liters', 'Status']
  const [dateInput, setDateInput] = useState(new Date());
  const [formattedDate, setFormattedDate] = useState('');
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  const showDatePicker = () => {
    console.log(parameter)
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (date) => {
    // console.warn("A date has been picked: ", formatDate(new Date(date).toLocaleDateString()));
    getDeliveryOrder(formatDate(new Date(date)))
    hideDatePicker();
    setDateInput(new Date(date));

  };

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



  useEffect(() => {
    getDeliveryOrder(formatDate(new Date()))

    return () => {
      // getDeliveryOrder(formatDate(new Date()))
    }

  }, [])

  const getDeliveryOrder = async (sdate) => {
    setChecked([])
    setLoading(true);
    console.log(sdate)
    NetInfo.fetch().then(async networkState => {
      console.log("Is connected? - ", domain + `/getJobDetail?_token=404BF898-501C-469B-9FB0-C1C1CCDD7E29&PLATE_NO=${parameter.vehicle.VEHICLE_INFO}&date=${sdate}`);
      if (networkState.isConnected) {
        try {
          const response = await fetch(domain + `/getJobDetail?_token=404BF898-501C-469B-9FB0-C1C1CCDD7E29&PLATE_NO=${parameter.vehicle.VEHICLE_INFO}&date=${sdate}`);

          const json = await response.json();
          // console.log(json);
          if (json && json.length > 0) {
            // json[1].JOB_STATUS_DESC = 'Pending';
            // json[2].JOB_STATUS_DESC = 'Completed';
            if (sdate == formatDate(new Date())) {
              AsyncStorage.setItem('JOBDATA', JSON.stringify(json));
            }
            setOrderList(json);

            var totalLitres = 0;
            const transformedData = json?.map(item => {
              totalLitres += parseFloat(item?.qty_order);
              return [
                'Transfer',
                item?.INV_NO,
                `${item?.NAME} \n ${item?.PRINT_ADDRESS}`,
                item?.qty_order,
                item?.JOB_STATUS_DESC,

              ]
            })
            setTotalLitres(totalLitres);
            setdetailData(transformedData)
          }
          else {
            setOrderList([]);
            setdetailData([])
          }
          setLoading(false)
        } catch (error) {
          // console.error(error);
          setLoading(false)
        }
      }
      else {
        var localDeliveryData = await AsyncStorage.getItem('JOBDATA');
        if (localDeliveryData && sdate === formatDate(new Date())) {
          setLoading(false)
          Alert.alert('Offline mode', 'Data in offline mode can be outdated');
          let jsDelivery = JSON.parse(localDeliveryData)
          setOrderList(jsDelivery);

          const transformedData = jsDelivery?.map(item => [
            'Transfer',
            item?.INV_NO,
            `${item?.NAME} \n ${item?.PRINT_ADDRESS}`,
            item?.qty_order,
            item?.JOB_STATUS_DESC,

          ])
          setdetailData(transformedData)
        }
        else {
          Alert.alert('You are offline');
          setOrderList([]);
          setdetailData([])
          setLoading(false)

        }
      }
    });
  }

  const statusColor = {
    Pending: { text: '#EA631D', button: 'rgba(255, 181, 114, 0.47)' },
    Completed: { text: '#3DB792', button: 'rgba(107, 226, 190, 0.24)' },
  };

  const elementTransfer = (data, index) => {
    return <Icon name="plus" color="#2196F3" size={'large'} />;
  };

  const onPressCheckbox = (index) => {
    if (checked.includes(index)) {
      setChecked(checked.filter((i) => i !== index))
    } else {
      setChecked([index])
    }
  }

  const sortedData = detailData?.sort((a, b) => {
    if (a[4] === 'Pending' && b[4] !== 'Pending') {
      return -1
    } else if (a[4] !== 'Pending' && b[4] === 'Pending') {
      return 1
    } else {
      return 0
    }
  })

  const element = (data, index, status) => {
    // console.log("element", status)
    if (data === 'Transfer') {
      return (
        <Text
          style={{
            color: '#fff',
            alignSelf: 'center',
          }}>
          {/* <Icon name="refresh" color="#2196F3" size={22} /> */}
          < Checkbox
            disabled={status !== 'Pending' && status !== 'Delivered'}
            status={checked.includes(index) ? 'checked' : 'unchecked'}
            onPress={() => onPressCheckbox(index)}
            color='#01315C'
          />
        </Text>
      );
    } else {
      return (<Text
        style={{
          color: statusColor[data] ? statusColor[data].text : 'black',
          alignSelf: 'flex-start',
          paddingVertical: 10
        }}>
        {data}
      </Text>
      );
    }
  };
  return (
    <View style={{ flexDirection: 'row', flex: 1, backgroundColor: 'white' }}>
      <SideBar all={true} navigation={navigation} />
      <Modal
        animationType='none'
        transparent={true}
        visible={loading}
      >
        <ActivityIndicator animating={true} color={MD2Colors.red800} style={{ marginTop: '25%' }} size='large' />
      </Modal>
      <View style={{ flex: 1, margin: moderateScale(10) }}>
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
          <View style={{ flexDirection: 'row' }}>
            <TouchableOpacity
              disabled={checked.length > 0 ? false : true}
              style={{
                borderWidth: 1,
                borderColor: '#01315C',
                borderRadius: 8,
                flexDirection: 'row',
                alignItems: 'center',
                padding: 10,
                opacity: checked.length > 0 ? 1 : 0.4
              }}
              onPress={() => {
                console.log(orderList[checked[0]]);

                navigation.replace('TransferList', {
                  info: route?.params,
                  job: orderList[checked[0]].INV_NO
                });
                setOrderList([]);
                setdetailData([])
              }}>
              <Icon name="exchange" color="#01315C" size={20} />

              <Text style={[text, { marginLeft: 10 }]}>Transfer</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={showDatePicker}>
              <Avatar.Icon size={50} icon="calendar-month-outline" style={{ backgroundColor: 'white' }} color='#01315C' />
            </TouchableOpacity>
          </View>
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <Text style={[text, { marginTop: verticalScale(15) }]}>
            {t('trips')}
          </Text>
          <Text style={[text, { marginTop: verticalScale(15) }]}>
            Total litres:{TotalLitres}
          </Text>
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
              marginVertical: verticalScale(15),
              flex: 1,
            }}
          />
        </View>
        <Table style={{ flex: 1 }}>
          <Row
            data={headerData}
            flexArr={[0.5, 1, 2, 1, 1]}
            style={tableHeader}
            textStyle={text}
          />
          <ScrollView
            contentContainerStyle={{
              flexGrow: 1,
            }}>
            {sortedData.length > 0 ? sortedData?.map((rowData, index) => (
              // <View key={index.toString()}>
              <TouchableOpacity
                key={index.toString()}
                onPress={() => {
                  navigation.replace('EditTrip', {
                    driver: orderList[0]?.DRIVER_NAME,
                    inv: orderList[0]?.INV_NO,
                    name: orderList[0]?.NAME,
                    qty: orderList[0]?.qty_order,
                    address1: orderList[0]?.ADDRESS2,
                    address2: orderList[0]?.PRINT_ADDRESS,
                    invData: orderList.find((val) => val.INV_NO === rowData[1])
                  });
                }}>
                <TableWrapper key={index} style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
                  {rowData?.map((cellData, cellIndex) => (
                    <Cell
                      flex={cellIndex == 0 ? 0.5 : cellIndex == 2 ? 2 : 1}
                      key={cellIndex}
                      data={
                        cellIndex === 0
                          ? element(cellData, index, rowData[4])
                          : cellIndex === 4
                            ? element(cellData, index)
                            : cellData
                      }
                      textStyle={
                        {
                          fontSize: width / 50,
                          color: '#01315C',
                          paddingVertical: 10,
                          backgroundColor: 'red',
                        }}
                    />
                  ))}
                </TableWrapper>
              </TouchableOpacity>
              // </View>
            )) : <>
              <Text style={{ color: 'black', fontSize: 20, textAlign: 'center', marginTop: 30, fontWeight: 'bold' }}>No Jobs for this day</Text>
            </>}
            {/* <Rows data={detailData} textStyle={dataText} /> */}
          </ScrollView>
        </Table>
      </View>
      {/* <RightDeliveryDetails show={showInput} hide={() => setshowInput(false)} /> */}
      <DateTimePickerModal
        date={dateInput}
        isVisible={isDatePickerVisible}
        mode="date"
        onConfirm={handleConfirm}
        onCancel={hideDatePicker}
      />
    </View>
  );
}
