import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  Pressable,
  StyleSheet,
} from "react-native";
import { getArtTools } from "../services/api";
import Ionicons from "react-native-vector-icons/Ionicons";
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage

const HomeScreen = ({ navigation }) => {
  const [artTools, setArtTools] = useState([]);
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState([]); // State for favorites

  // Fetch the art tools when the component mounts
  useEffect(() => {
    const fetchArtTools = async () => {
      try {
        const data = await getArtTools();
        setArtTools(data);

        // Load favorites from AsyncStorage when the app starts
        const storedFavorites = await AsyncStorage.getItem('favorites');
        if (storedFavorites) {
          setFavorites(JSON.parse(storedFavorites));
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchArtTools();
  }, []);

  // Save favorite tools to AsyncStorage
  const saveFavorites = async (newFavorites) => {
    try {
      await AsyncStorage.setItem('favorites', JSON.stringify(newFavorites));
      setFavorites(newFavorites);
    } catch (error) {
      console.error('Error saving favorites:', error);
    }
  };

  // Toggle favorite
  const toggleFavorite = (item) => {
    let newFavorites = [...favorites];
    if (newFavorites.some(fav => fav.id === item.id)) {
      // If item is already in favorites, remove it
      newFavorites = newFavorites.filter(fav => fav.id !== item.id);
    } else {
      // Otherwise, add the item to favorites
      newFavorites.push(item);
    }
    saveFavorites(newFavorites);
  };

  // Check if the item is in favorites
  const isFavorite = (item) => {
    return favorites.some(fav => fav.id === item.id);
  };

  // Render an item in the FlatList
  const renderItem = ({ item }) => (
    <Pressable
      onPress={() => navigation.navigate("Detail", { id: item.id })}
      style={styles.itemContainer}
    >
      <Image source={{ uri: item.image }} style={styles.itemImage} />
      <View style={styles.itemDetails}>
        <Text style={styles.itemName}>{item.artName}</Text>
        <Text style={styles.itemPrice}>${item.price}</Text>
        {item.limitedTimeDeal > 0 && (
          <Text style={styles.limitedDeal}>
            Limited Time Deal: {item.limitedTimeDeal * 100}% off
          </Text>
        )}
      </View>
      {/* Add heart icon */}
      <Ionicons
        name={isFavorite(item) ? "heart" : "heart-outline"}
        size={24}
        color={isFavorite(item) ? "tomato" : "gray"}
        style={styles.heartIcon}
        onPress={() => toggleFavorite(item)}
      />
    </Pressable>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading art tools...</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={artTools}
      renderItem={renderItem}
      keyExtractor={(item) => item.id.toString()}
      contentContainerStyle={styles.listContainer}
    />
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  heartIcon: {
    alignSelf: "center",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  listContainer: {
    padding: 16,
  },
  itemContainer: {
    flexDirection: "row",
    marginBottom: 16,
    backgroundColor: "#fff",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    padding: 12,
  },
  itemImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
  },
  itemDetails: {
    marginLeft: 16,
    flex: 1,
    justifyContent: "center",
  },
  itemName: {
    fontSize: 18,
    fontWeight: "bold",
  },
  itemPrice: {
    fontSize: 16,
    color: "#888",
    marginVertical: 4,
  },
  limitedDeal: {
    fontSize: 14,
    color: "green",
  },
});
