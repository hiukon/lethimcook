// views/IngredientList.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, Image, FlatList, Dimensions, TouchableOpacity } from 'react-native';
import tw from 'twrnc';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/types';
import { ingredients } from '@/models/ingredientsData';
import { handleIngredientSearch } from '@/controllers/ingredientList';

const IngredientList: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [loading, setLoading] = useState(false);
  const [randomIngredients, setRandomIngredients] = useState<{ id: string; name: string; image: any }[]>([]);
  const { width } = Dimensions.get('window');

  const getRandomIngredients = () => {
    const shuffled = [...ingredients].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 10);
  };

  useEffect(() => {
    setRandomIngredients(getRandomIngredients());
  }, []);

  const onIngredientPress = async (ingredientName: string) => {
    const result = await handleIngredientSearch(ingredientName, setLoading);
    if (result.success && result.results) {
      navigation.navigate('SearchView', {
        searchQuery: ingredientName,
        searchResults: result.results,
      });
    }
  };

  return (
    <View>
      <Text style={tw`text-xl m-2`}>Nguyên Liệu ngon hôm nay</Text>
      <FlatList
        style={tw`flex-1 rounded-lg`}
        data={randomIngredients}
        keyExtractor={(item) => item.id.toString()}
        nestedScrollEnabled={true}
        scrollEnabled={false}
        numColumns={2}
        renderItem={({ item }) => (
          <View style={{ width: width / 2 - 10, alignItems: 'center', margin: 5 }}>
            <TouchableOpacity
              style={tw`relative rounded-lg overflow-hidden`}
              onPress={() => onIngredientPress(item.name)}>
              <Image source={item.image} style={tw`w-49 h-33 rounded-lg`} />
              <Text style={tw`absolute bottom-0 text-white text-base font-bold p-2 w-full text-left`}>
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
