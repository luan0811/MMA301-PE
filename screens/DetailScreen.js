import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, ScrollView } from 'react-native';
import { getArtToolById } from '../services/api'; // API service

const DetailScreen = ({ route }) => {
  const { id } = route.params; // Get the ID passed from HomeScreen
  const [artTool, setArtTool] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArtToolDetails = async () => {
      try {
        const data = await getArtToolById(id);
        setArtTool(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchArtToolDetails();
  }, [id]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading details...</Text>
      </View>
    );
  }

  if (!artTool) {
    return (
      <View style={styles.loadingContainer}>
        <Text>No art tool found!</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image source={{ uri: artTool.image }} style={styles.artImage} />
      <Text style={styles.artName}>{artTool.artName}</Text>
      <Text style={styles.price}>Price: ${artTool.price}</Text>
      <Text style={styles.description}>{artTool.description}</Text>
      {artTool.limitedTimeDeal > 0 && (
        <Text style={styles.limitedDeal}>Limited Time Deal: {artTool.limitedTimeDeal * 100}% off</Text>
      )}
    </ScrollView>
  );
};

export default DetailScreen;

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    padding: 16,
  },
  artImage: {
    width: '100%',
    height: 300,
    borderRadius: 10,
  },
  artName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  price: {
    fontSize: 20,
    color: 'green',
    marginVertical: 8,
  },
  description: {
    fontSize: 16,
    color: '#333',
  },
  limitedDeal: {
    fontSize: 16,
    color: 'red',
    marginTop: 10,
  },
});
