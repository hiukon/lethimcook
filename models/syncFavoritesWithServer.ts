import NetInfo from "@react-native-community/netinfo";
import AsyncStorage from "@react-native-async-storage/async-storage";

const syncFavoritesWithServer = async (userId: any) => {
    try {
        const netInfo = await NetInfo.fetch(); // Lấy thông tin kết nối mạng
        if (!netInfo.isConnected) {
            console.log("Không có kết nối mạng, lưu tạm vào AsyncStorage.");
            return;
        }

        let favorites = await AsyncStorage.getItem("favorites");
        favorites = favorites ? JSON.parse(favorites) : [];


        if (!favorites || favorites.length === 0) {
          return;
        }

        await fetch("http://192.168.31.188:3000/api/favorites/add", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId, recipeIds: favorites })
        });

        // Sau khi đồng bộ, xóa dữ liệu cục bộ
        await AsyncStorage.removeItem("favorites");
        console.log("Đồng bộ thành công!");
    } catch (error) {
        console.error("Lỗi đồng bộ với server", error);
    }
};

export {syncFavoritesWithServer};
