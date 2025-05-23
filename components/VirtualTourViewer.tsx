import React, { useState, useRef } from 'react';
import { StyleSheet, View, Text, PanResponder, Animated } from 'react-native';
import { useTheme } from '@/components/ThemeContext';

interface VirtualTourViewerProps {
  images: string[];
  hotspots?: {
    id: string;
    x: number;
    y: number;
    title: string;
    description?: string;
  }[];
}

export default function VirtualTourViewer({ images, hotspots = [] }: VirtualTourViewerProps) {
  const { colors } = useTheme();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [scale, setScale] = useState(1);
  const pan = useRef(new Animated.ValueXY()).current;
  const lastScale = useRef(1);
  const lastDistance = useRef(0);

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: () => true,
    onPanResponderGrant: () => {
      pan.setOffset({
        x: pan.x._value,
        y: pan.y._value,
      });
      pan.setValue({ x: 0, y: 0 });
    },
    onPanResponderMove: (evt, gestureState) => {
      const touches = evt.nativeEvent.touches;
      if (touches.length === 2) {
        const touch1 = touches[0];
        const touch2 = touches[1];
        const distance = Math.sqrt(
          Math.pow(touch2.pageX - touch1.pageX, 2) +
          Math.pow(touch2.pageY - touch1.pageY, 2)
        );

        if (lastDistance.current === 0) {
          lastDistance.current = distance;
        }

        const newScale = (distance / lastDistance.current) * lastScale.current;
        setScale(Math.min(Math.max(newScale, 0.5), 3));
      } else {
        Animated.event([null, { dx: pan.x, dy: pan.y }], {
          useNativeDriver: false,
        })(evt, gestureState);
      }
    },
    onPanResponderRelease: () => {
      lastScale.current = scale;
      lastDistance.current = 0;
      pan.flattenOffset();
    },
  });

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <View style={styles.container}>
      <Animated.Image
        source={{ uri: images[currentImageIndex] }}
        style={[
          styles.image,
          {
            transform: [
              { translateX: pan.x },
              { translateY: pan.y },
              { scale },
            ],
          },
        ]}
        {...panResponder.panHandlers}
      />

      {hotspots.map((hotspot) => (
        <View
          key={hotspot.id}
          style={[
            styles.hotspot,
            {
              left: `${hotspot.x}%`,
              top: `${hotspot.y}%`,
              backgroundColor: colors.primary,
            },
          ]}
        >
          <View style={[styles.tooltip, { backgroundColor: colors.surface }]}>
            <Text style={[styles.tooltipTitle, { color: colors.text }]}>
              {hotspot.title}
            </Text>
            {hotspot.description && (
              <Text style={[styles.tooltipDescription, { color: colors.textSecondary }]}>
                {hotspot.description}
              </Text>
            )}
          </View>
        </View>
      ))}

      <View style={styles.controls}>
        <TouchableOpacity
          style={[styles.controlButton, { backgroundColor: colors.primary }]}
          onPress={prevImage}
        >
          <ChevronLeft size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.controlButton, { backgroundColor: colors.primary }]}
          onPress={nextImage}
        >
          <ChevronRight size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  hotspot: {
    position: 'absolute',
    width: 20,
    height: 20,
    borderRadius: 10,
    marginLeft: -10,
    marginTop: -10,
  },
  tooltip: {
    position: 'absolute',
    bottom: 30,
    left: -100,
    width: 200,
    padding: 12,
    borderRadius: 8,
  },
  tooltipTitle: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    marginBottom: 4,
  },
  tooltipDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
  },
  controls: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  controlButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
});