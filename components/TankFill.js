import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  FlatList,
  Animated,
  TouchableOpacity,
  Image,
  TextInput
} from 'react-native';
import React, { useState, useRef, useEffect } from 'react';
import {
  searchBox,
  button,
  buttonText,
  text,
  boxContainer,
} from './styles/MainStyle';
import Icon from 'react-native-vector-icons/FontAwesome';
import Icons from 'react-native-vector-icons/MaterialCommunityIcons';
import Check from 'react-native-vector-icons/Ionicons'
import { useTranslation } from 'react-i18next';

import SideBar from './ui/SideBar';
import RightInputBar from './ui/RightInputBar';
import RightConfirm from './ui/RightConfirm';
import { getVehicle } from './functions/helper';
import { verticalScale, horizontalScale, moderateScale } from './styles/Metrics';
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

  const getBrandList = async () => {
    try {
      const response = await fetch('https://demo.vellas.net:94/pump/api/Values/getBrandList?_token=67E38BF0-4B45-4D93-891D-8E4F60C5485D');
      const json = await response.json();
      setListData(json);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => { getBrandList() }, [])

    const getProductListForBrand = () => {
    const selectedBrandData = listData.find(
      (item) => item.Brand_Desc === selected
    );
    return selectedBrandData ? selectedBrandData.productList : [];
  }

  const ItemView = ({ item, index }) => {
    return (
      // FlatList Item
      <TouchableOpacity
        style={{ marginVertical: verticalScale(20), flexDirection: 'row' }}
        onPress={() => setChecked([index])}
      >
        <Text style={[text, { fontSize: moderateScale(18) }]}>{item.Desc_Eng}</Text>
        {checked.includes(index) ? <Check name="md-checkmark-sharp" color="green" size={28} /> : <></>}
      </TouchableOpacity>
    );
  }

  console.log('z;kjnarkjnk:', getProductListForBrand())

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
          <Text style={[text, { marginTop: verticalScale(20) }]}>
            {t('brand')}
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
              marginVertical: verticalScale(20),
              flex: 1,
            }}
          />
        </View>
        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            marginVertical: verticalScale(20),
            marginRight: 20,
          }}>
          <TouchableOpacity
            onPress={() => {
              setshowInput(true);
              setSelected('SHELL');
              setShowList(true)
            }}
            style={[
              boxContainer,
              { borderWidth: selected == 'SHELL' ? 3 : 0, borderColor: 'green' },
            ]}>
            <Image source={require('../assets/shell.png')} style={styles.img} />
            {/* <Text style={[text, {fontSize: 25}]}>{`Shell`}</Text> */}
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              setshowInput(true);
              setSelected('Chevron Normal');
              setShowList(true)
            }}
            style={[
              boxContainer,
              { borderWidth: selected == 'Chevron Normal' ? 3 : 0, borderColor: 'green' },
            ]}>
            <Image
              source={require('../assets/caltex.png')}
              style={styles.img}
            />

            {/* <Text style={[text, {fontSize: 25}]}>{`Caltec`}</Text> */}
          </TouchableOpacity>
        </View>
        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            marginVertical: 20,
            marginRight: 20,
          }}>
          <TouchableOpacity
            onPress={() => {
              setshowInput(true);
              setSelected('Chevron');
              setShowList(true)
            }}
            style={[
              boxContainer,
              {
                borderWidth: selected == 'Chevron' ? 3 : 0,
                borderColor: 'green',
              },
            ]}>
            <Image
              source={require('../assets/chevron.png')}
              style={styles.img}
            />

            {/* <Text style={[text, {fontSize: 25}]}>{`Chevron`}</Text> */}
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              setshowInput(true);
              setSelected('SPC');
              setShowList(true)
            }}
            style={[
              boxContainer,
              { borderWidth: selected == 'SPC' ? 3 : 0, borderColor: 'green' },
            ]}>
            <Image source={require('../assets/spc.png')} style={styles.img} />

            {/* <Text style={[text, {fontSize: 25}]}>{`Spec`}</Text> */}
          </TouchableOpacity>
        </View>
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
        hide={() => { setshowInput(false), setShowList(false) }}
        onSubmit={() => {
          setSelected(null);
          setshowInput(false);
          setshowConfirm(true);
          setChecked([])
        }}
      />
      <RightConfirm show={showConfirm} hide={() => setshowConfirm(false)} />
    </View >
  );
}

const styles = StyleSheet.create({
  img: {
    width: horizontalScale(60),
    resizeMode: 'contain',
  },
});
