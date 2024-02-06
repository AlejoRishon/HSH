import {
  StyleSheet,
  Dimensions,
  Text,
  View,
  Animated,
  TouchableOpacity,
  Alert,
} from 'react-native';
import React, { useRef, useEffect, useState } from 'react';
import { searchBox, button, buttonText, text } from '../styles/MainStyle';
import { horizontalScale, moderateScale, verticalScale } from '../styles/Metrics';
const { width, height } = Dimensions.get('window');

export default function RightInputBar({
  show,
  header,
  subHeader,
  keepinView = false,
  defaultValue = false,
  getInputDiesel,
  hide,
  onSubmit,
  initialValue
}) {
  const fadeAnim = useRef(new Animated.Value(-500)).current;
  const numPad = [1, 2, 3, 4, 5, 6, 7, 8, 9, '', 0, '<'];
  const [calVal, setCalVal] = useState([]);

  useEffect(() => {
    if (initialValue) {
      setCalVal(String(initialValue).split("").map((num) => {
        return Number(num)
      }))
    }
  }, [initialValue]);

  useEffect(() => {
    if (show) {
      onShow();
      if (defaultValue) {
        setCalVal([8, 0, 0, 0]);
      }
    }
    else {
      onHide();
    }
  }, [show]);

  const onShow = () => {
    // setCalVal([]);
    if (initialValue == 0) {
      setCalVal([]);
    }
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 500,
      useNativeDriver: false,
    }).start();
  };

  const onHide = () => {
    setCalVal([]);
    hide();
    Animated.timing(fadeAnim, {
      toValue: -500,
      duration: 1000,
      useNativeDriver: false,
    }).start();
  };

  const add = val => {
    if (val === '<') {
      setCalVal(prevVal => prevVal.slice(0, -1));
    } else {
      setCalVal(prevVal => [...prevVal, val]);
    }
  };

  useEffect(() => {
    const dieselValue = parseInt(calVal.join('')) || 0;
    getInputDiesel(dieselValue);
  }, [calVal]);

  return (
    <Animated.View
      style={{
        position: 'absolute',
        right: fadeAnim,
        height: '100%',
        backgroundColor: '#01315C',
      }}>
      <View
        style={{
          width: width / 2.8,
          flex: 1,
          borderTopLeftRadius: 15,
          borderBottomLeftRadius: 15,
          padding: moderateScale(15),
          paddingTop: verticalScale(25),
        }}>
        <Text
          style={{
            fontSize: width / 40,
            color: '#fff',
            fontWeight: 600,
            marginBottom: 10,
          }}>
          {header}
        </Text>
        <Text
          style={{
            fontSize: moderateScale(8),
            color: '#fff',
            marginBottom: verticalScale(40),
          }}>
          {subHeader}
        </Text>
        <View
          style={{
            borderColor: '#C4C4C4',
            borderWidth: 1,
            backgroundColor: '#E8E8E8',
            paddingLeft: horizontalScale(4),
            borderRadius: 8,
            height: verticalScale(70),
          }}>
          <Text style={{ fontSize: moderateScale(15), color: '#01315C' }}>
            {calVal.join('')}
          </Text>
        </View>
        <View
          style={{
            flexDirection: 'row',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            margin: verticalScale(15),
          }}>
          {numPad.map((val, index) => {
            return (
              <TouchableOpacity
                key={index}
                onPress={() => add(val)}
                style={{
                  backgroundColor: '#EAF5FF',
                  width: '30%',
                  borderRadius: 8,
                  marginTop: verticalScale(24),
                  justifyContent: 'center',
                }}>
                <Text
                  style={{
                    fontSize: width / 35,
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

      <View style={{ flexDirection: 'row', padding: 10 }}>
        {keepinView ? null : (
          <TouchableOpacity
            onPress={onHide}
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
                fontSize: width / 35,
                padding: 5,
              }}>
              Back
            </Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity
          onPress={() => {
            if (calVal.length > 0) {
              onSubmit(parseInt(calVal.join('')));
              if (!keepinView) {
                onHide();
              }
            }
            else {
              Alert.alert('Quantity cannot be 0')
            }
            // console.log(calVal)

          }}
          style={{ backgroundColor: '#EAF5FF', flex: 1, borderRadius: 8 }}>
          <Text
            style={{
              color: '#01315C',
              textAlign: 'center',
              fontSize: width / 35,
              padding: 5,
            }}>
            Submit
          </Text>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
}

export const AdhocRightInputBar = ({
  show,
  header,
  subHeader,
  keepinView = false,
  defaultValue = false,
  getInputDiesel,
  hide,
  onSubmit,
  initialValue
}) => {
  const fadeAnim = useRef(new Animated.Value(-500)).current;
  const numPad = [1, 2, 3, 4, 5, 6, 7, 8, 9, '', 0, '<'];
  const [calVal, setCalVal] = useState([0]);
  useEffect(() => {
    if (initialValue) {
      setCalVal(String(initialValue).split("").map((num) => {
        return Number(num)
      }))
    }
  }, [initialValue]);
  useEffect(() => {
    if (show) {
      onShow();
      if (defaultValue) {
        setCalVal([8, 0, 0, 0]);
      }
    }
  }, [show]);

  const onShow = () => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 500,
      useNativeDriver: false,
    }).start();
  };

  const onHide = () => {
    hide();
    Animated.timing(fadeAnim, {
      toValue: -500,
      duration: 1000,
      useNativeDriver: false,
    }).start();
  };

  const add = val => {
    if (val === '<') {
      setCalVal(prevVal => prevVal.slice(0, -1));
    } else {
      setCalVal(prevVal => [...prevVal, val]);
    }
  };

  useEffect(() => {
    const dieselValue = parseInt(calVal.join('')) || 0;
    getInputDiesel(dieselValue);
  }, [calVal, getInputDiesel]);

  return (
    <Animated.View
      style={{
        position: 'absolute',
        right: fadeAnim,
        height: '100%',
        backgroundColor: '#01315C',
      }}>
      <View
        style={{
          width: width / 3,
          flex: 1,
          borderTopLeftRadius: 15,
          borderBottomLeftRadius: 15,
          padding: 10,
          paddingTop: verticalScale(25),
        }}>
        <Text
          style={{
            fontSize: width / 40,
            color: '#fff',
            fontWeight: 600,
            marginBottom: 10,
          }}>
          {header}
        </Text>
        <Text
          style={{
            fontSize: moderateScale(8),
            color: '#fff',
            marginBottom: verticalScale(40),
          }}>
          {subHeader}
        </Text>
        <View
          style={{
            borderColor: '#C4C4C4',
            borderWidth: 1,
            backgroundColor: '#E8E8E8',
            paddingLeft: horizontalScale(4),
            borderRadius: 8,
            height: verticalScale(80),
            justifyContent: 'center'
          }}>
          <Text style={{ fontSize: moderateScale(15), color: '#01315C' }}>
            {calVal.join('')}
          </Text>
        </View>
        <View
          style={{
            flexDirection: 'row',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            margin: verticalScale(15),
          }}>
          {numPad.map((val, index) => {
            return (
              <TouchableOpacity
                key={index}
                onPress={() => add(val)}
                style={{
                  backgroundColor: '#EAF5FF',
                  width: '30%',
                  borderRadius: 8,
                  marginTop: verticalScale(28),
                  justifyContent: 'center',
                }}>
                <Text
                  style={{
                    fontSize: width / 35,
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

      <View style={{ flexDirection: 'row', padding: moderateScale(8) }}>
        {keepinView ? null : (
          <TouchableOpacity
            onPress={onHide}
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
        )}
      </View>
    </Animated.View>
  );
}


const styles = StyleSheet.create({});
