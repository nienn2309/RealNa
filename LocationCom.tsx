import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { Card } from 'react-native-paper';

interface LocationData {
  coordinate?: {
    latitude: number;
    longitude: number;
  };
  floorIdentifier?: string;
  isIndoor?: boolean;
}

interface LocationMapProps {
  location: LocationData | null;
}

const LocationMap: React.FC<LocationMapProps> = ({ location }) => {
  // Constants for visualization
  const CANVAS_WIDTH = Dimensions.get('window').width - 32; // Full width minus padding
  const CANVAS_HEIGHT = 400;
  const MARKER_SIZE = 12;
  
  // Helper to convert coordinates to canvas position
  const getMarkerPosition = (lat: number, lng: number) => {
    // This is a simple linear mapping - in a real app you'd want to use proper map projection
    // These values should be adjusted based on your actual coordinate ranges
    const x = ((lng - 105.91) * 10000) % CANVAS_WIDTH;
    const y = ((21.04 - lat) * 10000) % CANVAS_HEIGHT;
    return { x, y };
  };

  const markerPosition = location?.coordinate ? 
    getMarkerPosition(location.coordinate.latitude, location.coordinate.longitude) :
    { x: CANVAS_WIDTH / 2, y: CANVAS_HEIGHT / 2 };

  return (
    <Card style={styles.card}>
      <Card.Content>
        <View style={styles.mapContainer}>
          {/* Grid lines for reference */}
          {[...Array(20)].map((_, i) => (
            <View
              key={`grid-h-${i}`}
              style={[
                styles.gridLine,
                {
                  top: `${(i + 1) * (100 / 20)}%`,
                  width: '100%',
                  height: 1,
                }
              ]}
            />
          ))}
          {[...Array(20)].map((_, i) => (
            <View
              key={`grid-v-${i}`}
              style={[
                styles.gridLine,
                {
                  left: `${(i + 1) * (100 / 20)}%`,
                  height: '100%',
                  width: 1,
                }
              ]}
            />
          ))}

          {/* Location marker */}
          <View 
            style={[
              styles.markerContainer,
              {
                left: markerPosition.x,
                top: markerPosition.y,
              }
            ]}
          >
            <View style={styles.markerPulse} />
            <View style={styles.markerDot} />
          </View>

          {/* Coordinates display */}
          <View style={styles.coordinatesContainer}>
            {location?.coordinate ? (
              <>
                <Text style={styles.coordinateText}>
                  Lat: {location.coordinate.latitude.toFixed(6)}
                </Text>
                <Text style={styles.coordinateText}>
                  Lng: {location.coordinate.longitude.toFixed(6)}
                </Text>
                <Text style={styles.coordinateText}>
                  Floor: {location.floorIdentifier || 'Outside'}
                </Text>
              </>
            ) : (
              <Text style={styles.coordinateText}>No location data</Text>
            )}
          </View>
        </View>
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 16,
    marginVertical: 8,
  },
  mapContainer: {
    width: '100%',
    height: 400,
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    overflow: 'hidden',
    position: 'relative',
  },
  gridLine: {
    position: 'absolute',
    backgroundColor: '#E2E8F0',
  },
  markerContainer: {
    position: 'absolute',
    width: 12,
    height: 12,
    transform: [
      { translateX: -6 },
      { translateY: -6 }
    ],
  },
  markerPulse: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(59, 130, 246, 0.25)',
    borderRadius: 6,
    opacity: 0.5,
  },
  markerDot: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: '#2563EB',
    borderRadius: 6,
  },
  coordinatesContainer: {
    position: 'absolute',
    bottom: 8,
    left: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    padding: 8,
    borderRadius: 4,
  },
  coordinateText: {
    fontSize: 12,
    color: '#1F2937',
  },
});

export default LocationMap;