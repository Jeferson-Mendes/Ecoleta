import React, { useState, useEffect } from 'react';
import Constants from 'expo-constants';
import { Feather } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { View, StyleSheet, Image, TouchableOpacity, Alert, ScrollView } from 'react-native';

import { Text, Switch, useTheme } from 'react-native-paper';

import MapView, { Marker } from 'react-native-maps';
import { SvgUri } from 'react-native-svg';
import * as Location from 'expo-location';
import api from '../../services/api';


interface Item {
  id: number;
  title: string;
  img_url: string;
}

interface Point {
  id: number;
  name: string;
  image: string;
  img_url: string;
  latitude: number;
  longitude: number;
}

interface Params {
  uf: string;
  city: string;
}

const Points = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [points, setPoints] = useState<Point[]>([]);
  const [selectedItem, setSelectedItem] = useState<number[]>([])
  const [initialPosition, setInitialPosition] = useState<[number, number]>([0, 0])

  

  const navigation = useNavigation()
  const route = useRoute()

  const { colors, dark } = useTheme()


  const routeParams = route.params as Params

  useEffect(() => {
    async function loadposition() {
      const { status } = await Location.requestPermissionsAsync();

      if (status !== 'granted') {
        Alert.alert('Ooops..', 'Precisamos de sua permissão para obter a localização');
        return;
      }

      const location = await Location.getCurrentPositionAsync();

      const { latitude, longitude } = location.coords;

      setInitialPosition([
        latitude,
        longitude
      ])
    }

    loadposition();
  }, [])

  useEffect(() => {
    api.get('items').then(response => {
      setItems(response.data)
    })
  }, [])

  useEffect(() => {
    api.get('points', {
      params: {
        city: routeParams.city,
        uf: routeParams.uf,
        items: selectedItem
      }
    }).then(response => {
      setPoints(response.data)
    })
  }, [selectedItem])


  function handleNavigateBack() {
    navigation.goBack();
  }

  function handleNavigateToDerail(id: number) {
    navigation.navigate('Detail', { point_id: id } )
  }

  function handleSelectedItem(id: number) {
    const alreadySelected = selectedItem.findIndex(item => item === id);

    if (alreadySelected >= 0) {
      const filteredItems = selectedItem.filter(item => item !== id);

      setSelectedItem(filteredItems)

    } else {
      setSelectedItem([...selectedItem, id]);
    }

  }

  
  
 
  return (
    <>
      <View style={styles.container}>
        <TouchableOpacity onPress={handleNavigateBack}>
          <Feather name="arrow-left" size={20} color="#34cb79" />

        </TouchableOpacity>
        <View>
              <Switch
                style={{marginTop:-20}}
                trackColor={{ false: "#222831", true: "#ececec" }}
                thumbColor={dark ? "#ececec" : "#222831" }
                onValueChange={colors.toggleSwitch}
                // thumbColor={isEnabledDarkTheme ? "white" : "black"}  
                value={dark}
              />
          </View>

        <Text style={[
          styles.title,
          //{color: colors.titleColor}
          ]}>Bem vindo.</Text>
        <Text style={styles.description}>Encontre no mapa um ponto de coleta.</Text>

        <View style={styles.mapContainer}>
          {initialPosition[0] !== 0 && (
            <MapView
              style={styles.map}
              loadingEnabled={initialPosition[0] === 0}
              initialRegion={{
                latitude: initialPosition[0],
                longitude: initialPosition[1],
                latitudeDelta: 0.014,
                longitudeDelta: 0.014
              }}
            >
              {points.map(point => (
                <Marker
                  key={String(point.id)}
                  onPress={() => handleNavigateToDerail(1)}
                  style={styles.mapMarker}
                  coordinate={{
                    latitude: initialPosition[0],
                    longitude: initialPosition[1],
                  }}
                >
                  <View style={[styles.mapMarkerContainer, {backgroundColor: colors.border } ]}>
                    <Image style={styles.mapMarkerImage} source={{ uri: point.img_url }} />
                    <Text style={styles.mapMarkerTitle}>{point.name}</Text>
                  </View>
                </Marker>
              ))}

            </MapView>
          )}
        </View>
      </View>
      <View style={styles.itemsContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 20 }}
        >

          {items.map(item => (
            <TouchableOpacity
              key={String(item.id)}
              style={[
                styles.item,
                selectedItem.includes(item.id) ? styles.selectedItem : {},
                {backgroundColor: colors.card}
              ]}
              activeOpacity={0.6}
              onPress={() => handleSelectedItem(item.id)}>

              <SvgUri width={42} height={42} uri={item.img_url} />
              <Text style={styles.itemTitle}> {item.title} </Text>
            </TouchableOpacity>
          ))}



        </ScrollView>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 32,
    paddingTop: 20 + Constants.statusBarHeight,
  },

  title: {
    fontSize: 20,
    fontFamily: 'Ubuntu_700Bold',
    marginTop: 24,
  },

  description: {
    color: '#6C6C80',
    fontSize: 16,
    marginTop: 4,
    fontFamily: 'Roboto_400Regular',
  },

  mapContainer: {
    flex: 1,
    width: '100%',
    borderRadius: 10,
    overflow: 'hidden',
    marginTop: 16,
  },

  map: {
    width: '100%',
    height: '100%',
  },

  mapMarker: {
    width: 90,
    height: 80,
  },

  mapMarkerContainer: {
    width: 90,
    height: 70,
    flexDirection: 'column',
    borderRadius: 8,
    overflow: 'hidden',
    alignItems: 'center'
  },

  mapMarkerImage: {
    width: 90,
    height: 45,
    resizeMode: 'cover',
  },

  mapMarkerTitle: {
    flex: 1,
    fontFamily: 'Roboto_400Regular',
    color: '#FFF',
    fontSize: 13,
    lineHeight: 23,
  },

  itemsContainer: {
    flexDirection: 'row',
    marginTop: 16,
    marginBottom: 32,
  },

  item: {
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#eee',
    height: 120,
    width: 120,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 16,
    marginRight: 8,
    alignItems: 'center',
    justifyContent: 'space-between',

    textAlign: 'center',
  },

  selectedItem: {
    borderColor: '#34CB79',
    borderWidth: 2,
  },

  itemTitle: {
    fontFamily: 'Roboto_400Regular',
    textAlign: 'center',
    fontSize: 13,
  },
});

export default Points;