import React, { useEffect, useState } from 'react';
import { View, TextInput, ActivityIndicator, TouchableOpacity } from 'react-native';
import axios from 'axios';
import tw from 'twrnc';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/types';

const API_BASE_URL = 'http://192.168.31.188:3000/api';//ct
// const API_BASE_URL = 'http://172.20.10.2:3000/api';//ip

const RecipeList = () => {
    const [recipes, setRecipes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]); // State to store search results
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>(); // Get navigation object with type

    useEffect(() => {
        fetchRecipes();
    }, []);

    const fetchRecipes = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/recipes`);
            setRecipes(response.data);
        } catch (error) {
            console.error("Lỗi khi lấy danh sách công thức:", error);
        } finally {
            setLoading(false);
        }
    };

    const searchRecipes = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/search?q=${searchQuery}`);
            setSearchResults(response.data); // Store search results
            //  navigation.navigate('SearchView', { searchResults: response.data }); 
            navigation.navigate('BottomTabNavigator', {
                screen: 'Tìm kiếm',    
                params: {screen: 'Search', params: { searchResults: response.data }}
              });
        } catch (error) {
            console.error("Lỗi khi tìm kiếm công thức:", error);
        }
    };

    if (loading) return <ActivityIndicator size="large" color="blue" />;

    return (
        
        <View style={tw`flex p-1`}>
            <View style={tw` flex-row items-center border rounded-2xl px-2 bg-orange-50 mb-1`}>
                <TextInput
                    placeholder="Nhập món ăn cần tìm..."
                    placeholderTextColor="gray"
                    style={tw`flex-1 h-8 text-xs leading-none px-2`}
                    value={searchQuery}
                    onChangeText={(text) => setSearchQuery(text)}
                    underlineColorAndroid="transparent"
                />
                <TouchableOpacity onPress={searchRecipes}>
                    <Icon name="search" size={20} color="gray" />
                </TouchableOpacity>
            </View>
        </View>
        
    );
};

export default RecipeList;