import React, { useEffect, useState } from 'react';
import { View, TextInput, ActivityIndicator, TouchableOpacity } from 'react-native';
import axios from 'axios';
import tw from 'twrnc';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/types';
import { API_BASE_URL } from '../config';


const SearchRecipe = () => {
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
        if (!searchQuery.trim()) {
            alert('Vui lòng nhập từ khóa tìm kiếm!');
            return;
        }
        try {
            setLoading(true);
            const response = await axios.get(`${API_BASE_URL}/search?q=${searchQuery}`);
            const results = response.data;
    
            if (results.length === 0) {
                alert('Không tìm thấy kết quả nào!');
                return;
            }
    
            // Điều hướng đến màn hình hiển thị kết quả
            navigation.navigate('SearchView', { searchQuery: searchQuery, searchResults: results });
        } catch (error) {
            console.error("Lỗi khi tìm kiếm công thức:", error);
            alert('Đã xảy ra lỗi khi tìm kiếm. Vui lòng thử lại!');
        } finally {
            setLoading(false);
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

export default SearchRecipe;