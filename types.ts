// types.ts
export interface SearchResult {
    _id: string;
    id: number;
    name: string;
    author: string;
    image: string;
    ingredients: string[];
    steps: string[];
}

export type RootStackParamList = {
    RecipeList: undefined;
    Details: { recipe: SearchResult };
    BottomTabNavigator: {
        screen: string;
        params: { screen: string, params: object  };
        
      }; 
    Drawer: undefined;  
    SignUp: undefined;
    Login: undefined;
    HomeScreen: undefined;
    Home: undefined;
    HomeLogin: undefined;
    FavoriteRecipes : undefined;
    SearchView: { searchResults: SearchResult[] }; // Add SearchView with expected params
};