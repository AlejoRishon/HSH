import {
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Modal,
} from 'react-native';
import React, { useState, useEffect } from 'react';
import { tableHeader, text } from './styles/MainStyle';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useTranslation } from 'react-i18next';
import SideBar from './ui/SideBar';
import RightDeliveryDetails from './ui/RightDeliveryDetails';
import {
  Table,
  TableWrapper,
  Row,
  Cell,
} from 'react-native-table-component';
import { getVehicle } from './functions/helper';
import { moderateScale, verticalScale } from './styles/Metrics';
import { Checkbox, ActivityIndicator, MD2Colors, Avatar, Button, TextInput } from 'react-native-paper';

export default function DeliveryOrder({ navigation, route }) {
  const { t, i18n } = useTranslation();
  const parameter = getVehicle();
  const [showInput, setshowInput] = useState(false);
  const [checked, setChecked] = useState([])
  const [orderList, setOrderList] = useState([])
  const [loading, setLoading] = useState(true)
  const [detailData, setdetailData] = useState([])
  const [showDate, setShowDate] = useState(false)
  const headerData = ['     ', 'DO No.', 'Delivery Address', 'Liters', 'Status']
  const [dateInput, setDateInput] = useState('');
  const [formattedDate, setFormattedDate] = useState('');

  const formatDate = (inputDate) => {
    const [day, month, year] = inputDate.split('-');
    const formatted = `${day}-${month}-${year}`;
    return formatted;
  };

  const handleDateChange = () => {
    const formatted = formatDate(dateInput);
    setFormattedDate(formatted);
  };

  useEffect(() => { getDeliveryOrder() }, [])

  const getDeliveryOrder = async () => {
    setLoading(true)
    try {
      const response = await fetch(`https://demo.vellas.net:94/pump/api/Values/getJobDetail?_token=404BF898-501C-469B-9FB0-C1C1CCDD7E29&driverId=11&date=17-05-2023`)
      const json = await response.json()
      setOrderList(json)
      const transformedData = json?.map(item => [
        'Transfer',
        item?.INV_NO,
        item?.PRINT_ADDRESS,
        item?.qty_order,
        'Pending',
      ])
      setdetailData(transformedData)
      setLoading(false)
    } catch (error) {
      console.error(error);
    }
  }
  console.log('Qdljgn:', orderList)

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
      setChecked([...checked, index])
    }
  }

  const sortedData = detailData?.sort((a, b) => {
    if (a[4] === 'Pending' && b[4] === 'Completed') {
      return -1
    } else if (a[4] === 'Completed' && b[4] === 'Pending') {
      return 1
    } else {
      return 0
    }
  })

  const element = (data, index) => {
    if (data === 'Transfer') {
      return (
        <Text
          style={{
            color: '#fff',
            alignSelf: 'center',
          }}>
          {/* <Icon name="refresh" color="#2196F3" size={22} /> */}
          < Checkbox
            status={checked.includes(index) ? 'checked' : 'unchecked'}
            onPress={() => onPressCheckbox(index)}
            color='#01315C'
          />
        </Text>
      );
    } else {
      return (
        <TouchableOpacity
          style={{
            padding: moderateScale(7),
            borderRadius: 15,
            backgroundColor: statusColor[data]
              ? statusColor[data].button
              : 'white',
          }}>
          <Text
            style={{
              color: statusColor[data] ? statusColor[data].text : 'black',
              alignSelf: 'center',
            }}>
            {data}
          </Text>
        </TouchableOpacity>
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
              style={{
                borderWidth: 1,
                borderColor: '#01315C',
                borderRadius: 8,
                flexDirection: 'row',
                alignItems: 'center',
                padding: 10,
              }}
              onPress={() => navigation.navigate('TransferList', {
                info: route?.params
              })}>
              <Icon name="exchange" color="#01315C" size={20} />

              <Text style={[text, { marginLeft: 10 }]}>Transfer</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setShowDate(true)}>
              <Avatar.Icon size={50} icon="calendar-month-outline" style={{ backgroundColor: 'white' }} color='#01315C' />
            </TouchableOpacity>
          </View>
          <Modal
            animationType='none'
            transparent={true}
            visible={true}
          >
            <View style={{ alignSelf: 'center', height: '40%', width: '40%', borderRadius: 10, backgroundColor: 'white', elevation: 2, justifyContent: 'space-around', marginTop: '20%' }}>
              <TextInput
                placeholder="dd-mm-yyyy"
                value={dateInput}
                onChangeText={setDateInput}
                style={{
                  borderBottomWidth: 1,
                  borderColor: '#333',
                  backgroundColor: 'white',
                  width: '80%',
                  alignSelf: 'center',
                  height: 50
                }}
              />
              <Button onPress={handleDateChange} style={{ alignSelf: 'flex-end', marginRight: 40, marginTop: 20 }} >Save</Button>
              <Text style={{ marginTop: 20 }}>Formatted Date: {formattedDate}</Text>
            </View>
          </Modal>
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'flex-start' }}>
          <Text style={[text, { marginTop: verticalScale(15) }]}>
            {t('trips')}
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
            {sortedData?.map((rowData, index) => (
              <TouchableOpacity
                key={index.toString()}
                onPress={() => {
                  //setshowInput(true)
                  navigation.navigate('EditTrip', {
                    driver: orderList[0]?.DRIVER_NAME,
                    inv: orderList[0]?.INV_NO,
                    name: orderList[0]?.NAME,
                    qty: orderList[0]?.qty_order,
                    address1: orderList[0]?.ADDRESS2,
                    address2: orderList[0]?.PRINT_ADDRESS,
                    invData: orderList.find((val) => val.INV_NO === rowData[1])
                  });
                }}>
                <TableWrapper key={index} style={{ flexDirection: 'row' }}>
                  {rowData?.map((cellData, cellIndex) => (
                    <Cell
                      flex={cellIndex == 0 ? 0.5 : cellIndex == 2 ? 2 : 1}
                      key={cellIndex}
                      data={
                        cellIndex === 0
                          ? element(cellData, index)
                          : cellIndex === 4
                            ? element(cellData, index)
                            : cellData
                      }
                      textStyle={[
                        {
                          fontSize: 18,
                          color: '#01315C',
                          paddingVertical: 20,
                          backgroundColor: 'red',
                        },
                      ]}
                    />
                  ))}
                </TableWrapper>
              </TouchableOpacity>
            ))}
            {/* <Rows data={detailData} textStyle={dataText} /> */}
          </ScrollView>
        </Table>
      </View>
      <RightDeliveryDetails show={showInput} hide={() => setshowInput(false)} />
    </View>
  );
}
