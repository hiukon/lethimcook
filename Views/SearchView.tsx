import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Alert, ScrollView, Image, FlatList } from 'react-native';
import Header from './header';
import SearchController from '@/controllers/SearchRecipe';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { RootStackParamList, SearchResult } from '@/types';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import tw from 'twrnc';


type SearchViewRouteProp = RouteProp<RootStackParamList, 'SearchView'>;

const SearchView: React.FC = () => {
  const route = useRoute<SearchViewRouteProp>();
  const searchQuery = 'searchQuery' in route.params ? route.params.searchQuery : '';
  const searchResults = 'searchResults' in route.params ? route.params.searchResults : [];
  const [searchTerm, setSearchTerm] = useState('');
  const [recipes, setRecipes] = useState<SearchResult[]>(searchResults);
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const showDetail = (recipe: SearchResult) => {
    navigation.navigate('BottomTabNavigator', {
      screen: 'Tìm kiếm',    
      params: {screen: 'Details', params: { recipe }}
    });  
  };

  return (
    <View style={tw`flex-1`}>
      <View style={tw`flex flex-row justify-center items-center bg-white px-[10px]`}>
        <TouchableOpacity style={tw`p-2`}>
          <Text style={tw`text-lg`} onPress={() => navigation.goBack()}>←</Text>
        </TouchableOpacity>
        
        <View style={tw`flex-1`} >
        <SearchController />
        </View>
        
        <View style={tw`ml-1`} >
        <Header />
        </View>
      </View>
      <ScrollView style={tw`bg-orange-50`}>
        {/* <Text style={tw`text-black text-2xl p-2`}>Món mới nhất</Text> */}
        <Text style={tw`text-black text-2xl p-2`}>Kết quả tìm kiếm cho: {searchQuery}</Text>
        {recipes.map(recipe => (
          <TouchableOpacity
            key={recipe.id}
            style={tw`flex-row bg-white shadow-md rounded-lg my-1 overflow-hidden`}
            onPress={() => showDetail(recipe)}
          >
            <Image source={{ uri: recipe.image }} style={tw`w-40 h-30 my-2 rounded-lg px-1`} />
            <View style={tw`flex-1 p-3`}>
              <Text style={tw`text-lg font-bold`}>{recipe.name}</Text>
              <Text style={tw`text-gray-500 mt-1`} numberOfLines={2}>
                {recipe.ingredients.join(', ')}
              </Text>
              <Text style={tw`text-orange-500 mt-2`}>👩‍🍳 {recipe.author}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
     
    </View>
    
  );
};

export default SearchView;