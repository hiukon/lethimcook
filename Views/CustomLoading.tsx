import React, { useEffect, useRef } from 'react';
import { Animated, Dimensions, View, Image, StyleSheet } from 'react-native';
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
      <Animated.Image
        source={require('../Img/pen.png')}
        style={[tw`w-28 h-28`, { opacity: fadeAnim }]}
        resizeMode="contain"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
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
