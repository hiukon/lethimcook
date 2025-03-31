import React,{ useState } from 'react';
import { FlatList, Text, StyleSheet, View, TouchableOpacity, SafeAreaView } from 'react-native';
import Header from './header';
import IngredientList from './IngredientList';
import RecipeList from './RecipeList';
import tw from 'twrnc';
import SearchController from '@/controllers/SearchRecipe';
import BottomTabNavigator from '@/navigation/BottomTabNavigator';
import Sidebar from "./Sidebar"; 
import { useSafeAreaInsets } from "react-native-safe-area-context";

const HomeScreen = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const insets = useSafeAreaInsets();
  return (

        <View style={tw`flex-1 bg-white `}>
          <View>
            <View style={tw`flex-row items-center`}>
              <Header />
              <Text style={tw`text-black text-2xl p-2`}>Tìm kiếm</Text>
              <TouchableOpacity
                onPress={() => setSidebarOpen(true)}
                style={tw` item-center p-3  ml-auto rounded-lg`}>
                <Text style={tw`text-2xl font-semibold`}>☰ </Text>
              </TouchableOpacity>
            </View>   
          </View>
          <View style={tw`px-4`} >
            <SearchController/>
          </View>
        <View style={tw`flex-1 bg-orange-50  px-2 rounded-lg`}>
        <FlatList style={tw`flex-1 bg-orange-50  `}
          ListHeaderComponent={
            <>
              <IngredientList />
              <Text style={tw`mt-2 text-xl`}>Món ăn mới lên sóng</Text>
              <RecipeList/>
            </>
          }
          data={[]} 
          renderItem={null} 
          keyExtractor={(_, index) => index.toString()}
        />
        </View>
        {isSidebarOpen && <Sidebar isOpen={isSidebarOpen} closeMenu={() => setSidebarOpen(false)} />}
        </View>

  );
};



export default HomeScreen;
