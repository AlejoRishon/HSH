import {
  StyleSheet,
  Text,
  View,
  Animated,
  Dimensions,
  FlatList,
  Image,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  SectionList,
  Alert
} from 'react-native';
import React, { useEffect, useRef, useState, createRef } from 'react';
import {
  text,
  remarks,
} from './styles/MainStyle';
import Icon from 'react-native-vector-icons/FontAwesome';
import * as ImagePicker from 'react-native-image-picker';
import { useTranslation } from 'react-i18next';
import SideBar from './ui/SideBar';
import { AdhocRightInputBar } from './ui/RightInputBar';
import { Portal, Provider, Modal, Button } from 'react-native-paper';
import { horizontalScale, moderateScale } from './styles/Metrics';
import { ActivityIndicator, MD2Colors } from 'react-native-paper';
import SignatureCapture from 'react-native-signature-capture';

const { width } = Dimensions.get('window');
export default function AdHocService({ navigation, route }) {
  const { t } = useTranslation();
  const [showInput, setshowInput] = useState(!true);
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
  const [businessName, setBusinessName] = useState([])
  const [businessAddress, setBusinessAddress] = useState([])
  const [productList, setProductList] = useState([])
  const [visible, setVisible] = useState(false);
  const [product, setProduct] = useState('')
  const [category, setCategory] = useState('')
  const [name, setName] = useState('')
  const [address, setAddress] = useState('')
  const [nameVisible, setNameVisible] = useState(false);
  const [addressVisible, setAddressVisible] = useState(false);
  const [businessId, setBusinessId] = useState('')
  const [businessCode, setBusinessCode] = useState('')
  const [sku, setSku] = useState('')
  const [loading, setLoading] = useState(true)
  const [signatureVisible, setSignatureVisible] = useState(false)
  const [show, setShow] = useState(false)

  const showNameModal = () => setNameVisible(true);
  const hideNameModal = () => setNameVisible(false)

  const showAddressModal = () => setAddressVisible(true);
  const hideAddressModal = () => setAddressVisible(false)

  const showSignatureModal = () => setSignatureVisible(true)
  const hideSignatureModal = () => setSignatureVisible(false)

  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false)

  const [diesel, setdiesel] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [showCategory, setShowCategory] = useState(false)

  const getBusinessName = async () => {
    try {
      const response = await fetch('https://demo.vellas.net:94/pump/api/Values/getBusinessList?_token=B6D1941E-D2C9-40F5-AF75-1B0558F527C1');
      const json = await response.json();
      setBusinessName(json);
      setLoading(false)
    } catch (error) {
      console.error(error);
    }
  }

  const getBusinessAddress = async () => {
    try {
      const response = await fetch(`https://demo.vellas.net:94/pump/api/Values/getBusinessAddressByBusinessId?_token=BDB47BFE-A891-4D77-AFBB-27928083D777&custId=${businessId}`);
      const json = await response.json();
      setBusinessAddress(json);
      setLoading(false)
    } catch (error) {
      console.error(error);
    }
  }

  const getProductList = () => {
    fetch('https://demo.vellas.net:94/pump/api/Values/getProductList?_token=FAEB7E31-0DE5-48BE-9EC9-8D97D21EF8B3')
      .then(response => response.json())
      .then(result => {
        console.log(result);
        setProductList(result)
      })
      .catch(error => console.error(error))
  }

  useEffect(() => { getBusinessName(); getBusinessAddress(); getProductList() }, [businessId])

  const postJoborder = () => {
    const url = "https://demo.vellas.net:94/pump/api/Values/postJobOrder";
    const data = {
      CUST_CODE: businessCode,
      Location: address,
      REC_DATE: "2023-05-25 00:00:00.000",
      VEHICLE_CODE: route?.params?.info?.vehicleInfo,
      DRIVER_ID: route?.params?.info?.driverId,
      DELIVERED: 1,
      SKU: sku,
      Qty: diesel,
      UOM_CODE: "Liter"
    };
    console.log(data);
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
        if (result == 'Saved' || result === 'Updated') {
          Alert.alert('Success', 'Job Successful', [
            { text: 'OK', onPress: () => navigation.pop() },
          ]);
        } else {
          alert("Job Failed");
        }
      })
      .catch(error => {
        console.log("Error:", error);
      });
  }

  const getInputDiesel = diesel => {
    return setdiesel(diesel);
  };

  const handleCategoryPress = (category) => {
    setSelectedCategory(category);
  }

  const renderProductList = () => {
    if (!selectedCategory) return null;

    const categoryItem = productList?.find(item => item.category === selectedCategory)

    if (!categoryItem) return null;

    return (
      <FlatList
        data={categoryItem.product}
        renderItem={({ item }) => (
          <TouchableOpacity style={{ justifyContent: 'center', borderBottomWidth: 1, borderColor: '#0465bd', padding: 6 }}
            onPress={() => {setProduct(item.desc), hideModal()}}
          >
            <Text style={[text, { fontSize: moderateScale(12), alignSelf: 'center', color: '#0465bd' }]}>{item.desc}</Text>
          </TouchableOpacity>
        )}
        keyExtractor={(item, index) => index.toString()}
      />
    );
  }

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

  const ItemView = ({ item }) => {
    return (
      <TouchableOpacity
        style={{ justifyContent: 'center', borderBottomWidth: 1, borderColor: '#0465bd' }}
        onPress={() => { setProduct(item.desc); setSku(item.SKU); hideModal() }}
      >
        <Text style={[text, { fontSize: moderateScale(14), color: '#0465bd', alignSelf: 'center' }]}>
          {item.desc + (item.category ? ' (' + item.category + ')' : '')}
        </Text>
      </TouchableOpacity>
    );
  };

  const NameView = ({ item }) => {
    return (
      <TouchableOpacity style={{ justifyContent: 'center', borderBottomWidth: 1, borderColor: '#0465bd', padding: 6 }}
        onPress={() => { setName(item.name), hideNameModal(), setBusinessId(item.id), setBusinessCode(item.code), setLoading(true) }}
      >
        <Text style={[text, { fontSize: moderateScale(12), alignSelf: 'center', color: '#0465bd' }]}>{item.name}</Text>
      </TouchableOpacity>
    );
  }

  const AddressView = ({ item }) => {
    return (
      <TouchableOpacity style={{ justifyContent: 'center', borderBottomWidth: 1, borderColor: '#0465bd', padding: 6 }}
        onPress={() => { setAddress(item.ADDRESS), hideAddressModal() }}
      >
        {item.ADDRESS ?
          <Text style={[text, { fontSize: moderateScale(12), alignSelf: 'center', color: '#0465bd' }]}>{item.ADDRESS}</Text>
          :
          <Text style={[text, { fontSize: moderateScale(12), alignSelf: 'center', color: '#0465bd' }]}>No Address Available</Text>
        }
      </TouchableOpacity>
    )
  }

  const renderItem = ({ item }) => {
    return (
      <TouchableOpacity style={{ justifyContent: 'center', borderBottomWidth: 1, borderColor: '#0465bd', padding: 6 }}
        onPress={() => { handleCategoryPress(item.category), setShowCategory(true) }}
      >
        <Text style={[text, { fontSize: moderateScale(12), alignSelf: 'center', color: '#0465bd' }]} >{item.category}</Text>
      </TouchableOpacity >
    )
  }

  const sign = createRef()
  const saveSign = () => sign.current.saveImage()
  const resetSign = () => sign.current.resetImage()

  const _onSaveEvent = (result) => {
    Alert.alert('Signature Captured Successfully!')
    console.log(result.encoded)
    setSignatureVisible(false)
  }

  const _onDragEvent = () => console.log('dragged')

  if (signatureVisible) {
    return (
      <View style={{ flex: 1, backgroundColor: 'white' }}>
        <Text style={{ fontSize: 20, color: '#01315C', fontWeight: 'bold', margin: '5%', textDecorationLine: 'underline' }}>
          Sign here..
        </Text>
        <SignatureCapture
          style={{ flex: 1 }}
          ref={sign}
          onSaveEvent={_onSaveEvent}
          onDragEvent={_onDragEvent}
          showNativeButtons={false}
          showTitleLabel={false}
          viewMode={'landscape'}
        />
        <View style={{ flexDirection: 'row', justifyContent: 'space-around', bottom: 10 }}>
          <Button mode="contained" onPress={() => saveSign()} buttonColor='#01315C' textColor='white'>
            Save
          </Button>
          <Button mode="contained" onPress={() => resetSign()} buttonColor='#01315C' textColor='white'>
            Reset
          </Button>
        </View>
      </View>
    )
  }

  return (
    <Provider>
      <Portal>
        <Modal visible={loading}>
          <ActivityIndicator animating={true} color={MD2Colors.red800} size='large' />
        </Modal>
        <Modal visible={visible} onDismiss={hideModal} contentContainerStyle={styles.dragDown}>
          {!showCategory ?
            <>
              <Text
                style={{ fontSize: moderateScale(15), color: '#01315C', marginRight: 40, justifyContent: 'center' }}>
                {!category ? `Category` : category} <Icon name='angle-down' size={18} style={{ alignSelf: 'center' }} />
              </Text>
              <FlatList
                data={productList}
                renderItem={renderItem}
                keyExtractor={(item, index) => `${item}_${index}`}
              />
            </> :
            renderProductList()}
        </Modal>
        <Modal visible={nameVisible} onDismiss={hideNameModal} contentContainerStyle={styles.dragDown}>
          <FlatList
            data={businessName}
            keyExtractor={item => item.code}
            renderItem={NameView}
            showsVerticalScrollIndicator={true}
          />
        </Modal>

        <Modal visible={addressVisible} onDismiss={hideAddressModal} contentContainerStyle={[styles.dragDown, { width: horizontalScale(180), marginRight: '14%' }]}>
          <FlatList
            data={businessAddress}
            keyExtractor={item => item.UID}
            renderItem={AddressView}
            showsVerticalScrollIndicator={true}
          />
        </Modal>
      </Portal>
      <Animated.View
        style={{ flexDirection: 'row', flex: 1, backgroundColor: 'white' }}>
        <SideBar all={true} navigation={navigation} />
        <View style={{ flex: 1, padding: 20 }}>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('Main');
            }}>
            <Icon
              name="chevron-left"
              color="#01315C"
              size={30}
              style={{ marginBottom: 10 }}
            />
          </TouchableOpacity>
          <ScrollView style={{ width: '55%' }}>
            <View style={{ height: 150, marginBottom: 10 }}>
              <Text style={{ fontSize: 18, color: '#01315C', marginVertical: 10 }}>
                Business Name
              </Text>
              <TouchableOpacity onPress={showNameModal}>
                <Text
                  style={{ fontSize: moderateScale(12), color: '#01315C', marginRight: 40, justifyContent: 'center' }}>
                  {!name ? `Select Business Name` : name} <Icon name='angle-down' size={18} style={{ alignSelf: 'center' }} />
                </Text>
              </TouchableOpacity>
              <Text style={{ fontSize: 18, color: '#01315C', marginVertical: 10 }}>
                Business Address
              </Text>
              <TouchableOpacity onPress={showAddressModal}>
                <Text
                  style={{ fontSize: moderateScale(12), color: '#01315C', marginRight: 40, justifyContent: 'center' }}>
                  {!address ? `Select Business Address` : address} <Icon name='angle-down' size={18} style={{ alignSelf: 'center' }} />
                </Text>
              </TouchableOpacity>

            </View>
            <View
              style={{
                borderBottomWidth: 1,
                borderBottomColor: '#01315C',
                marginBottom: 20,
                marginTop: !address ? 0 : address?.length - 15
              }} />
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginBottom: 10,
              }}>
              <TouchableOpacity onPress={showModal}>
                <Text
                  style={{ fontSize: moderateScale(15), color: '#01315C', marginRight: 40, justifyContent: 'center' }}>
                  {!product ? `Products` : product} <Icon name='angle-down' size={18} style={{ alignSelf: 'center' }} />
                </Text>
              </TouchableOpacity>
            </View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 10,
              }}>
              <View>
                <Text style={{ fontSize: 25, color: '#01315C', marginRight: 40 }}>
                  {t('litres_of_diesel_sold')}
                </Text>
              </View>
            </View>
            <Text
              style={{
                fontSize: width / 45,
                color: '#01315C',
                fontWeight: 600,
                marginBottom: 20,
              }}>
              {diesel}
            </Text>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 10,
              }}>
              <Text
                style={{ fontSize: width / 45, color: '#01315C', marginRight: 40 }}>
                {t('signature')}
              </Text>
              <Icon name="edit" color="#01315C" size={20} onPress={showSignatureModal} />
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
                <Text style={{ fontSize: 20, color: '#01315C', marginRight: 40 }}>
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
            </View>
            <Animated.View
              style={{
                height: heightMeterAfAnim,
                flexDirection: 'row',
                justifyContent: 'flex-start',
                alignItems: 'flex-start',
                marginBottom: 20,
              }}>
              {previewImageUri.length == 0 ? null : (
                <Image
                  style={{ height: '100%', flex: 1 }}
                  source={{ uri: previewImageUri }}
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
                <Text style={{ fontSize: 20, color: '#01315C', marginRight: 40 }}>
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
                  style={{ height: '100%', flex: 1 }}
                  source={{ uri: previewImageUribefore }}
                  resizeMode="contain"
                />
              )}
            </Animated.View>
            <Text
              style={{
                fontSize: 20,
                color: '#01315C',
                marginRight: 40,
              }}>
              {t('remarks')}
            </Text>
            <KeyboardAvoidingView
              style={{ marginBottom: 50 }}
              behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
              <TextInput style={[remarks]} multiline={true} numberOfLines={4} />
            </KeyboardAvoidingView>
            <TouchableOpacity
              style={{ backgroundColor: '#01315C', flex: 1, borderRadius: 8, width: '50%', alignSelf: 'flex-end' }}
              onPress={() => postJoborder()}
            >
              <Text
                style={{
                  color: 'white',
                  textAlign: 'center',
                  fontSize: 20,
                  padding: 10,
                }}>
                Submit
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
        <AdhocRightInputBar
          header="Liters of Diesel Sold"
          subHeader="Enter quantity of diesel sold"
          show={showInput}
          getInputDiesel={getInputDiesel}
          keepinView={true}
          hide={() => setshowInput(false)}
          onSubmit={val => {
            setshowInput(false);
            getInputDiesel(val);
            //setSelected(null);
            //setshowConfirm(true);
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
              <View style={{ flexDirection: 'row' }}>
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
                style={{ flexDirection: 'row', paddingTop: 20, paddingLeft: 20 }}>
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
                  <Text style={{ color: 'navy' }}>Gallery</Text>
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
                  <Text style={{ color: 'navy' }}>Camera</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </Animated.View>
    </Provider >
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
  dragDown: {
    backgroundColor: 'white',
    right: horizontalScale(25),
    margin: '5%',
    width: horizontalScale(100),
    alignSelf: 'center',
    borderRadius: 5,
    padding: 5
  }
});
