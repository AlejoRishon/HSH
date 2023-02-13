import React, {useRef, useEffect, useState} from 'react';
import {StyleSheet,Dimensions, Text, View, Animated, TouchableOpacity} from 'react-native';
import {searchBox, button, buttonText, text} from '../styles/MainStyle';
import Icon from 'react-native-vector-icons/FontAwesome';
const {width,height}=Dimensions.get('window');

export default function RightConfirm({
  show,
  header,
  subHeader,
  hide,
  onSubmit,
}) {
  const fadeAnim = useRef(new Animated.Value(-500)).current;
  const [modalVisible, setModalVisible] = useState(false);
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
          width: (width/2.8),
          flex: 1,
          borderTopLeftRadius: 15,
          borderBottomLeftRadius: 15,
          padding: 20,
          paddingTop: 30,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <Icon name="check-circle-o" color="#EAF5FF" size={70} />
        <Text
          style={{
            fontSize: 30,
            color: '#fff',
            fontWeight: 600,
            marginBottom: 10,
            textAlign: 'center',
          }}>
          Completed
        </Text>
      </View>

      <View style={{flexDirection: 'row', padding: 20}}>
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
            Okay
          </Text>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({});
