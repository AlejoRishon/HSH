import {
  StyleSheet,
  Text,
  View,
  Animated,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import React, {useRef, useEffect, useState} from 'react';
import {searchBox, button, buttonText, remarks} from '../styles/MainStyle';
import Icon from 'react-native-vector-icons/FontAwesome';
import {TextInput} from 'react-native-paper';
import {Image} from 'react-native-animatable';

export default function RightDeliveryDetails({
  show,
  header,
  subHeader,
  hide,
  onSubmit,
}) {
  const fadeAnim = useRef(new Animated.Value(-800)).current;
  const heightAnim = useRef(new Animated.Value(0)).current;
  const heightMeterAfAnim = useRef(new Animated.Value(0)).current;
  const heightMeterBeAnim = useRef(new Animated.Value(0)).current;
  const numPad = [1, 2, 3, 4, 5, 6, 7, 8, 9, '', 0, '<'];
  const [calVal, setcalVal] = useState([]);
  const [more, setmore] = useState(false);
  const [moreMeterAf, setmoreMeterAf] = useState(false);
  const [moreMeterBe, setmoreMeterBe] = useState(false);
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
            <Text style={{fontSize: 25, color: '#01315C', marginRight: 40}}>
              Liters of Diesel Sold
            </Text>
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
              Signature
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
            <Text style={{fontSize: 20, color: '#01315C', marginRight: 40}}>
              Meter Reading (After)
            </Text>
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
          <Animated.View
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
          </Animated.View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginBottom: 20,
              backgroundColor: '#EEF7FF',
            }}>
            <Text style={{fontSize: 20, color: '#01315C', marginRight: 40}}>
              Meter Reading (Before)
            </Text>
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
          <Animated.View
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
          </Animated.View>
          <Text
            style={{
              fontSize: 20,
              color: '#01315C',
              marginRight: 40,
              backgroundColor: '#EEF7FF',
            }}>
            Remarks
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
    </Animated.View>
  );
}

const styles = StyleSheet.create({});
