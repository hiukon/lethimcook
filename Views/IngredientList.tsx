import React, { useState } from 'react';
import { View, Text, Image, FlatList, Dimensions, TouchableOpacity } from 'react-native';
import tw from 'twrnc';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/types';
import { ingredients } from '@/models/ingredientsData';
import { handleIngredientSearch } from '@/controllers/ingredientList';

type SearchViewRouteProp = RouteProp<RootStackParamList, 'RecipeList'>;

const IngredientList: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<SearchViewRouteProp>();
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
          <View style={tw`w-[${width / 2 - 22}px] items-center m-2.1`}>
            <TouchableOpacity
              style={tw`relative rounded-lg overflow-hidden`}
              onPress={() => handleIngredientSearch(item.name, navigation, setLoading)} >
              <Image source={item.image} style={tw`w-49 h-33 rounded-lg`} />
              <Text style={tw`absolute bottom-0 text-white text-base font-bold p-1 w-full p-2 text-left`}>
                {item.name}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
};

export default IngredientList;
