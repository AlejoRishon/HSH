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
import React, {useState} from 'react';
import {searchBox, tableHeader, text, dataText} from './styles/MainStyle';
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
import {getVehicle} from './functions/helper';

const {width, height} = Dimensions.get('window');
export default function DeliveryOrder({navigation, route}) {
  const {t,i18n}=useTranslation();
  const parameter = getVehicle();
  const [showInput, setshowInput] = useState(false);
  const [headerData, setheaderData] = useState([
    'DO No.',
    'Delivery Address',
    'Liters',
    'Status',
  ]);
  const [detailData, setdetailData] = useState([
    ['DO-12345678A', '2 Adam Rd, Singapore 289876', '800,000', 'Pending'],
    [
      'DO-90485729B',
      '21 Hillcrest Rd, Singapore 289072',
      '1,000,000',
      'Completed',
    ],
    [
      'DO-93877463V',
      '131 Rifle Range Rd, Singapore 588406',
      '800',
      'Completed',
    ],
    [
      'DO-11038479K',
      '21 Choa Chu Kang North 6, Singapore 689578',
      '100,000',
      'Completed',
    ],
    [
      'DO-35493831S',
      '101 Jln Bahar, Civil Defence Academy Complex, Singapore 649734',
      '20,000',
      'Completed',
    ],
    ['DO-12345678A', '2 Adam Rd, Singapore 289876', '800,000', 'Pending'],
    [
      'DO-90485729B',
      '21 Hillcrest Rd, Singapore 289072',
      '1,000,000',
      'Completed',
    ],
    [
      'DO-93877463V',
      '131 Rifle Range Rd, Singapore 588406',
      '800',
      'Completed',
    ],
    [
      'DO-11038479K',
      '21 Choa Chu Kang North 6, Singapore 689578',
      '100,000',
      'Completed',
    ],
    [
      'DO-35493831S',
      '101 Jln Bahar, Civil Defence Academy Complex, Singapore 649734',
      '20,000',
      'Completed',
    ],
  ]);
  const statusColor = {
    Pending: {text: '#EA631D', button: 'rgba(255, 181, 114, 0.47)'},
    Completed: {text: '#3DB792', button: 'rgba(107, 226, 190, 0.24)'},
  };

  const element = (data, index) => {
    return (
      <TouchableOpacity
        style={{
          padding: 10,
          borderRadius: 15,
          backgroundColor: statusColor[data]
            ? statusColor[data].button
            : 'white',
        }}>
        <Text
          style={{color: statusColor[data] ? statusColor[data].text : 'black'}}>
          {data}
        </Text>
      </TouchableOpacity>
    );
  };
  return (
    <View style={{flexDirection: 'row', flex: 1, backgroundColor: 'white'}}>
      <SideBar all={true} navigation={navigation} />
      <View style={{flex: 1, padding: 20}}>
        <Text style={text}>{parameter.vehicle}</Text>
        <TouchableOpacity
          style={searchBox}
          onPress={() => navigation.navigate('VehicleList')}>
          <Icon name="exchange" color="#01315C" size={20} />

          <Text style={[text, {marginLeft: 10}]}>Change vehicle</Text>
        </TouchableOpacity>
        <View style={{flexDirection:'row',justifyContent:'flex-start'}}>
          <Text style={[text, {marginTop: 20}]}>{t('trips')}</Text>
        </View>
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
        <Table style={{flex: 1}}>
          <Row
            data={headerData}
            flexArr={[1, 2, 1, 1]}
            style={tableHeader}
            textStyle={text}
          />
          <ScrollView
            contentContainerStyle={{
              flexGrow: 1,
            }}>
            {detailData.map((rowData, index) => (
              <TouchableOpacity onPress={() => setshowInput(true)}>
                <TableWrapper key={index} style={{flexDirection: 'row'}}>
                  {rowData.map((cellData, cellIndex) => (
                    <Cell
                      flex={cellIndex == 1 ? 2 : 1}
                      key={cellIndex}
                      data={
                        cellIndex === 3 ? element(cellData, index) : cellData
                      }
                      textStyle={[
                        {
                          fontSize: 20,
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
