import React from 'react';
import {StyleSheet, View} from 'react-native';
import MapView, {Marker, Polygon} from 'react-native-maps';

export default function App() {
  const building = {
    center: {
      latitude: 21.043895545614177,
      longitude: 105.91721837483749,
    },
    rotation: 28,
    dimensions: {
      width: 17.111005822857987,
      height: 7.475907564396567,
    },
    name: 'Home',
  };

  const getPolygonCoordinates = () => {
    const {center, dimensions, rotation} = building;
    const {width, height} = dimensions;

    const metersToLat = 1 / 111111;
    const metersToLong =
      1 / (111111 * Math.cos((center.latitude * Math.PI) / 180));

    const halfWidth = (width / 2) * metersToLong;
    const halfHeight = (height / 2) * metersToLat;

    const corners = [
      {lat: center.latitude - halfHeight, lng: center.longitude - halfWidth},
      {lat: center.latitude - halfHeight, lng: center.longitude + halfWidth},
      {lat: center.latitude + halfHeight, lng: center.longitude + halfWidth},
      {lat: center.latitude + halfHeight, lng: center.longitude - halfWidth},
    ];

    const rotationRad = (rotation * Math.PI) / 180;
    return corners.map(corner => {
      const dx = corner.lng - center.longitude;
      const dy = corner.lat - center.latitude;

      const rotatedX = dx * Math.cos(rotationRad) - dy * Math.sin(rotationRad);
      const rotatedY = dx * Math.sin(rotationRad) + dy * Math.cos(rotationRad);

      return {
        latitude: center.latitude + rotatedY,
        longitude: center.longitude + rotatedX,
      };
    });
  };

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: building.center.latitude,
          longitude: building.center.longitude,
          latitudeDelta: 0.001,
          longitudeDelta: 0.001,
        }}
        scrollEnabled={true}
        zoomEnabled={true}
        pitchEnabled={true}
        showsUserLocation={true}>
        <Polygon
          coordinates={getPolygonCoordinates()}
          strokeColor="#000000"
          fillColor="rgba(255, 0, 0, 0.3)"
          strokeWidth={2}
        />
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: '100%',
    height: '100%',
  },
});

