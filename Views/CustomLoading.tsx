import React, { useEffect, useRef } from 'react';
import { Animated, Dimensions, View, Image, StyleSheet ,Text} from 'react-native';
import tw from 'twrnc';

const { width, height } = Dimensions.get('window');

const CustomLoading = () => {
  const fadeAnim = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 700,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 0.3,
          duration: 700,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  return (
    <View style={styles.overlay}>
      <Animated.View style={tw`w-20 h-20 bg-white rounded-full justify-center items-center`} >
      <Animated.Image
        source={require('../Img/pen.png')}
        style={[tw`w-15 h-15`, { opacity: fadeAnim }]}
        resizeMode="contain"
      />
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: -100,
    left: 0,
    width,
    height,
    backgroundColor: 'rgba(0,0,0,0.4)',
    zIndex: 999,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default CustomLoading;
