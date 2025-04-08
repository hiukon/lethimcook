import React from 'react';
import { View, Text, Image, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import tw from 'twrnc';
import useRecipeListController from '../controllers/useRecipeListController';

const RecipeList = () => {
  const {
    recipes,
    loading,
    isAuthenticated,
    handlePressRecipe,
  } = useRecipeListController();

  if (!isAuthenticated) return null;
  if (loading) return <ActivityIndicator size="large" color="blue" />;

  return (
    <FlatList
      data={recipes}
      keyExtractor={(item) => item.id.toString()}
      horizontal
      nestedScrollEnabled={true}
      renderItem={({ item }) => (
        <View style={tw`m-2 items-center`}>
          <TouchableOpacity onPress={() => handlePressRecipe(item)}>
            <Image source={{ uri: item.image }} style={tw`w-24 h-24 rounded-lg`} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handlePressRecipe(item)}>
            <Text style={tw`text-l mt-1`}>{item.name}</Text>
          </TouchableOpacity>
          <Text style={tw`text-xs text-gray-500`}>{item.author}</Text>
        </View>
      )}
    />
  );
};

export default RecipeList;
