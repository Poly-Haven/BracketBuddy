import React, { useEffect, useMemo, useRef } from 'react';
import {
  FlatList,
  NativeScrollEvent,
  NativeSyntheticEvent,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { ShutterSpeedOption } from '../utils/shutterSpeed';
import { theme } from '../utils/theme';

export const ITEM_HEIGHT = 48;
export const VISIBLE_ITEMS = 5;
export const LABEL_HEIGHT = 28;

type ShutterColumnProps = {
  label: string;
  options: ShutterSpeedOption[];
  selectedSeconds: number;
  onChange: (seconds: number) => void;
};

const findClosestIndex = (options: ShutterSpeedOption[], value: number) => {
  if (!options.length) {
    return 0;
  }

  let index = 0;
  let bestDistance = Math.abs(options[0].seconds - value);

  options.forEach((option, currentIndex) => {
    const distance = Math.abs(option.seconds - value);
    if (distance < bestDistance) {
      bestDistance = distance;
      index = currentIndex;
    }
  });

  return index;
};

export const ShutterColumn = ({
  label,
  options,
  selectedSeconds,
  onChange,
}: ShutterColumnProps) => {
  const listRef = useRef<FlatList<ShutterSpeedOption>>(null);
  const isInteractingRef = useRef(false);

  const selectedIndex = useMemo(
    () => findClosestIndex(options, selectedSeconds),
    [options, selectedSeconds]
  );

  useEffect(() => {
    if (!listRef.current) {
      return;
    }

    if (isInteractingRef.current) {
      return;
    }

    listRef.current.scrollToIndex({
      index: selectedIndex,
      animated: true,
      viewPosition: 0.5,
    });
  }, [selectedIndex]);

  const handleScrollEnd = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    const index = Math.round(offsetY / ITEM_HEIGHT);
    const option = options[index];
    if (option) {
      onChange(option.seconds);
    }
    isInteractingRef.current = false;
  };

  return (
    <View style={styles.container}>
      <View style={styles.labelContainer}>
        <Text style={styles.label}>{label}</Text>
      </View>
      <FlatList
        ref={listRef}
        data={options}
        keyExtractor={(item) => `${item.seconds}`}
        showsVerticalScrollIndicator={false}
        snapToInterval={ITEM_HEIGHT}
        snapToAlignment="center"
        decelerationRate="fast"
        onMomentumScrollEnd={handleScrollEnd}
        onScrollBeginDrag={() => {
          isInteractingRef.current = true;
        }}
        onScrollToIndexFailed={({ index }) => {
          listRef.current?.scrollToOffset({
            offset: index * ITEM_HEIGHT,
            animated: true,
          });
        }}
        contentContainerStyle={styles.listContent}
        getItemLayout={(_, index) => ({
          length: ITEM_HEIGHT,
          offset: ITEM_HEIGHT * index,
          index,
        })}
        style={styles.list}
        renderItem={({ item, index }) => {
          const isSelected = index === selectedIndex;
          return (
            <View style={styles.row}>
              <Text style={[styles.value, isSelected && styles.valueSelected]}>
                {item.label}
              </Text>
            </View>
          );
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flex: 1,
  },
  labelContainer: {
    height: LABEL_HEIGHT,
    justifyContent: 'center',
  },
  label: {
    color: theme.colors.textSecondary,
    fontSize: theme.fontSizes.sm,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  list: {
    height: ITEM_HEIGHT * VISIBLE_ITEMS,
    width: '100%',
  },
  listContent: {
    paddingVertical: (ITEM_HEIGHT * (VISIBLE_ITEMS - 1)) / 2,
  },
  row: {
    alignItems: 'center',
    height: ITEM_HEIGHT,
    justifyContent: 'center',
  },
  value: {
    color: theme.colors.textSecondary,
    fontSize: theme.fontSizes.lg,
    letterSpacing: 0.5,
  },
  valueSelected: {
    color: theme.colors.textPrimary,
    fontSize: theme.fontSizes.xl,
  },
});
