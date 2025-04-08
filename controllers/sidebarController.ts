import { useEffect, useRef } from "react";
import { Animated } from "react-native";

export const useSidebarController = (isOpen: boolean) => {
  const translateX = useRef(new Animated.Value(-250)).current;

  useEffect(() => {
    Animated.timing(translateX, {
      toValue: isOpen ? 0 : -250,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [isOpen]);

  return { translateX };
};
