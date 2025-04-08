import React from 'react';
import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  ImageBackground,
  StatusBar,
} from 'react-native';
import tw from 'twrnc';

interface LoginViewProps {
  email: string;
  password: string;
  loading: boolean;
  onEmailChange: (text: string) => void;
  onPasswordChange: (text: string) => void;
  onLoginPress: () => void;
  onNavigateToSignUp: () => void;
}

const LoginView: React.FC<LoginViewProps> = ({
  email,
  password,
  loading,
  onEmailChange,
  onPasswordChange,
  onLoginPress,
  onNavigateToSignUp,
}) => {
  return (
    <>
      <StatusBar backgroundColor="black" />
      <ImageBackground
        style={tw`flex-1 justify-center items-center px-5`}
        source={require('../Img/bg_lg.jpg')}
        resizeMode="cover"
      >
        <Image source={require('../Img/pen.png')} style={tw`w-40 h-40 mb-9`} />
        <View style={tw`w-full border-2 border-gray-300 bg-black/30 rounded-lg p-3 mb-4`}>
          <Text style={tw`text-2xl font-bold text-orange-200 mb-8 text-center`}>Xin chào !</Text>

          <TextInput
            style={tw`w-full border-2 border-orange-300 rounded-lg p-3 text-base mb-4 text-white`}
            placeholder="Nhập email"
            placeholderTextColor="white"
            keyboardType="email-address"
            value={email}
            onChangeText={onEmailChange}
          />

          <TextInput
            style={tw`w-full border-2 border-orange-300 rounded-lg p-3 text-base mb-4 text-white`}
            placeholder="Nhập mật khẩu"
            placeholderTextColor="white"
            secureTextEntry
            value={password}
            onChangeText={onPasswordChange}
          />

          <TouchableOpacity>
            <Text style={tw`text-white self-end mb-6`}>Quên mật khẩu?</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={tw`w-full bg-orange-400 py-4 rounded-lg mb-5 items-center`}
            onPress={onLoginPress}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text style={tw`text-white text-lg font-bold`}>Đăng Nhập</Text>
            )}
          </TouchableOpacity>

          <Text style={tw`text-white text-center`}>
            Bạn chưa có tài khoản?{' '}
            <Text style={tw`text-orange-500 font-bold`} onPress={onNavigateToSignUp}>
              Đăng ký
            </Text>
          </Text>
        </View>
      </ImageBackground>
    </>
  );
};

export default LoginView;
