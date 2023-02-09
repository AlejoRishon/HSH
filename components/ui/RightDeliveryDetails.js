import {
  StyleSheet,
  Text,
  Modal,
  View,
  Animated,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import React, {useRef, useEffect, useState} from 'react';
import * as ImagePicker from 'react-native-image-picker';
import {searchBox, button, buttonText, remarks} from '../styles/MainStyle';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useTranslation } from 'react-i18next';
import {TextInput} from 'react-native-paper';
import {Image} from 'react-native-animatable';


export default function RightDeliveryDetails({
  show,
  header,
  subHeader,
  hide,
  onSubmit,
}) {
  const [modalVisible, setModalVisible] = useState(false);
  const {t,i18n}=useTranslation();
  const fadeAnim = useRef(new Animated.Value(-800)).current;
  const heightAnim = useRef(new Animated.Value(0)).current;
  const heightMeterAfAnim = useRef(new Animated.Value(0)).current;
  const heightMeterBeAnim = useRef(new Animated.Value(0)).current;
  const numPad = [1, 2, 3, 4, 5, 6, 7, 8, 9, '', 0, '<'];
  const [calVal, setcalVal] = useState([]);
  const [more, setmore] = useState(false);
  const [moreMeterAf, setmoreMeterAf] = useState(false);
  const [moreMeterBe, setmoreMeterBe] = useState(false);

  const [uploadtype,setuploadtype]=useState('after');

  //after
  const [previewImageUri,setpreviewImageUri]=useState('');
  const [imagePreview,setimagePreview]=useState(false);
  //before
  const [previewImageUribefore,setpreviewImageUribefore]=useState('');
  const [imagePreviewbefore,setimagePreviewbefore]=useState(false);
  useEffect(() => {
    if (show) {
      onShow(-400);
    }
  }, [show]);
  const onShow = val => {
    Animated.timing(fadeAnim, {
      toValue: val,
      duration: 500,
      useNativeDriver: false,
    }).start();
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

  const onHide = () => {
    hide();
    Animated.timing(fadeAnim, {
      toValue: -800,
      duration: 500,
      useNativeDriver: false,
    }).start();
    setcalVal([]);
    setmore(false);
    setmoreMeterAf(false);
    setmoreMeterBe(false);
    onToggleMore(0);
    onToggleMoreAf(0);
    onToggleMoreBe(0);
  };
  const add = val => {
    var aVal = [...calVal];
    if (val == '<') {
      aVal.pop(val);
      setcalVal(aVal);
    } else {
      aVal.push(val);
      setcalVal(aVal);
    }
  };

  const openGallery=async (type,section)=>{
    const options={mediaType:'image',includeBase64: false,maxHeight: 800,maxWidth: 800};
    try {
      var response;
      if(type){
        response=await ImagePicker.launchImageLibrary(options);
      }else{
        response=await ImagePicker.launchCamera(options);
      }
      console.log("resp",response);
      // setFile(response);
      if(section==='after'){
        setpreviewImageUri(response.assets[0].uri);
        setimagePreview(true)
      }else{
        setpreviewImageUribefore(response.assets[0].uri)
        setimagePreviewbefore(true);
      }
    }catch (error) {
      console.log(error);
    }
    setModalVisible(!modalVisible)
  }
  return (
    <Animated.View
      style={{
        position: 'absolute',
        right: fadeAnim,
        height: '100%',
        flexDirection: 'row',
      }}>
      <View
        style={{
          flex: 1,
          justifyContent: 'space-between',
          backgroundColor: '#EEF7FF',
          borderTopLeftRadius: 15,
          borderBottomLeftRadius: 15,
          width: 400,
        }}>
        <ScrollView
          style={{
            padding: 20,
            paddingTop: 30,
          }}>
          <Text
            style={{
              fontSize: 30,
              color: '#01315C',
              fontWeight: 600,
              marginBottom: 10,
            }}>
            Eddie Ang
          </Text>
          <Text style={{fontSize: 20, color: '#01315C', marginBottom: 10}}>
            DO-12345678A
          </Text>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginBottom: 20,
            }}>
            <Text style={{fontSize: 20, color: '#01315C', marginRight: 40}}>
              BDP Global Project Logistics Pte Ltd
            </Text>
            {more ? (
              <Icon
                onPress={() => onToggleMore(0)}
                name="chevron-up"
                color="#01315C"
                size={20}
              />
            ) : (
              <Icon
                onPress={() => onToggleMore(120)}
                name="chevron-down"
                color="#01315C"
                size={20}
              />
            )}
          </View>
          <Animated.View style={{height: heightAnim}}>
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
            <Icon
              onPress={() => onShow(0)}
              name="edit"
              color="#01315C"
              size={20}
            />
          </View>
          <Text
            style={{
              fontSize: 30,
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
            <Text style={{fontSize: 25, color: '#01315C', marginRight: 40}}>
              {t('signature')}
            </Text>
            <Icon name="edit" color="#01315C" size={20} />
          </View>
          <Text
            style={{
              fontSize: 16,
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
            {moreMeterAf ? (
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
            )}
          </View>
          <View style={{marginBottom:20}}>
              {
                imagePreview ?
                <>
                <TouchableOpacity
                onPress={()=>{
                  setimagePreview(false);
                  setpreviewImageUri('');
                }}
                 style={{
                    position:'absolute',
                    width:30,
                    height:30,
                    backgroundColor:'#404040',
                    top:-10,
                    left:70,
                    zIndex:+2,
                    borderRadius:25,
                    justifyContent:'center',
                    alignItems:'center'
                  }}>
                    <Icon
                name="close"
                color="#fff"
                size={20}
              />
                  </TouchableOpacity>
                  <View style={{
              width:80,
              height:80,
              borderWidth:2,
              borderColor:'navy',
              marginLeft:10,
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
                  <Image source={{uri:previewImageUri}} style={{width:'100%',height:'100%'}} />
                  </View>   
</>
                
                :
                <View style={{flexDirection:'row'}}>
                  <TouchableOpacity  style={{
                  width:110,
                  height:40,
                  borderWidth:2,
                  borderColor:'navy',
                  marginRight:10,
                  flexDirection: 'row',
                  justifyContent: 'space-around',
                  alignItems: 'center',
                }} 
                 onPress={()=>{
                  //openGallery(false,'before')
                  setuploadtype('after');
                  setModalVisible(true)
                }}>
                  <Icon
                name="plus"
                color="navy"
                size={18}
              />
                  <Text style={{color:'navy',fontWeight:'bold'}}>Add Image</Text>
                </TouchableOpacity>
                
                {/* <TouchableOpacity style={{
                  width:80,
                  height:80,
                  borderWidth:2,
                  borderColor:'navy',
                  marginRight:10,
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                }} 
                onPress={()=>{
                  //openGallery(true,'after')
                  setModalVisible(true)
                }}>
                  <Icon
                name="image"
                color="navy"
                size={20}
              />
                <Text style={{color:'navy'}}>Gallery</Text>
                  
                </TouchableOpacity>
                <TouchableOpacity  style={{
                  width:80,
                  height:80,
                  borderWidth:2,
                  borderColor:'navy',
                  marginRight:10,
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
                 onPress={()=>{
                  openGallery(false,'after')
                }}>
                  <Icon
                name="camera"
                color="navy"
                size={20}
              />
                  <Text style={{color:'navy'}}>Camera</Text>
                </TouchableOpacity> */}
                </View>
              }
            
          </View>
          {/* <Animated.View
            style={{
              height: heightMeterAfAnim,
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
            <Image
              style={{height: '100%', flex: 1}}
              source={require('../../assets/fuel.jpeg')}
              resizeMode="contain"
            />
            <Icon name="edit" color="#01315C" size={20} />
          </Animated.View> */}
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginBottom: 20,
              backgroundColor: '#EEF7FF',
            }}>
            <View>
              <Text style={{fontSize: 20, color: '#01315C', marginRight: 40}}>
              {t('metre_reading_before')}
              </Text>
            </View>
            {moreMeterBe ? (
              <Icon
                onPress={() => onToggleMoreBe(0)}
                name="chevron-up"
                color="#01315C"
                size={20}
              />
            ) : (
              <Icon
                onPress={() => onToggleMoreBe(80)}
                name="chevron-down"
                color="#01315C"
                size={20}
              />
            )}
          </View>
          <View style={{marginBottom:20}}>
              {
                imagePreviewbefore ?
                <>
                <TouchableOpacity
                onPress={()=>{
                  setimagePreviewbefore(false);
                  setpreviewImageUribefore('');
                }}
                 style={{
                    position:'absolute',
                    width:30,
                    height:30,
                    backgroundColor:'#404040',
                    top:-10,
                    left:70,
                    zIndex:+2,
                    borderRadius:25,
                    justifyContent:'center',
                    alignItems:'center'
                  }}>
                    <Icon
                name="close"
                color="#fff"
                size={20}
              />
                  </TouchableOpacity>
                  <View style={{
              width:80,
              height:80,
              borderWidth:2,
              borderColor:'navy',
              marginLeft:10,
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
                  <Image source={{uri:previewImageUribefore}} style={{width:'100%',height:'100%'}} />
                  </View>   
</>
                
                :
                <View style={{flexDirection:'row'}}>
                <TouchableOpacity  style={{
                  width:110,
                  height:40,
                  borderWidth:2,
                  borderColor:'navy',
                  marginRight:10,
                  flexDirection: 'row',
                  justifyContent: 'space-around',
                  alignItems: 'center',
                }} 
                 onPress={()=>{
                  //openGallery(false,'before')
                  setuploadtype('before');
                  setModalVisible(true)
                }}>
                  <Icon
                name="plus"
                color="navy"
                size={18}
              />
                  <Text style={{color:'navy',fontWeight:'bold'}}>Add Image</Text>
                </TouchableOpacity>
                {/* <TouchableOpacity  style={{
                  width:80,
                  height:80,
                  borderWidth:2,
                  borderColor:'navy',
                  marginRight:10,
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                }} 
                onPress={()=>{
                  openGallery(true,'before')
                }}>
                  <Icon
                name="image"
                color="navy"
                size={20}
              />
                <Text style={{color:'navy'}}>Gallery</Text>
                  
                </TouchableOpacity>
                <TouchableOpacity  style={{
                  width:80,
                  height:80,
                  borderWidth:2,
                  borderColor:'navy',
                  marginRight:10,
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                }} 
                 onPress={()=>{
                  openGallery(false,'before')
                }}>
                  <Icon
                name="camera"
                color="navy"
                size={20}
              />
                  <Text style={{color:'navy'}}>Camera</Text>
                </TouchableOpacity> */}
                </View>
              }
            
          </View>
          {/* <Animated.View
            style={{
              height: heightMeterBeAnim,
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
            <Image
              style={{height: '100%', flex: 1}}
              source={require('../../assets/fuel.jpeg')}
              resizeMode="contain"
            />
            <Icon name="edit" color="#01315C" size={20} />
          </Animated.View> */}
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
            <TextInput style={remarks} multiline={true} numberOfLines={4} />
          </KeyboardAvoidingView>
        </ScrollView>

        <TouchableOpacity
          onPress={() => onHide()}
          style={{
            backgroundColor: '#01315C',
            borderRadius: 8,
            margin: 10,
          }}>
          <Text
            style={{
              color: '#fff',
              textAlign: 'center',
              fontSize: 20,
              padding: 10,
            }}>
            Close
          </Text>
        </TouchableOpacity>
      </View>
      <View style={{backgroundColor: '#01315C', width: 400}}>
        <View
          style={{
            flex: 1,
            padding: 20,
            paddingTop: 30,
          }}>
          <Text
            style={{
              fontSize: 30,
              color: '#fff',
              fontWeight: 600,
              marginBottom: 10,
            }}>
            Liters of Diesel Pumped
          </Text>
          <Text style={{fontSize: 20, color: '#fff', marginBottom: 40}}>
            Enter quantity of diesel pumped
          </Text>
          <View
            style={{
              borderColor: '#C4C4C4',
              borderWidth: 1,
              backgroundColor: '#E8E8E8',
              padding: 20,
              borderRadius: 8,
            }}>
            <Text style={{fontSize: 30, color: '#01315C'}}>
              {calVal.join('')}
            </Text>
          </View>
          <View
            style={{
              flexDirection: 'row',
              flexWrap: 'wrap',
              justifyContent: 'space-between',
              marginTop: 20,
            }}>
            {numPad.map(val => {
              return (
                <TouchableOpacity
                  onPress={() => add(val)}
                  style={{
                    padding: 10,
                    backgroundColor: '#EAF5FF',
                    width: '30%',
                    borderRadius: 8,
                    marginTop: 10,
                  }}>
                  <Text
                    style={{
                      fontSize: 40,
                      color: '#01315C',
                      textAlign: 'center',
                    }}>
                    {val}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
        <View style={{flexDirection: 'row', padding: 20}}>
          <TouchableOpacity
            onPress={() => onShow(-400)}
            style={{
              backgroundColor: '#EAF5FF',
              flex: 1,
              borderRadius: 8,
              marginRight: 10,
            }}>
            <Text
              style={{
                color: '#01315C',
                textAlign: 'center',
                fontSize: 20,
                padding: 10,
              }}>
              Back
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              onShow(-400);
            }}
            style={{backgroundColor: '#EAF5FF', flex: 1, borderRadius: 8}}>
            <Text
              style={{
                color: '#01315C',
                textAlign: 'center',
                fontSize: 20,
                padding: 10,
              }}>
              Submit
            </Text>
          </TouchableOpacity>
        </View>
      </View>
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
            <View style={{flexDirection:'row'}}>
              <View style={{width:'80%',height:50,backgroundColor:'#d3d3d370'}}>
                <Text style={[{fontSize:22,color:"#000",fontWeight:'600',paddingLeft:10,paddingVertical:8}]}>{t('Metre Reading After')}</Text>
              </View>
              <View style={{width:'20%',height:50,backgroundColor:'#d3d3d370',alignItems:'center',justifyContent:'center'}}>
                <TouchableOpacity onPress={() => setModalVisible(!modalVisible)} style={{
                  width:50,
                  height:50,
                  justifyContent:'center',
                  alignItems:'center'
                }}>
                <Text style={[{fontSize:22,color:"#000",paddingLeft:20,fontWeight:'600'}]}>
                <Icon
                    name="close"
                    color="#000"
                    size={20}
                  />
                </Text>
                </TouchableOpacity>
              </View>
            </View>
            <View style={{flexDirection:'row',paddingTop:20,paddingLeft:20}}>
                          <TouchableOpacity  style={{
                                width:80,
                                height:80,
                                borderWidth:2,
                                borderColor:'navy',
                                marginRight:50,
                                flexDirection: 'column',
                                justifyContent: 'center',
                                alignItems: 'center',
                              }} 
                              onPress={()=>{
                                openGallery(true,uploadtype)
                                
                              }}>
                                <Icon
                              name="image"
                              color="navy"
                              size={20}
                            />
                              <Text style={{color:'navy'}}>Gallery</Text>
                                
                              </TouchableOpacity>
                              <TouchableOpacity  style={{
                                width:80,
                                height:80,
                                borderWidth:2,
                                borderColor:'navy',
                                marginRight:10,
                                flexDirection: 'column',
                                justifyContent: 'center',
                                alignItems: 'center',
                              }} 
                              onPress={()=>{
                                openGallery(false,uploadtype)
                              }}>
                                <Icon
                              name="camera"
                              color="navy"
                              size={20}
                            />
                                <Text style={{color:'navy'}}>Camera</Text>
                              </TouchableOpacity>
                
            </View>
          </View>
        </View>
      </Modal>
    </Animated.View>
  );
}

//const styles = StyleSheet.create({});
const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    width:400,
    height:200,
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
    color:'#000'
  },
});