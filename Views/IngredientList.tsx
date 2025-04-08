import React, { useState } from 'react';
import { View, Text, Image, FlatList, Dimensions, TouchableOpacity, ActivityIndicator } from 'react-native';
import { ingredients } from '../models/ingredientsData';
import tw from 'twrnc';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/types';
import { handleIngredientSearch } from '../controllers/Ingredient';

const IngredientList: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [loading, setLoading] = useState(false);

  const { width } = Dimensions.get('window');

  return (
    <View>
      <Text style={tw`text-xl m-2`}>Nguyên Liệu Phổ Biến</Text>
      <FlatList
        style={tw`flex-1 rounded-lg`}
        data={ingredients}
        keyExtractor={(item) => item.id.toString()}
        nestedScrollEnabled={true}
        numColumns={2}
        renderItem={({ item }) => (
          <View style={{ width: width / 2 - 22, ...tw`items-center m-2.1` }}>
            <TouchableOpacity
              style={tw`relative rounded-lg overflow-hidden`}
              onPress={() => handleIngredientSearch(item.name, navigation, setLoading)}
            >
              <Image source={item.image} style={tw`w-49 h-33 rounded-lg`} />
              <Text style={tw`absolute bottom-0 text-white text-base font-bold p-1 w-full text-left`}>
                {item.name}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      />
      {loading && (
        <View style={tw`absolute top-0 left-0 right-0 bottom-0 justify-center items-center bg-black bg-opacity-30`}>
          <ActivityIndicator size="large" color="#fff" />
        </View>
      )}
    </View>
  );
};

export default IngredientList;
