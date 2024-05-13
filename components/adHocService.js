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
import { check, PERMISSIONS, request, requestMultiple, RESULTS } from 'react-native-permissions';
import {
  text,
  remarks,
  button,
  buttonText
} from './styles/MainStyle';
import AwesomeAlert from 'react-native-awesome-alerts';
import Icon from 'react-native-vector-icons/FontAwesome';
import * as ImagePicker from 'react-native-image-picker';
import { useTranslation } from 'react-i18next';
import SideBar from './ui/SideBar';
import { AdhocRightInputBar } from './ui/RightInputBar';
import { Portal, Provider, Modal, Button } from 'react-native-paper';
import { horizontalScale, moderateScale } from './styles/Metrics';
import { ActivityIndicator, MD2Colors } from 'react-native-paper';
import SignatureCapture from 'react-native-signature-capture';
import { getVehicle, getDomain, getlogUser } from './functions/helper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  BLEPrinter,
  ColumnAlignment,
  COMMANDS,
} from 'react-native-thermal-receipt-printer-image-qr';
import DialogComp from './DialogComp'
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import RNPrint from 'react-native-print';
const RNFS = require('react-native-fs');
const { width } = Dimensions.get('window');
export default function AdHocService({ navigation, route }) {
  const { t } = useTranslation();
  const domain = getDomain();
  const [visiblePint, setvisiblePint] = useState(false);
  const [showInput, setshowInput] = useState(!true);
  const heightMeterAfAnim = useRef(new Animated.Value(0)).current;
  const heightMeterBeAnim = useRef(new Animated.Value(0)).current;
  const [uploadtype, setuploadtype] = useState('after');
  const [moreMeterAf, setmoreMeterAf] = useState(false);
  const [moreMeterBe, setmoreMeterBe] = useState(false);

  const [modalVisible, setModalVisible] = useState(false);
  const [signature, setsignature] = useState(null);
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
  const [product, setProduct] = useState('');
  const [remark, setremark] = useState(null);
  const [jobNumber, setjobNumber] = useState(null);
  const [unitcost, setunitcost] = useState(0);
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
  const [query, setQuery] = useState('');
  const [fullData, setFullData] = useState([]);
  const showNameModal = () => setNameVisible(true);
  const hideNameModal = () => setNameVisible(false)
  const [signatureURL, setsignatureURL] = useState("");
  const [latestJob, setlatestJob] = useState({});
  const showAddressModal = () => setAddressVisible(true);
  const hideAddressModal = () => setAddressVisible(false)

  const showSignatureModal = () => setSignatureVisible(true)
  const hideSignatureModal = () => setSignatureVisible(false)

  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false)

  const [diesel, setdiesel] = useState(0);
  const [INV_NO, setINV_NO] = useState(null);

  const [selectedCategory, setSelectedCategory] = useState(null)
  const [showCategory, setShowCategory] = useState(false)
  const [printModal, setprintModal] = useState([]);
  const [printers, setPrinters] = useState([]);

  const getBusinessName = async () => {
    try {
      const response = await fetch(domain + '/getBusinessList?_token=B6D1941E-D2C9-40F5-AF75-1B0558F527C1');
      const json = await response.json();
      // console.log('Business name', json);
      var filteredData = [];
      var uniqueNames = [];
      json.map(val => {
        if (uniqueNames.indexOf(val.name) == -1) {
          uniqueNames.push(val.name);
          filteredData.push(val)
        }
      })
      setBusinessName([...filteredData]);
      setFullData([...filteredData]);
      setLoading(false)
    } catch (error) {
      console.error(error);
    }
  }

  const getBusinessAddress = async () => {
    try {
      const response = await fetch(domain + `/getBusinessAddressByBusinessId?_token=BDB47BFE-A891-4D77-AFBB-27928083D777&custId=${businessId}`);
      const json = await response.json();
      console.log("address", json)
      setBusinessAddress(json);
      setLoading(false)
    } catch (error) {
      console.error(error);
    }
  }

  const getProductList = () => {
    fetch(domain + '/getProductList?_token=FAEB7E31-0DE5-48BE-9EC9-8D97D21EF8B3')
      .then(response => response.json())
      .then(result => {
        console.log(result);
        var fResult = result.filter(val => val.category !== '')
        setProductList(fResult)
      })
      .catch(error => console.error(error))
  }

  useEffect(() => { getBusinessName(); getBusinessAddress(); getProductList() }, [businessId])

  const postJoborder = async () => {
    const userlog = getlogUser();
    if (!businessCode) {
      Alert.alert("Select business");
      return;
    }
    if (!sku) {
      Alert.alert("Enter product");
      return;
    }
    if (!diesel) {
      Alert.alert("Enter amount of diesel");
      return;
    }
    if (!unitcost) {
      setunitcost(0);
    }

    setLoading(true);
    const url = domain + "/PostJobOrder";
    var vehicleData = getVehicle();
    console.log(url);
    var formdata = new FormData();
    formdata.append("CUST_CODE", businessCode);
    formdata.append("VL_UID", 0);
    formdata.append("Location", address);
    formdata.append("REC_DATE", new Date().toISOString());
    formdata.append("VEHICLE_CODE", vehicleData.vehicle.VEHICLE_INFO);
    formdata.append("DRIVER_ID", vehicleData.vehicle.driver_id);
    formdata.append("DELIVERED", 1);
    formdata.append("SKU", sku);
    formdata.append("Qty", diesel);
    formdata.append("UOM_CODE", "Liter");
    formdata.append("REMARKS", remark);
    formdata.append("UNIT_COST", parseFloat(unitcost));
    formdata.append("SIGNATURE64", signature);
    formdata.append("METER_BEFORE64", previewImageUri);
    formdata.append("METER_AFTER64", previewImageUribefore);
    console.log(formdata);
    fetch(url, {
      method: "POST",
      body: formdata
    })
      .then(response => response.json())
      .then(result => {
        setLoading(false);
        console.log(result);
        if (result) {
          setINV_NO(result);
          setvisiblePint(true)
          // Alert.alert('Success', 'Job Successful', [
          //   {
          //     text: 'Print',
          //     onPress: () => getSign(result),
          //   },
          //   { text: 'OK', onPress: () => navigation.replace('Main') },
          // ]);
        } else {
          alert("Job Failed");
        }
      })
      .catch(error => {
        setLoading(false);
        Alert.alert("Error:", error);
      });
    // }
    // else {
    //   Alert.alert('Kindly fill up first')
    // }
  }

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

  const getSign = async (jo) => {
    setLoading(true);
    console.log(INV_NO)
    var vehicleData = getVehicle();
    var sdate = formatDate(new Date());
    try {
      // alert(domain + `/getJobDetail?_token=404BF898-501C-469B-9FB0-C1C1CCDD7E29&PLATE_NO=${vehicleData.vehicle.VEHICLE_INFO}&date=${sdate}`)
      const response = await fetch(domain + `/getJobDetail?_token=404BF898-501C-469B-9FB0-C1C1CCDD7E29&PLATE_NO=${vehicleData.vehicle.VEHICLE_INFO}&date=${sdate}`);
      const json = await response.json();
      console.log(json, "jobs");
      if (json && json.length > 0) {
        var auid = json.filter(val => val.INV_NO === INV_NO);
        if (auid.length > 0) {
          console.log('get call', `${domain}/GetJobFiles?_Token=CDAC498B-116F-4346-AD72-C3F65A902FFD&_uid=${auid[0].UID}`)

          if (signature) {
            console.log("sign", "https://hsh.vellas.net:90/hshpump/signature/JOB_ORDER/" + auid[0].UID + "/Signature.png")
            setsignatureURL("https://hsh.vellas.net:90/hshpump/signature/JOB_ORDER/" + auid[0].UID + "/Signature.png");

          }
          printHTML(INV_NO);
          setlatestJob(auid[0])
        }
        else {
          setLoading(false);
          alert('No UID: ');

        }

      }
      else {
        setLoading(false);
        alert('No Jobs');

      }
      setLoading(false)
    } catch (error) {
      // console.error(error);
      alert('Sorry, error fetching full details', error);
      setLoading(false)
    }

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
            onPress={() => { setProduct(item.desc), hideModal(); setShowCategory(false); setSku(item.SKU) }}
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
      // setFile(response);
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

  useEffect(() => {
    console.log("again")
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

  const [onLogOut, setonLogOut] = useState(false)
  const LogOut = () => {
    AsyncStorage.removeItem('vehicleDetails')
    AsyncStorage.removeItem('JOBDATA')
    AsyncStorage.removeItem('pendingDelivery')
    AsyncStorage.removeItem('username')
    AsyncStorage.removeItem('domainurl')
    AsyncStorage.removeItem('password');
    navigation.replace('Login');
    setonLogOut(false);
  }
  const headerSearch = ({ item }) => {
    return (
      <View
        style={{
          backgroundColor: '#fff',
          padding: 10,

        }}
      >
        <TextInput
          autoCapitalize="none"
          autoCorrect={false}
          clearButtonMode="always"
          value={query}
          onChangeText={queryText => handleSearch(queryText)}
          placeholder="Search"
          placeholderTextColor='black'
          style={{ backgroundColor: 'rgba(0,0,0,0.1)', paddingHorizontal: 10, borderRadius: 5, color: 'black' }}
        />
      </View>
    );
  }

  const handleSearch = text => {
    console.log('search text', text)
    const formattedQuery = text.toLowerCase();
    const filteredData = fullData.filter(user => {
      return user.name.toLowerCase().includes(formattedQuery);
    });
    console.log('filtered', filteredData)

    setBusinessName(filteredData);
    setQuery(text);
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
        onPress={() => { handleCategoryPress(item.category); setShowCategory(true); console.log(item) }}
      >
        <Text style={[text, { fontSize: moderateScale(12), alignSelf: 'center', color: '#0465bd' }]} >{item.category}</Text>
      </TouchableOpacity >
    )
  }

  const sign = createRef()
  const saveSign = () => sign.current.saveImage()
  const resetSign = () => sign.current.resetImage()

  const dataURLtoFile = async (dataurl) => {
    console.log(dataurl)
    var filee = await RNFS.readFile(dataurl, 'base64');
    console.log(filee);
    return filee;
  }


  const _onSaveEvent = (result) => {
    Alert.alert('Signature Captured Successfully!')
    // console.log(result.encoded);
    // console.log(result.encoded);
    setsignature("data:image/png;base64," + result.encoded);
    // dataURLtoFile(result.pathName);

    setSignatureVisible(false)
  }

  const _onDragEvent = () => console.log('dragged')

  if (signatureVisible) {
    return (
      <View style={{ flex: 1, backgroundColor: 'white' }}>
        <Text style={{ fontSize: 20, color: '#01315C', fontWeight: 'bold', margin: 10, textDecorationLine: 'underline' }}>
          Sign here..
        </Text>
        <SignatureCapture
          style={{ flex: 1 }}
          ref={sign}
          onSaveEvent={_onSaveEvent}
          onDragEvent={_onDragEvent}
          showNativeButtons={false}
          saveImageFileInExtStorage={true}
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


  const printHTML = async (jo) => {
    setjobNumber(jo);
    try {
      check(PERMISSIONS.ANDROID.BLUETOOTH_CONNECT)
        .then((result) => {
          switch (result) {
            case RESULTS.UNAVAILABLE:
              requestPerm(jo);
              break;
            case RESULTS.DENIED:
              requestPerm(jo);
              break;
            case RESULTS.LIMITED:
              requestPerm(jo);
              break;
            case RESULTS.GRANTED:
              printBL(jo)
              break;
            case RESULTS.BLOCKED:
              alert('Bluetooth is denied and not requestable anymore');
              break;
          }

        })
        .catch((error) => {
          // …
        });


    } catch (err) {
      console.warn(err);
    }
  }

  const requestPerm = (jo) => {
    requestMultiple([PERMISSIONS.ANDROID.BLUETOOTH_CONNECT, PERMISSIONS.ANDROID.BLUETOOTH_SCAN, PERMISSIONS.ANDROID.BLUETOOTH, PERMISSIONS.ANDROID.BLUETOOTH_ADMIN]).then((result) => {
      console.log('requested')
      // alert(JSON.stringify(result));
      printBL(jo)
    }).catch(error => {
      alert('error', error)
    });
  }

  const printBL = async (jo) => {
    try {
      BLEPrinter.init().then(() => {
        BLEPrinter.getDeviceList().then((data) => {
          console.log(data);
          setPrinters([...data]);
          setprintModal(true)
        }).catch(e => {
          console.log(e);

        });
      }).catch(e => {
        Alert.alert("Bluetooth not supported: " + e)
      });
    }
    catch (e) {
      alert("device list failed catch block " + e)
    }
  }
  const getCurrentDate = () => {
    var date = new Date();

    // Get the date components
    var day = date.getDate().toString().padStart(2, '0');
    var month = (date.getMonth() + 1).toString().padStart(2, '0'); // Month is zero-indexed
    var year = date.getFullYear();

    // Concatenate the components in the desired format
    var englishDateString = day + '/' + month + '/' + year;
    return englishDateString
  }
  const _connectPrinter = (printer) => {
    //connect printer
    // alert('priniting in ' + printer.inner_mac_address);
    var vehicleData = getVehicle();
    console.log(jobNumber, "jobNumber");
    console.log(signatureURL, "signatureURL");
    try {
      var totalval = parseFloat(unitcost) * parseFloat(diesel);
      var gstval = (0.09 * totalval).toFixed(2);

      
      const BOLD_ON = COMMANDS.TEXT_FORMAT.TXT_BOLD_ON;
      const BOLD_OFF = COMMANDS.TEXT_FORMAT.TXT_BOLD_OFF;
      const CENTER = COMMANDS.TEXT_FORMAT.TXT_ALIGN_CT;
      const OFF_CENTER = COMMANDS.TEXT_FORMAT.TXT_ALIGN_LT;
      const LEFT_MARGIN = COMMANDS.MARGINS.LEFT;
      const setLeftMarginCommand = '\x1b\x6c\x00';

      // Set right margin to 0
      const setRightMarginCommand = '\x1b\x51\x00';
      BLEPrinter.connectPrinter(printer.inner_mac_address).then((data) => {
        BLEPrinter.printImage(
          `https://vellas.net/wp-content/uploads/2024/01/hshlogo3-1.webp`,
          {
            imageWidth: 300,
            imageHeight: 100,
          },
        );
        BLEPrinter.printText(`${setLeftMarginCommand}${setRightMarginCommand}${CENTER}${BOLD_ON}<M>Hock Seng Heng Transport & Trading Pte Ltd. </M>${BOLD_OFF}\n
        ${setLeftMarginCommand}${setRightMarginCommand}${CENTER}${BOLD_ON}<D>${vehicleData.vehicle.VEHICLE_INFO}</D>${BOLD_OFF}\n
       ${setLeftMarginCommand}${setRightMarginCommand}${CENTER}${BOLD_ON}<D>Delivery Order</D>${BOLD_OFF}\n
       ${setLeftMarginCommand}${setRightMarginCommand}<M>9 Jalan Besut Singapore 619563</M>
       ${setLeftMarginCommand}${setRightMarginCommand}<M>Tel: 6261-6101 Fax: 6261-1037</M>
       ${setLeftMarginCommand}${setRightMarginCommand}<M>${BOLD_ON}Do no: ${jobNumber}${BOLD_OFF}</M>
       ${setLeftMarginCommand}${setRightMarginCommand}<M>Sales Rep: ${latestJob.SALES_PERSON_NAME}</M>
       ${setLeftMarginCommand}${setRightMarginCommand}<M>Date: ${getCurrentDate()}</M>\n
       ${setLeftMarginCommand}${setRightMarginCommand}<D>${BOLD_ON}To: ${name}${BOLD_OFF}</D>\n
       ${OFF_CENTER}<D>Site: ${address == null ? '' : address.replaceAll('\n', " ")}</D>\n
       ${OFF_CENTER}<D>Product: \n </D>
       ${OFF_CENTER}<D>${product}</D>
       ${OFF_CENTER}<D>UOM: Litre</D>\n
       ${OFF_CENTER}<D>QTY: ${BOLD_ON}${diesel}${BOLD_OFF}</D>\n
       ${OFF_CENTER}<D>UNIT PRICE: $ ${parseFloat(unitcost).toFixed(3)}</D>\n
       ${OFF_CENTER}<D>SUB TOTAL: $ ${(parseFloat(unitcost) * parseFloat(diesel)).toFixed(2)}</D>
       ${OFF_CENTER}<D>9% GST: $ ${(parseFloat(unitcost) * parseFloat(diesel)*0.09).toFixed(2)}</D>
       ${OFF_CENTER}<D>TOTAL: $ ${((parseFloat(unitcost) * parseFloat(diesel)) + (parseFloat(unitcost) * parseFloat(diesel)*0.09)).toFixed(2)}</D>\n
       ${OFF_CENTER}<D>Remarks: ${remark == null ? '' : remark.replaceAll('\n', " ")}</D>\n\n\n`);
        if (signatureURL) {
          BLEPrinter.printImage(
            signatureURL,
            {
              imageWidth: 300,
              imageHeight: 100,
            },
          );

        }
        BLEPrinter.printText(`${CENTER}${BOLD_ON}<D>${OFF_CENTER}Authorised Name,</D>${BOLD_OFF}
        ${CENTER}${BOLD_ON}<D>${OFF_CENTER}Signature & </D>${BOLD_OFF}
        ${CENTER}${BOLD_ON}<D>${OFF_CENTER}Company Stamp</D>${BOLD_OFF}\n\n`);

        BLEPrinter.printText(`${CENTER}${BOLD_ON}<D>Thank You</D>${BOLD_OFF}\n\n`);
        setprintModal(false);
        setvisiblePint(true);
      }
      ).catch(e => {
        alert("connecting failed then catch block " + e)
      })
    }
    catch (e) {
      alert("connecting failed catch block " + e)
    }

  }




  const printHTML1 = async (jo) => {
    var vehicleData = getVehicle();
    await RNPrint.print({
      html: `<html lang="en">
              <div style="margin-right: 20px">
                <p style="margin-top: 0px; margin-bottom: 0px">
                  <strong>To: ${name}</strong>
                </p>
                <p style="margin-top: 0px">Site: ${address == null ? '' : address}</p>
              </div>
    
              <div>
              <p style="margin-top: 0px; margin-bottom: 0px"><strong>Do no: ${jo}</strong></p>
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
                  <th width="300px">DESCRIPTION</th>
                  <th>QTY</th>
                  <th width="50px">UNIT(SGD)</th>
                  <th width="20px">AMOUNT(SGD)</th>
                </tr>
                <tr>
                  <td>1</td>
                  <td>${product}</td>
                  <td>${diesel}</td>
                  <td>${unitcost}</td>
                  <td>${parseFloat(unitcost) * parseFloat(diesel)}</td>
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
                        ${remark == null ? '' : remark}
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
              margin-top: 30px;
            ">
            <div>
            <img
            src="${signature == null ? null : signature}" style="width: 130px"/>
            <p style="border-top: 2px solid black">
              Authorised Name, Signature &amp; Company Stamp
            </p>
            </div>
            <p >
            Driver Vehicle:${vehicleData.vehicle.VEHICLE_INFO}
            </p>
          </div>
        </div>
      </body>
    </html>
    `
    })
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
            ListHeaderComponent={<View
              style={{
                backgroundColor: '#fff',
                padding: 10,

              }}
            >
              <TextInput
                autoCapitalize="none"
                autoCorrect={false}
                clearButtonMode="always"
                value={query}
                onChangeText={queryText => handleSearch(queryText)}
                placeholder="Search"
                placeholderTextColor='black'
                style={{ backgroundColor: 'rgba(0,0,0,0.1)', paddingHorizontal: 10, borderRadius: 5, color: 'black' }}
              />
            </View>}
            data={businessName}
            keyExtractor={(item, index) => `${item}_${index}`}
            renderItem={NameView}
            showsVerticalScrollIndicator={true}
            stickyHeaderIndices={[0]}
          />
        </Modal>

        <Modal visible={addressVisible} onDismiss={hideAddressModal} contentContainerStyle={[styles.dragDown]}>
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
        {/* <SideBar all={true} navigation={navigation} onLog={() => setonLogOut(true)} /> */}
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
            <View style={{ marginBottom: 10 }}>
              {/* <TouchableOpacity
                onPress={() => {
                  printHTML();
                }}>
                <Text>Print</Text>
              </TouchableOpacity> */}
              <Text style={{ fontSize: width / 40, color: '#01315C', marginVertical: 10 }}>
                Business Name
              </Text>
              <TouchableOpacity onPress={showNameModal}>
                <Text
                  style={{ fontSize: width / 40, color: '#01315C', marginRight: 20, justifyContent: 'center' }}>
                  {!name ? `Select Business Name` : name} <Icon name='angle-down' size={18} style={{ alignSelf: 'center' }} />
                </Text>
              </TouchableOpacity>
              <Text style={{ fontSize: width / 40, color: '#01315C', marginVertical: 10 }}>
                Business Address
              </Text>
              <TouchableOpacity onPress={showAddressModal}>
                <Text
                  style={{ fontSize: width / 40, color: '#01315C', marginRight: 20, justifyContent: 'center' }}>
                  {!address ? `Select Business Address` : address} <Icon name='angle-down' size={18} style={{ alignSelf: 'center' }} />
                </Text>
              </TouchableOpacity>

            </View>
            <View
              style={{
                borderBottomWidth: 1,
                borderBottomColor: '#01315C',
                marginBottom: 20,
                marginTop: 10
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
            <Text
              style={{
                fontSize: 20,
                color: '#01315C',
                marginRight: 40,
                marginBottom: 10,
              }}>
              {'Price'}
            </Text>
            {/* <KeyboardAvoidingView
              style={{ marginBottom: 10 }}
              behavior={Platform.OS === 'ios' ? 'padding' : 'height'}> */}
            <TextInput keyboardType='decimal-pad' style={{ marginBottom: 10, borderWidth: 1, borderColor: 'rgba(0,0,0,0.4)', color: 'black', fontSize: 20 }} value={unitcost} onChangeText={text => setunitcost(text)} />
            {/* </KeyboardAvoidingView> */}
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 10,
              }}>
              <Text
                style={{ fontSize: width / 40, color: '#01315C', marginRight: 40 }}>
                {t('signature')}
              </Text>
              {/* <Icon name="edit" color="#01315C" size={20} onPress={showSignatureModal} /> */}
              <TouchableOpacity onPress={showSignatureModal} style={{ backgroundColor: '#01315C', padding: 5, borderRadius: 5 }}>
                <Text style={{ color: 'white', width: 50, textAlign: 'center' }}>Sign</Text>
              </TouchableOpacity>
            </View>
            {/* <Text
              style={{
                fontSize: width / 60,
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
                <Text style={{ fontSize: width / 40, color: '#01315C', marginRight: 40 }}>
                  {t('metre_reading_after')}
                </Text>
              </View>
              {/* <Icon
                onPress={() => {
                  setuploadtype('after');
                  setModalVisible(true);
                }}
                name="edit"
                color="#01315C"
                size={20}
              /> */}
              <TouchableOpacity onPress={() => {
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
                <Text style={{ fontSize: width / 40, color: '#01315C', marginRight: 40 }}>
                  {t('metre_reading_before')}
                </Text>
              </View>
              {/* <Icon
                onPress={() => {
                  setuploadtype('before');
                  setModalVisible(true);
                }}
                name="edit"
                color="#01315C"
                size={20}
              /> */}
              <TouchableOpacity onPress={() => {
                setuploadtype('before');
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
              <TextInput style={[remarks]} multiline={true} numberOfLines={4} value={remark} onChangeText={text => setremark(text)} />
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
          defaultValue={false}
          keepinView={true}
          hide={() => setshowInput(false)}
          initialValue={diesel}
          onSubmit={() => {
            setshowInput(false);
            getInputDiesel(val);
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
        <DialogComp visible={printModal} onClose={(val) => setprintModal(false)}>
          {
            printers.map((printer, index) => (
              <TouchableOpacity style={{ padding: 10, borderBottomWidth: 1, width: '100%' }} key={printer.inner_mac_address} onPress={() => _connectPrinter(printer)}>
                <Text style={{ color: 'black', fontSize: 15, textAlign: 'center' }}>{`${printer.device_name}(${printer.inner_mac_address})`}</Text>
              </TouchableOpacity>
            ))
          }
        </DialogComp>
      </Animated.View>
      <AwesomeAlert
        show={visiblePint}
        showProgress={false}
        title="Job Successful"
        message="Do you want to print this job?"
        closeOnTouchOutside={false}
        closeOnHardwareBackPress={false}
        showCancelButton={true}
        showConfirmButton={true}
        cancelText="No"
        confirmText="Print"
        confirmButtonColor="#01315C"
        cancelButtonTextStyle={{ color: 'black', fontSize: 15 }}
        confirmButtonTextStyle={{ fontSize: 20 }}
        confirmButtonStyle={{ marginLeft: 30 }}
        titleStyle={{ color: 'black' }}
        messageStyle={{ color: 'black' }}
        onCancelPressed={() => {
          // this.hideAlert();
          setvisiblePint(false);
          navigation.replace('Main');
        }}
        onConfirmPressed={() => {
          // this.hideAlert();
          setvisiblePint(false);
          setTimeout(() => {
            getSign(INV_NO);
          }, 500)


        }}
      />
      <Modal transparent={true} visible={onLogOut} style={{ position: 'absolute', width: '100%' }}>
        <View style={{ backgroundColor: 'rgba(0,0,0,0.5)', flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <View style={{ backgroundColor: 'white', padding: 20, margin: 20, borderRadius: 8, alignItems: 'center' }}>
            <Text style={{ color: 'black', fontWeight: 'bold', fontSize: width / 30 }}>Are you sure you want to Log Out ?</Text>
            <View style={{ flexDirection: 'row', marginTop: 20 }}>
              <TouchableOpacity onPress={LogOut} style={[button, { backgroundColor: 'white', }]}>
                <Text style={[buttonText, { color: 'black', paddingHorizontal: 10 }]}>Yes</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setonLogOut(false)} style={[button, { marginLeft: 20 }]}>
                <Text style={[buttonText, { paddingHorizontal: 10 }]}>No</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
    margin: '5%',
    width: '80%',
    alignSelf: 'center',
    borderRadius: 5,
    padding: 5
  }
});
