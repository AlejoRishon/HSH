import {
  StyleSheet,
  Text,
  View,
  Modal,
  Animated,
  Dimensions,
  FlatList,
  Image,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {
  searchBox,
  tableHeader,
  text,
  dataText,
  remarks,
} from './styles/MainStyle';
import Icon from 'react-native-vector-icons/FontAwesome';
import Icons from 'react-native-vector-icons/MaterialCommunityIcons';
import * as ImagePicker from 'react-native-image-picker';
import {useTranslation} from 'react-i18next';
import SideBar from './ui/SideBar';
import RightDeliveryDetails from './ui/RightDeliveryDetails';
import RightInputBar from './ui/RightInputBar';
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
  const {t, i18n} = useTranslation();
  const parameter = getVehicle();
  const [showInput, setshowInput] = useState(!true);
  const heightAnim = useRef(new Animated.Value(0)).current;
  const heightMeterAfAnim = useRef(new Animated.Value(0)).current;
  const heightMeterBeAnim = useRef(new Animated.Value(0)).current;
  const [uploadtype, setuploadtype] = useState('after');
  const [moreMeterAf, setmoreMeterAf] = useState(false);
  const [moreMeterBe, setmoreMeterBe] = useState(false);

  const [modalVisible, setModalVisible] = useState(false);
  //after
  const [previewImageUri, setpreviewImageUri] = useState('');
  const [imagePreview, setimagePreview] = useState(false);
  //before
  const [previewImageUribefore, setpreviewImageUribefore] = useState('');
  const [imagePreviewbefore, setimagePreviewbefore] = useState(false);

  const openGallery = async (type, section) => {
    const options = {
      mediaType: 'image',
      includeBase64: false,
      maxHeight: 800,
      maxWidth: 800,
    };
    try {
      var response;
      if (type) {
        response = await ImagePicker.launchImageLibrary(options);
      } else {
        response = await ImagePicker.launchCamera(options);
      }
      console.log('resp', response);
      // setFile(response);
      if (section === 'after') {
        setpreviewImageUri(response.assets[0].uri);
        setimagePreview(true);
        onToggleMoreAf(80);
      } else {
        setpreviewImageUribefore(response.assets[0].uri);
        setimagePreviewbefore(true);
        onToggleMoreBe(80);
      }
    } catch (error) {
      console.log(error);
    }
    setModalVisible(!modalVisible);
  };

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

  const onToggleMore = height => {
    Animated.timing(heightAnim, {
      toValue: height,
      duration: 500,
      useNativeDriver: false,
    }).start();
    setmore(!more);
  };

  const onToggleMoreAf = height => {
    Animated.timing(heightMeterAfAnim, {
      toValue: height,
      duration: 500,
      useNativeDriver: false,
    }).start();
    setmoreMeterAf(!moreMeterAf);
  };

  const onToggleMoreBe = height => {
    Animated.timing(heightMeterBeAnim, {
      toValue: height,
      duration: 500,
      useNativeDriver: false,
    }).start();
    setmoreMeterBe(!moreMeterBe);
  };

  useEffect(() => {
    setshowInput(true);
  }, []);

  const [more, setmore] = useState(false);
  return (
    <Animated.View
      style={{flexDirection: 'row', flex: 1, backgroundColor: 'white'}}>
      <SideBar all={true} navigation={navigation} />
      <View style={{flex: 1, padding: 20}}>
        <ScrollView style={{width: '55%'}}>
          <View>
            <Text
              style={{
                fontSize: width / 40,
                color: '#01315C',
                fontWeight: 600,
                marginBottom: 5,
              }}>
              Eddie Ang
            </Text>
            <Text
              style={{
                fontSize: width / 60,
                color: '#01315C',
                marginBottom: 10,
              }}>
              DO-12345678A
            </Text>
          </View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginBottom: 10,
            }}>
            <Text
              style={{fontSize: width / 60, color: '#01315C', marginRight: 40}}>
              BDP Global Project Logistics Pte Ltd
            </Text>
          </View>
          <Animated.View style={{height: 150, marginBottom: 10}}>
            <Text style={{fontSize: 18, color: '#01315C'}}>
              101 Jln Bahar, Civil Defence Academy Complex, Singapore 649734
            </Text>
            <Text style={{fontSize: 18, color: '#01315C', marginVertical: 10}}>
              BDP Global Project Logistics Pte LtdContact Person: Bill Gates
              (+6598765432)
            </Text>
          </Animated.View>
          <View
            style={{
              borderBottomWidth: 1,
              borderBottomColor: '#01315C',
              marginBottom: 20,
            }}></View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 10,
            }}>
            <View>
              <Text style={{fontSize: 25, color: '#01315C', marginRight: 40}}>
                {t('litres_of_diesel_sold')}
              </Text>
            </View>
            {/* <Icon
              onPress={() => onShow(0)}
              name="edit"
              color="#01315C"
              size={20}
            /> */}
          </View>
          <Text
            style={{
              fontSize: width / 45,
              color: '#01315C',
              fontWeight: 600,
              marginBottom: 20,
            }}>
            8000
          </Text>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 10,
            }}>
            <Text
              style={{fontSize: width / 45, color: '#01315C', marginRight: 40}}>
              {t('signature')}
            </Text>
            <Icon name="edit" color="#01315C" size={20} />
          </View>
          <Text
            style={{
              fontSize: width / 60,
              color: '#3DB792',
              marginBottom: 20,
            }}>
            Uploaded
          </Text>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginBottom: 20,
            }}>
            <View>
              <Text style={{fontSize: 20, color: '#01315C', marginRight: 40}}>
                {t('metre_reading_after')}
              </Text>
            </View>

            <Icon
              onPress={() => {
                setuploadtype('after');
                setModalVisible(true);
              }}
              name="edit"
              color="#01315C"
              size={20}
            />
            {/* {moreMeterAf ? (
              <Icon
                onPress={() => onToggleMoreAf(0)}
                name="chevron-up"
                color="#01315C"
                size={20}
              />
            ) : (
              <Icon
                onPress={() => onToggleMoreAf(80)}
                name="chevron-down"
                color="#01315C"
                size={20}
              />
            )} */}
          </View>
          <Animated.View
            style={{
              height: heightMeterAfAnim,
              flexDirection: 'row',
              justifyContent: 'flex-start',
              alignItems: 'flex-start',
            }}>
            {previewImageUri.length == 0 ? null : (
              <Image
                style={{height: '100%', flex: 1}}
                source={{uri: previewImageUri}}
                resizeMode="contain"
              />
            )}
          </Animated.View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginBottom: 20,
            }}>
            <View>
              <Text style={{fontSize: 20, color: '#01315C', marginRight: 40}}>
                {t('metre_reading_before')}
              </Text>
            </View>
            <Icon
              onPress={() => {
                setuploadtype('before');
                setModalVisible(true);
              }}
              name="edit"
              color="#01315C"
              size={20}
            />
          </View>
          <Animated.View
            style={{
              height: heightMeterBeAnim,
              flexDirection: 'row',
              justifyContent: 'flex-start',
              alignItems: 'flex-start',
            }}>
            {previewImageUribefore.length == 0 ? null : (
              <Image
                style={{height: '100%', flex: 1}}
                source={{uri: previewImageUribefore}}
                resizeMode="contain"
              />
            )}
          </Animated.View>
          <Text
            style={{
              fontSize: 20,
              color: '#01315C',
              marginRight: 40,
              backgroundColor: '#EEF7FF',
            }}>
            {t('remarks')}
          </Text>
          <KeyboardAvoidingView
            style={{marginBottom: 50}}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
            <TextInput style={[remarks]} multiline={true} numberOfLines={4} />
          </KeyboardAvoidingView>
        </ScrollView>
      </View>

      {/* <View style={{flex: 1, padding: 20}}>
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
                <TouchableOpacity onPress={() => {
                  //setshowInput(true)
                  navigation.navigate('EditTrip');
                  }}>
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
              
            </ScrollView>
          </Table>
        </View> */}
      <RightInputBar
        header="Liters of Diesel Sold"
        subHeader="Enter quantity of diesel sold"
        show={showInput}
        defaultValue={true}
        keepinView={true}
        hide={() => setshowInput(false)}
        onSubmit={() => {
          // setSelected(null);
          setshowInput(false);
          // setshowConfirm(true);
        }}
      />
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          Alert.alert('Modal has been closed.');
          setModalVisible(!modalVisible);
        }}>
        <View style={styles.centeredView}>
          <View style={[styles.modalView]}>
            <View style={{flexDirection: 'row'}}>
              <View
                style={{
                  width: '80%',
                  height: 50,
                  backgroundColor: '#d3d3d370',
                }}>
                <Text
                  style={[
                    {
                      fontSize: 22,
                      color: '#000',
                      fontWeight: '600',
                      paddingLeft: 10,
                      paddingVertical: 8,
                    },
                  ]}>
                  {t('Metre Reading After')}
                </Text>
              </View>
              <View
                style={{
                  width: '20%',
                  height: 50,
                  backgroundColor: '#d3d3d370',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <TouchableOpacity
                  onPress={() => setModalVisible(!modalVisible)}
                  style={{
                    width: 50,
                    height: 50,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <Text
                    style={[
                      {
                        fontSize: 22,
                        color: '#000',
                        paddingLeft: 20,
                        fontWeight: '600',
                      },
                    ]}>
                    <Icon name="close" color="#000" size={20} />
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
            <View
              style={{flexDirection: 'row', paddingTop: 20, paddingLeft: 20}}>
              <TouchableOpacity
                style={{
                  width: 80,
                  height: 80,
                  borderWidth: 2,
                  borderColor: 'navy',
                  marginRight: 50,
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
                onPress={() => {
                  openGallery(true, uploadtype);
                }}>
                <Icon name="image" color="navy" size={20} />
                <Text style={{color: 'navy'}}>Gallery</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  width: 80,
                  height: 80,
                  borderWidth: 2,
                  borderColor: 'navy',
                  marginRight: 10,
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
                onPress={() => {
                  openGallery(false, uploadtype);
                }}>
                <Icon name="camera" color="navy" size={20} />
                <Text style={{color: 'navy'}}>Camera</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    width: 400,
    height: 200,
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 0,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: '#F194FF',
  },
  buttonClose: {
    backgroundColor: '#2196F3',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
  },
  modalText: {
    marginBottom: 15,
    color: '#000',
  },
});
