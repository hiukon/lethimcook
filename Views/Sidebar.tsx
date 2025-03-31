import React, { useEffect, useRef } from "react";
import { View, Text, TouchableOpacity, Animated } from "react-native";
import tw from 'twrnc';

interface SidebarProps {
  isOpen: boolean;
  closeMenu: () => void;
}

export default function Sidebar({ isOpen, closeMenu }: SidebarProps) {
  const translateX = useRef(new Animated.Value(-250)).current;

  useEffect(() => {
    Animated.timing(translateX, {
      toValue: isOpen ? 0 : -250,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [isOpen]);

  return (
    <Animated.View
      style={[tw`absolute top-0 left-0 bottom-0 w-[250px] bg-gray-100 p-5 shadow-lg`,{ transform: [{ translateX }] },]}>
      {/* Nút đóng menu */}
      <TouchableOpacity onPress={closeMenu} style={tw`absolute top-4 right-4`}>
        <Text style={tw`text-xl font-bold`}>×</Text>
      </TouchableOpacity>
      {/* Thông tin người dùng */}
      <Text style={tw`text-lg font-bold mt-6`}>Hieu Tran</Text>
      <Text style={tw`text-sm text-gray-500`}>@cook_112494030</Text>

      {/* Danh sách menu */}
      <TouchableOpacity style={tw`mt-5 py-2`}>
        <Text style={tw`text-base`}>Bếp cá nhân</Text>
      </TouchableOpacity>
      <TouchableOpacity style={tw`py-2`}>
        <Text style={tw`text-base`}>Các Bạn Bếp</Text>
      </TouchableOpacity>
      <TouchableOpacity style={tw`py-2`}>
        <Text style={tw`text-base`}>Thống Kê Bếp</Text>
      </TouchableOpacity>
      <TouchableOpacity style={tw`py-2`}>
        <Text style={tw`text-base`}>Cài đặt</Text>
      </TouchableOpacity>
    </Animated.View>
  );
}
