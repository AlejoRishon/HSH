import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  FlatList,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import React, { useState } from 'react';
import { searchBox, tableHeader, text, dataText } from './styles/MainStyle';
import Icon from 'react-native-vector-icons/FontAwesome';
import Icons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useTranslation } from 'react-i18next';
import SideBar from './ui/SideBar';
import RightDeliveryDetails from './ui/RightDeliveryDetails';
import {
  Table,
  TableWrapper,
  Row,
  Rows,
  Col,
  Cols,
  Cell,
} from 'react-native-table-component';
import { getVehicle } from './functions/helper';
import { moderateScale, verticalScale } from './styles/Metrics';
import { Checkbox } from 'react-native-paper';

const { width, height } = Dimensions.get('window');
export default function DeliveryOrder({ navigation, route }) {
  const { t, i18n } = useTranslation();
  const parameter = getVehicle();
  const [showInput, setshowInput] = useState(false);
  const [checked, setChecked] = useState([])
  const [headerData, setheaderData] = useState([
    '     ',
    'DO No.',
    'Delivery Address',
    'Liters',
    'Status',
  ]);
  const [detailData, setdetailData] = useState([
    [
      'Transfer',
      'DO-12345678A',
      '2 Adam Rd, Singapore 289876',
      '800,000',
      'Pending',
    ],
    [
      'Transfer',
      'DO-90485729B',
      '21 Hillcrest Rd, Singapore 289072',
      '1,000,000',
      'Completed',
    ],
    [
      'Transfer',
      'DO-93877463V',
      '131 Rifle Range Rd, Singapore 588406',
      '800',
      'Completed',
    ],
    [
      'Transfer',
      'DO-11038479K',
      '21 Choa Chu Kang North 6, Singapore 689578',
      '100,000',
      'Completed',
    ],
    [
      'Transfer',
      'DO-35493831S',
      '101 Jln Bahar, Civil Defence Academy Complex, Singapore 649734',
      '20,000',
      'Completed',
    ],
    [
      'Transfer',
      'DO-12345678A',
      '2 Adam Rd, Singapore 289876',
      '800,000',
      'Pending',
    ],
    [
      'Transfer',
      'DO-90485729B',
      '21 Hillcrest Rd, Singapore 289072',
      '1,000,000',
      'Completed',
    ],
    [
      'Transfer',
      'DO-93877463V',
      '131 Rifle Range Rd, Singapore 588406',
      '800',
      'Completed',
    ],
    [
      'Transfer',
      'DO-11038479K',
      '21 Choa Chu Kang North 6, Singapore 689578',
      '100,000',
      'Completed',
    ],
    [
      'Transfer',
      'DO-35493831S',
      '101 Jln Bahar, Civil Defence Academy Complex, Singapore 649734',
      '20,000',
      'Completed',
    ],
  ]);
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

  const sortedData = detailData.sort((a, b) => {
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
            <Text style={text}>{parameter.vehicle}</Text>
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
            onPress={() => navigation.navigate('TransferList')}>
            <Icon name="exchange" color="#01315C" size={20} />

            <Text style={[text, { marginLeft: 10 }]}>Transfer</Text>
          </TouchableOpacity>
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
            {sortedData.map((rowData, index) => (
              <TouchableOpacity
                key={index.toString()}
                onPress={() => {
                  //setshowInput(true)
                  navigation.navigate('EditTrip');
                }}>
                <TableWrapper key={index} style={{ flexDirection: 'row' }}>
                  {rowData.map((cellData, cellIndex) => (
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
