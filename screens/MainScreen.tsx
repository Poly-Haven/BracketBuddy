import React, { useMemo, useState } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppState } from '../context/AppStateContext';
import { buildShutterSpeedOptions, isFullStopSeconds } from '../utils/shutterSpeed';
import { theme } from '../utils/theme';
import { SettingsScreen } from './SettingsScreen';

const ITEM_HEIGHT = 48;
const LABEL_HEIGHT = 28;

const getSequenceEmoji = (darkSeconds: number, brightSeconds: number): string => {
  const epsilon = 1e-6;

  // 1/8000 -> 1/2" (sunny day)
  if (Math.abs(darkSeconds - 1/8000) < epsilon && Math.abs(brightSeconds - 0.5) < epsilon) {
    return ' ☀️';
  }

  // 1/1000 -> 4" (indoor/house)
  if (Math.abs(darkSeconds - 1/1000) < epsilon && Math.abs(brightSeconds - 4) < epsilon) {
    return ' 🏠';
  }

  // 1/250 -> 15" (night/new moon)
  if (Math.abs(darkSeconds - 1/250) < epsilon && Math.abs(brightSeconds - 15) < epsilon) {
    return ' 🌚';
  }

  return '';
};

export const MainScreen = () => {
  const { settings } = useAppState();
  const [settingsVisible, setSettingsVisible] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [listHeight, setListHeight] = useState(0);
  const { height: windowHeight } = useWindowDimensions();

  const options = useMemo(
    () =>
      buildShutterSpeedOptions(
        settings.minShutterSeconds,
        settings.maxShutterSeconds,
        settings.includeThirdStops
      ),
    [
      settings.minShutterSeconds,
      settings.maxShutterSeconds,
      settings.includeThirdStops,
    ]
  );

  const half = Math.floor(settings.bracketCount / 2);
  const step = Math.max(
    1,
    settings.evSpacing * (settings.includeThirdStops ? 3 : 1)
  );
  const maxIndex = Math.max(0, options.length - 1);
  const displayOptions = useMemo(() => [...options].reverse(), [options]);
  const displayMaxIndex = Math.max(0, displayOptions.length - 1);
  const fallbackHeight = Math.max(0, windowHeight - theme.spacing.xl);
  const measuredHeight = listHeight > 0 ? listHeight : fallbackHeight;
  const contentPadding = Math.max(0, measuredHeight / 2 - ITEM_HEIGHT / 2);

  const rows = useMemo(() =>
    displayOptions
      .map((option, index) => {
        const darkIndex = index - step * half;
        const brightIndex = index + step * half;
        const dark = darkIndex >= 0 && darkIndex <= displayMaxIndex ? displayOptions[darkIndex] : null;
        const bright = brightIndex >= 0 && brightIndex <= displayMaxIndex ? displayOptions[brightIndex] : null;

        if (!bright || !dark) {
          return null;
        }

        return {
          midIndex: index,
          bright,
          mid: option,
          dark,
        };
      })
      .filter((row): row is { midIndex: number; bright: typeof displayOptions[0]; mid: typeof displayOptions[0]; dark: typeof displayOptions[0] } => !!row),
  [displayOptions, step, half, displayMaxIndex]);

  const activeIndex = useMemo(() => {
    if (!rows.length || listHeight <= 0) {
      return 0;
    }

    // Row center = contentPadding + index * ITEM_HEIGHT + ITEM_HEIGHT / 2
    // Align row center to visible center (scrollY + listHeight / 2)
    const centerY = scrollY + listHeight / 2 - contentPadding - ITEM_HEIGHT / 2;
    const rawIndex = Math.round(centerY / ITEM_HEIGHT);
    const clamped = Math.max(0, Math.min(rows.length - 1, rawIndex));
    return clamped;
  }, [rows, listHeight, scrollY, contentPadding]);

  const sequenceLabels = useMemo(() => {
    const activeRow = rows[activeIndex];
    if (!activeRow) {
      return [];
    }

    const labels: string[] = [];
    for (let offset = -half; offset <= half; offset += 1) {
      const index = activeRow.midIndex + offset * step;
      const option = displayOptions[index];
      if (option) {
        labels.push(option.label);
      }
    }

    return labels;
  }, [rows, activeIndex, options, half, step]);

  return (
    <View style={styles.container}>
    <View style={styles.header}>
      <View style={styles.headerLeft}>
        <Image
          source={require('../assets/icon.png')}
          style={styles.headerIcon}
        />
        <Text style={styles.title}>Bracket Buddy</Text>
      </View>
      <Pressable
        style={styles.settingsButton}
        onPress={() => setSettingsVisible(true)}
      >
        <Ionicons name="settings-outline" size={24} color={theme.colors.textSecondary} />
      </Pressable>
    </View>

      <View style={styles.columns}>
        <View style={styles.labelsRow}>
          <Text style={styles.label}>Dark</Text>
          <Text style={styles.label}>Mid</Text>
          <Text style={styles.label}>Bright</Text>
        </View>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[styles.scrollContent, { paddingTop: contentPadding, paddingBottom: contentPadding }]}
          onLayout={(event) => {
            setListHeight(event.nativeEvent.layout.height);
          }}
          onScroll={(event) => {
            setScrollY(event.nativeEvent.contentOffset.y);
          }}
          scrollEventThrottle={16}
        >
          {rows.map((row, index) => {
            const isActive = index === activeIndex;
            const brightIsFull = isFullStopSeconds(row.bright.seconds);
            const midIsFull = isFullStopSeconds(row.mid.seconds);
            const darkIsFull = isFullStopSeconds(row.dark.seconds);
            const showThirdStops = settings.includeThirdStops;

            return (
              <View key={`${row.mid.seconds}`} style={[styles.row, isActive && styles.activeRow]}>
                <Text
                  style={[
                    styles.value,
                    styles.sideValue,
                    showThirdStops && !darkIsFull && styles.thirdStopValue,
                    isActive && styles.activeValue,
                  ]}
                >
                  {row.dark.label}
                </Text>
                <Text
                  style={[
                    styles.value,
                    styles.midValue,
                    showThirdStops && !midIsFull && styles.thirdStopValue,
                    isActive && styles.activeValue,
                    isActive && styles.activeMidValue,
                  ]}
                >
                  {row.mid.label}{getSequenceEmoji(row.dark.seconds, row.bright.seconds)}
                </Text>
                <Text
                  style={[
                    styles.value,
                    styles.sideValue,
                    showThirdStops && !brightIsFull && styles.thirdStopValue,
                    isActive && styles.activeValue,
                  ]}
                >
                  {row.bright.label}
                </Text>
              </View>
            );
          })}
        </ScrollView>
      </View>

      <View style={styles.footer}>
        <Pressable style={styles.footerLeft} onPress={() => setSettingsVisible(true)}>
          <Text style={styles.footerLabel}>
            {settings.bracketCount}x{settings.evSpacing} EVs
          </Text>
          <Text style={styles.footerLabel}>
            DR:{(settings.bracketCount - 1) * settings.evSpacing}
          </Text>
        </Pressable>
        <Text style={styles.sequenceText}>
          {sequenceLabels.join(' · ')}
        </Text>
      </View>

      <SettingsScreen
        visible={settingsVisible}
        onClose={() => setSettingsVisible(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    paddingHorizontal: theme.spacing.md,
    paddingTop: theme.spacing.xl,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
  },
  headerIcon: {
    width: 40,
    height: 40,
    borderRadius: 8,
  },
  title: {
    color: theme.colors.textPrimary,
    fontSize: theme.fontSizes.xl,
    letterSpacing: 1,
  },
  settingsButton: {
    padding: theme.spacing.sm,
  },
  columns: {
    flex: 1,
    paddingBottom: theme.spacing.lg,
  },
  labelsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.sm,
    marginBottom: theme.spacing.sm,
  },
  label: {
    color: theme.colors.textSecondary,
    fontSize: theme.fontSizes.sm,
    letterSpacing: 1,
    textTransform: 'uppercase',
    width: '33.33%',
    textAlign: 'center',
  },
  scrollContent: {
    paddingHorizontal: theme.spacing.sm,
  },
  row: {
    height: ITEM_HEIGHT,
    flexDirection: 'row',
    alignItems: 'center',
  },
  value: {
    color: theme.colors.textSecondary,
    fontSize: theme.fontSizes.lg,
    width: '33.33%',
    textAlign: 'center',
  },
  sideValue: {
    color: theme.colors.textSecondary,
  },
  midValue: {
    color: theme.colors.textPrimary,
    fontSize: theme.fontSizes.xl,
  },
  thirdStopValue: {
    opacity: 0.6,
    fontSize: theme.fontSizes.md,
  },
  activeRow: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
  },
  activeValue: {
    color: '#000000',
  },
  activeMidValue: {
    fontSize: theme.fontSizes.xl,
    letterSpacing: 0.5,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: theme.spacing.lg,
    paddingHorizontal: theme.spacing.xs,
  },
  footerLeft: {
    flexDirection: 'row',
    gap: theme.spacing.md,
    alignItems: 'center',
  },
  footerLabel: {
    color: theme.colors.textSecondary,
    fontSize: theme.fontSizes.sm,
    fontWeight: '600',
  },
  sequenceText: {
    color: theme.colors.textSecondary,
    fontSize: theme.fontSizes.sm,
    textAlign: 'right',
    flex: 1,
  },
});
