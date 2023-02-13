import {StyleSheet, Dimensions, Text, View, Animated, TouchableOpacity} from 'react-native';
import React, {useRef, useEffect, useState} from 'react';
import {searchBox, button, buttonText, text} from '../styles/MainStyle';
const {width,height}=Dimensions.get('window');

export default function RightInputBar({
  show,
  header,
  subHeader,
  keepinView=false,
  hide,
  onSubmit,
}) {
  const fadeAnim = useRef(new Animated.Value(-500)).current;
  const numPad = [1, 2, 3, 4, 5, 6, 7, 8, 9, '', 0, '<'];
  const [calVal, setcalVal] = useState([]);
  useEffect(() => {
    if (show) {
      onShow();
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
      duration: 500,
      useNativeDriver: false,
    }).start();
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
        backgroundColor: '#01315C'
      }}>
      <View
        style={{
          width: (width/2.8),
          flex: 1,
          borderTopLeftRadius: 15,
          borderBottomLeftRadius: 15,
          padding: 20,
          paddingTop: 30,
        }}>
        <Text
          style={{
            fontSize: width/40,
            color: '#fff',
            fontWeight: 600,
            marginBottom: 10,
          }}>
          {header}
        </Text>
        <Text style={{fontSize: width/60, color: '#fff', marginBottom: 40}}>
          {subHeader}
        </Text>
        <View
          style={{
            borderColor: '#C4C4C4',
            borderWidth: 1,
            backgroundColor: '#E8E8E8',
            padding: 10,
            borderRadius: 8,
            height:width/15
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
            marginTop:10,
          }}>
          {numPad.map(val => {
            return (
              <TouchableOpacity
                onPress={() => add(val)}
                style={{
                  padding: 5,
                  backgroundColor: '#EAF5FF',
                  width: '30%',
                  height:width/20,
                  borderRadius: 8,
                  marginTop: 10,
                  justifyContent:'center'
                }}>
                <Text
                  style={{fontSize: 30, color: '#01315C', textAlign: 'center'}}>
                  {val}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      <View style={{flexDirection: 'row', padding: 20}}>
        {
          keepinView ? null 
          :
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


        }
        <TouchableOpacity
          onPress={() => {
          if(keepinView){
            return;
          }
            Animated.timing(fadeAnim, {
              toValue: -500,
              duration: 500,
              useNativeDriver: false,
            }).start();
            onSubmit();
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
    </Animated.View>
  );
}

const styles = StyleSheet.create({});
