import React, { useEffect, useState } from "react";
import { View, Text, FlatList, Image, Pressable, StyleSheet } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import AsyncStorage from '@react-native-async-storage/async-storage';

const FavoritesScreen = ({ navigation }) => {
  const [favorites, setFavorites] = useState([]);

  // Load favorite items from AsyncStorage when the component mounts
  useEffect(() => {
    const loadFavorites = async () => {
      try {
        const storedFavorites = await AsyncStorage.getItem('favorites');
        if (storedFavorites) {
          setFavorites(JSON.parse(storedFavorites));
        }
      } catch (error) {
        console.error('Error loading favorites:', error);
      }
    };

    const focusHandler = navigation.addListener('focus', () => {
      loadFavorites(); // Load favorites when navigating to the screen
    });

    return focusHandler;
  }, [navigation]);

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
    </Pressable>
  );

  if (favorites.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text>No favorites yet!</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={favorites}
      renderItem={renderItem}
      contentContainerStyle={styles.listContainer}
    />
  );
};

export default FavoritesScreen;

const styles = StyleSheet.create({
  emptyContainer: {
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
