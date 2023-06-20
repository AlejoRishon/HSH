import {
  Text,
  View,
  Dimensions,
  FlatList,
  TouchableOpacity,
  Image,
} from 'react-native';
import React, { useState, useEffect } from 'react';
import {
  text,
  boxContainer,
} from './styles/MainStyle';
import Icon from 'react-native-vector-icons/FontAwesome';
import Check from 'react-native-vector-icons/Ionicons'
import SideBar from './ui/SideBar';
import { getVehicle } from './functions/helper';
import RightInputBar from './ui/RightInputBar';
import RightConfirm from './ui/RightConfirm';
import { horizontalScale, moderateScale, verticalScale } from './styles/Metrics';
import { Button, ToggleButton } from 'react-native-paper';
const { width, height } = Dimensions.get('window');
export default function DieselTransfer({ navigation }) {
  const parameter = getVehicle();
  const [selected, setSelected] = useState(null);
  const [showInput, setshowInput] = useState(false);
  const [showConfirm, setshowConfirm] = useState(false);
  const [selectedButton, setSelectedButton] = useState(null);
  const [checkVehicle, setCheckVehicle] = useState([])
  const [checkDriver, setCheckDriver] = useState([])
  const [showList, setShowList] = useState(false)

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

  const ItemView = ({ item, index }) => {
    return (
      // FlatList Item
      <TouchableOpacity
        style={{ marginVertical: verticalScale(20), flexDirection: 'row' }}
        onPress={() => { setCheckDriver([index]), setshowInput(true) }}
      >
        <Text style={[text, { fontSize: moderateScale(15) }]}>{item}</Text>
        {/* {checkDriver.includes(index) ? <Check name="md-checkmark-sharp" color="green" size={28} /> : <></>} */}
      </TouchableOpacity>
    );
  }

  // const VehicleView = ({ item, index }) => {
  //   return (
  //     // FlatList Item
  //     <TouchableOpacity
  //       style={{ marginVertical: verticalScale(20), flexDirection: 'row' }}
  //       onPress={() => setCheckVehicle([index])}
  //     >
  //       <Text style={[text, { fontSize: moderateScale(15) }]}>{item}</Text>
  //       {checkVehicle.includes(index) ? <Check name="md-checkmark-sharp" color="green" size={28} /> : <></>}
  //     </TouchableOpacity>
  //   );
  // }

  const handleButtonPress = (value) => {
    setSelectedButton(value);
  }

  return (
    <View style={{ flexDirection: 'row', flex: 1, backgroundColor: 'white' }}>
      <SideBar all={true} navigation={navigation} />
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
            onPress={() => navigation.navigate('VehicleList')}>
            <Icon name="exchange" color="#01315C" size={20} />

            <Text style={[text, { marginLeft: 10 }]}>Change vehicle</Text>
          </TouchableOpacity>
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'flex-start' }}>
          {/* <Text style={[text, {marginTop: 20}]}>{t('return')}</Text> */}
          <ToggleButton.Group
            value={selectedButton}
            onValueChange={handleButtonPress}>
            <ToggleButton
              icon={() => <View><Text style={{ color: selectedButton !== 'button1' ? '#01315C' : '#fff' }}>Input</Text></View>}
              value="button1"
              color='#01315C'
              style={{
                backgroundColor: selectedButton === 'button1' ? '#01315C' : '#FFF',
                color: selectedButton === 'button2' ? '#FFFFFF' : '#01315C',
                width: horizontalScale(30),
                height: verticalScale(70),
                margin: 2
              }}
            />
            <ToggleButton
              icon={() => <View><Text style={{ color: selectedButton !== 'button2' ? '#01315C' : '#fff' }}>Output</Text></View>}
              value="button2"
              color='#01315C'
              style={{
                backgroundColor: selectedButton === 'button2' ? '#01315C' : '#FFF',
                color: selectedButton === 'button2' ? '#FFF' : '#01315C',
                width: horizontalScale(30),
                height: verticalScale(70),
                margin: 2
              }}
            />
          </ToggleButton.Group>

        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <View
            style={{
              borderBottomWidth: 3,
              borderBottomColor: '#01315C',
              // marginVertical: 20,
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
        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            margin: moderateScale(5),
            marginRight: 20,
          }}>
          <TouchableOpacity
            onPress={() => {
              setshowInput(true);
              setSelected('jin');
            }}
            style={[
              boxContainer,
              { borderWidth: selected == 'jin' ? 3 : 0, borderColor: 'green' },
            ]}>
            <Image
              source={require('../assets/jin.png')}
              style={{
                flex: 1,
                height: undefined,
                width: undefined,
                alignSelf: 'stretch',
              }}
              resizeMode="contain" />
            <Text
              style={[text, { fontSize: moderateScale(12) }]}>{`Jin Besut`}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              setshowInput(true);
              setSelected('chin');
            }}
            style={[
              boxContainer,
              { borderWidth: selected == 'chin' ? 3 : 0, borderColor: 'green' },
            ]}>
            <Image
              source={require('../assets/chin.png')}
              resizeMode="contain"
              style={{
                flex: 1,
                height: undefined,
                width: undefined,
                alignSelf: 'stretch'
              }}
            />
            <Text
              style={[text, { fontSize: moderateScale(12) }]}>{`Chin Bee`}</Text>
          </TouchableOpacity>
        </View><View
          style={{
            flex: 1,
            // flexDirection: 'row',
            width: '46%',
            margin: moderateScale(5),
            marginRight: 20,
          }}>
          <TouchableOpacity
            onPress={() => {
              setShowList(true);
              setSelected('vehicle');
            }}
            style={[
              boxContainer,
              { borderWidth: selected == 'vehicle' ? 3 : 0, borderColor: 'green' },
            ]}>
            <Icon name='truck' size={20} color='#01315C' />
            <Text
              style={[text, { fontSize: moderateScale(12) }]}>{`Vehicle`}</Text>
          </TouchableOpacity>
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
              data={Data}
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
        hide={() => setshowInput(false)}
        onSubmit={() => {
          setSelected(null);
          setshowInput(false);
          setshowConfirm(true);
          setShowList(!showList)
        }}
      />
      <RightConfirm show={showConfirm} hide={() => setshowConfirm(false)} />
    </View>
  );
}
