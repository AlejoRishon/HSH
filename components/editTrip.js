import {
  StyleSheet,
  Text,
  View,
  Animated,
  Dimensions,
  Image,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Alert,
  ActivityIndicator
} from 'react-native';
import React, { useEffect, useRef, useState, createRef } from 'react';
import {
  remarks,
} from './styles/MainStyle';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Portal, Provider, Modal, Button, MD2Colors } from 'react-native-paper';
import * as ImagePicker from 'react-native-image-picker';
import { useTranslation } from 'react-i18next';
import SideBar from './ui/SideBar';
import RightInputBar from './ui/RightInputBar';
import { getVehicle, getDomain, getlogUser } from './functions/helper';
import RNPrint from 'react-native-print';
import SignatureCapture from 'react-native-signature-capture';

const { width } = Dimensions.get('window');
export default function DeliveryOrder({ navigation, route }) {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false)
  const editable = route?.params?.invData.JOB_STATUS_DESC !== 'Pending' && route?.params?.invData.JOB_STATUS_DESC !== 'Delivered' ? false : true;
  const [showInput, setshowInput] = useState(!true);
  const heightMeterAfAnim = useRef(new Animated.Value(0)).current;
  const heightMeterBeAnim = useRef(new Animated.Value(0)).current;
  const [uploadtype, setuploadtype] = useState('after');
  const [moreMeterAf, setmoreMeterAf] = useState(false);
  const [moreMeterBe, setmoreMeterBe] = useState(false);
  const [remark, setRemark] = useState('')
  const domain = getDomain();

  const [modalVisible, setModalVisible] = useState(false);
  //after
  const [previewImageUri, setpreviewImageUri] = useState('');
  const [imagePreview, setimagePreview] = useState(false);
  //before
  const [previewImageUribefore, setpreviewImageUribefore] = useState('');
  const [imagePreviewbefore, setimagePreviewbefore] = useState(false);
  const [dieselValue, setDieselValue] = useState(0)
  const [signatureVisible, setSignatureVisible] = useState(false);
  const [signature, setsignature] = useState(null);
  const showSignatureModal = () => setSignatureVisible(true);
  const sign = createRef();
  const saveSign = () => sign.current.saveImage();
  const resetSign = () => sign.current.resetImage();
  console.log(route.params.invData)
  const _onSaveEvent = (result) => {
    Alert.alert('Signature Captured Successfully!')
    // console.log(result.encoded);
    // console.log(result.pathName);
    setsignature("data:image/png;base64," + result.encoded)
    setSignatureVisible(false);
  }

  // const _onDragEvent = () => console.log('dragged')






  const printHTML = async () => {
    await RNPrint.print({
      html: `<html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Display Form</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            height: 420px;
          }
          .container {
            width: 100%;
            margin: 0 auto;
          }
          fieldset {
            border: 1px solid #ccc;
            border-radius: 4px;
            padding: 10px;
            margin-bottom: 20px;
          }
          legend {
            font-weight: bold;
          }
          .form-field {
            margin-bottom: 10px;
          }
          table {
            font-family: arial, sans-serif;
            border-collapse: collapse;
            width: 100%;
          }
    
          td,
          th {
            border: 1px solid #dddddd;
            text-align: left;
            padding: 8px;
            font-size:10px;
          }
          p{
            font-size:12px;
          }
        </style>
      </head>
      <body class="container">
        <div
          style="display: flex; flex-direction: column; align-items: space-between">
          <div>
            <div
              style="
                display: flex;
                flex-direction: row;
                justify-content: space-between;
                align-items: center;
              ">
              <div style="margin-right: 20px">
                <div>
                  <img
                    src="data:image/png;base64,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"
                    style="width: 130px" />
                </div>
                <div>
                  <p style="margin-bottom: 0px; margin-top: 10px">
                    <strong
                      >Hock Seng Heng Transport &amp; Trading Pte Ltd.</strong
                    >
                  </p>
    
                  <p style="margin-top: 0px; margin-bottom: 0px">
                    <strong>9 Jalan Besut Singapore 619563</strong>
                  </p>
    
                  <p style="margin-top: 0px">
                    <strong>Tel: 6261-6101 Fax: 6261-1037</strong>
                  </p>
                </div>
              </div>
              <p>Delivery Order</p>
            </div>
    
            <div
              style="
                display: flex;
                flex-direction: row;
                justify-content: space-between;
                align-items: center;
              ">
              <div style="margin-right: 20px">
                <p style="margin-top: 0px; margin-bottom: 0px">
                  <strong>To: ${route?.params?.invData.NAME}</strong>
                </p>
                <p style="margin-top: 0px; margin-bottom: 0px">Site: ${route?.params?.invData.ADDRESS2}</p>
                <p style="margin-top: 0px">Sales Rep: ${route?.params?.invData.SALES_PERSON_NAME}</p>
              </div>
    
              <div>
              <p style="margin-top: 0px; margin-bottom: 0px"><strong>Do no: ${route?.params?.invData.INV_NO}</strong></p>
                <p style="margin-top: 0px; margin-bottom: 0px">
                  <strong>Date: ${new Date().toLocaleDateString()}</strong>
                </p>
    
                <p style="margin-top: 0px"><strong>Terms: COD</strong></p>
              </div>
            </div>
            <table>
              <tbody>
                <tr>
                  <th>ITEM</th>
                  <th width="400px">DESCRIPTION</th>
                  <th>QTY</th>
                  <th width="50px">UNIT(SGD)</th>
                  <th width="20px">AMOUNT(SGD)</th>
                </tr>
                <tr>
                  <td>1</td>
                  <td>${route?.params?.invData.DISPLAY_NAME}</td>
                  <td>${dieselValue}</td>
                  <td></td>
                  <td></td>
                </tr>
                <tr>
                  <td colspan="3" rowspan="4">
                    <div
                      style="
                        display: flex;
                        flex-direction: column;
                        align-items: space-between;
                      ">
                      <p>Remarks:</p>
                      <p style="font-size: 12px">
                        We receive the above goods order and condition
                      </p>
                    </div>
                  </td>
                  <td>ZERO-RATED</td>
                  <td></td>
                </tr>
                <tr>
                  <td>TAXABLE</td>
                  <td></td>
                </tr>
                <tr>
                  <td>8% GST</td>
                  <td></td>
                </tr>
                <tr>
                  <td>TOTAL</td>
                  <td></td>
                </tr>
              </tbody>
            </table>
          </div>
          <div
            style="
              display: flex;
              flex-direction: row;
              justify-content: space-between;
              align-items: center;
              margin-top: 50px;
            ">
            <p style="border-top: 2px solid black">
              Authorised Name, Signature &amp; Company Stamp
            </p>
            <p >
              Driver Vehicle:${route?.params?.invData.PLATE_NO}
            </p>
          </div>
        </div>
      </body>
    </html>
    `
    })
  }

  const PostJobOrderDelivered = () => {
    setLoading(true);
    const userLog = getlogUser();
    const url = domain + "/PostJObOrderDelivered"
    const data = {
      "JobNumber": route?.params?.invData.INV_NO,
      "ProdId": 0,
      "PumpPrevious": 0,
      "PumpNow": 0,
      "Remark": remark,
      "QTY": dieselValue,
      "UpdatedBy": userLog,
      SIGNATURE64: signature,
      METER_BEFORE64: previewImageUribefore,
      METER_AFTER64: previewImageUri
    }
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
        setLoading(false);
        console.log(result);
        Alert.alert('Success', 'Job Successful', [
          {
            text: 'Print',
            onPress: () => printHTML(),
          },
          { text: 'OK', onPress: () => navigation.replace('DeliveryOrder') },
        ]);
        setshowInput(false);
      })
      .catch(error => {
        setLoading(false);
        console.log("Error:", error);
        Alert.alert("Job Failed");
      })
  }

  const openGallery = async (type, section) => {
    const options = {
      mediaType: 'image',
      includeBase64: true,
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
      // console.log('resp', response);

      if (section === 'after') {
        setpreviewImageUri("data:" + response.assets[0].type + ";base64," + response.assets[0].base64);
        setimagePreview(true);
        onToggleMoreAf(80);
      } else {
        setpreviewImageUribefore("data:" + response.assets[0].type + ";base64," + response.assets[0].base64);
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

  const handleGetInputDiesel = (value) => setDieselValue(value)

  useEffect(() => {
    setDieselValue(route?.params?.invData.qty_order)
    editable ?
      setshowInput(true) : setshowInput(false);
  }, []);
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
      </Portal>
      <Animated.View
        style={{ flexDirection: 'row', flex: 1, backgroundColor: 'white' }}>
        <SideBar all={true} navigation={navigation} />
        <View style={{ flex: 1, padding: 20 }}>
          <View style={{ justifyContent: 'space-between', flexDirection: 'row', width: editable ? '55%' : '100%' }}>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('DeliveryOrder');
              }}>
              <Icon
                name="chevron-left"
                color="#01315C"
                size={30}
                style={{ marginBottom: 10 }}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                printHTML()
              }}>
              <Icon
                name="print"
                color="#01315C"
                size={30}
                style={{ marginBottom: 10 }}
              />
            </TouchableOpacity>
          </View>
          <ScrollView style={{ width: editable ? '55%' : '100%' }}>
            <View>
              {/* <Text
                style={{
                  fontSize: width / 40,
                  color: '#01315C',
                  fontWeight: 600,
                  marginBottom: 5,
                }}>
                {route?.params?.invData.DRIVER_NAME}
              </Text> */}
              <Text
                style={{
                  fontSize: width / 40,
                  color: '#01315C',
                  marginBottom: 10,
                }}>
                {route?.params?.invData.INV_NO}
              </Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginBottom: 10,
              }}>
              <Text
                style={{ fontSize: width / 40, color: '#01315C', marginRight: 40 }}>
                {route?.params?.invData.NAME}
              </Text>
            </View>
            <Animated.View style={{ marginBottom: 10 }}>
              {route?.params?.invData.PRINT_ADDRESS && <Text style={{ fontSize: width / 40, color: '#01315C' }}>
                {route?.params?.invData.PRINT_ADDRESS}
              </Text>
              }
              {route?.params?.invData.ADDRESS2 &&
                <Text style={{ fontSize: width / 40, color: '#01315C', marginBottom: 10 }}>
                  {route?.params?.invData.ADDRESS2}
                </Text>
              }
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
                <Text style={{ fontSize: 25, color: '#01315C', marginRight: 40 }}>
                  {t('Product')}
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
              {route?.params?.invData.DISPLAY_NAME}
            </Text>
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
              {dieselValue}
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
              {/* <Icon disabled={!editable} name="edit" color="#01315C" size={20} onPress={showSignatureModal} /> */}
              <TouchableOpacity disabled={!editable} onPress={showSignatureModal} style={{ backgroundColor: '#01315C', padding: 5, borderRadius: 5 }}>
                <Text style={{ color: 'white', width: 50, textAlign: 'center' }}>Sign</Text>
              </TouchableOpacity>
            </View>
            {/* <Text
            style={{
              fontSize: width / 40,
              color: '#3DB792',
              marginBottom: 20,
            }}>
            Uploaded
          </Text> */}
            {signature == null ? null : (
              <Image
                style={{ height: 80, flex: 1, borderWidth: 1, borderColor: 'black', marginBottom: 10 }}
                source={{ uri: signature }}
                resizeMode="contain"
              />
            )}
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginTop: 10,
              }}>
              <View>
                <Text style={{ fontSize: 20, color: '#01315C', marginRight: 40 }}>
                  {t('metre_reading_after')}
                </Text>
              </View>

              {/* <Icon disabled={!editable}
                onPress={() => {
                  setuploadtype('after');
                  setModalVisible(true);
                }}
                name="edit"
                color="#01315C"
                size={20}
              /> */}
              <TouchableOpacity disabled={!editable} onPress={() => {
                setuploadtype('after');
                setModalVisible(true);
              }} style={{ backgroundColor: '#01315C', padding: 5, borderRadius: 5 }}>
                <Text style={{ color: 'white', width: 50, textAlign: 'center' }}>Upload</Text>
              </TouchableOpacity>
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
                marginTop: 10,
                marginBottom: 20
              }}>
              <View>
                <Text style={{ fontSize: 20, color: '#01315C', marginRight: 40 }}>
                  {t('metre_reading_before')}
                </Text>
              </View>
              {/* <Icon disabled={!editable}
                onPress={() => {
                  setuploadtype('before');
                  setModalVisible(true);
                }}
                name="edit"
                color="#01315C"
                size={20}
              /> */}
              <TouchableOpacity disabled={!editable} onPress={() => {
                setuploadtype('after');
                setModalVisible(true);
              }} style={{ backgroundColor: '#01315C', padding: 5, borderRadius: 5 }}>
                <Text style={{ color: 'white', width: 50, textAlign: 'center' }}>Upload</Text>
              </TouchableOpacity>
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
              <TextInput editable={editable} style={[remarks]} multiline={true} numberOfLines={4} value={remark} onChangeText={text => setRemark(text)} />
            </KeyboardAvoidingView>
          </ScrollView>
        </View>
        <RightInputBar
          header="Liters of Diesel Sold"
          subHeader="Enter quantity of diesel sold"
          show={showInput}
          defaultValue={false}
          keepinView={true}
          getInputDiesel={handleGetInputDiesel}
          hide={() => setshowInput(false)}
          initialValue={dieselValue}
          onSubmit={() => {
            PostJobOrderDelivered()
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
    </Provider>
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
