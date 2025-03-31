import React,{useState} from 'react';
import { View, Image, TouchableOpacity } from 'react-native'
import { useNavigation } from '@react-navigation/native';
import tw from 'twrnc';
import Sidebar from "./Sidebar"; 

const Header = () => {
  const navigation = useNavigation();
  
  return (
    <View >
      <TouchableOpacity  >
        <Image source={require('../Img/logo.png')} style={tw`w-[50px] h-[50px]`} />
      </TouchableOpacity>
     
    </View>
  );
};

export default Header;
