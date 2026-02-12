import React, { useEffect, useMemo, useState } from 'react';
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  View,
} from 'react-native';
import { useAppState } from '../context/AppStateContext';
import { formatShutterSpeed, getAllShutterSpeedOptions } from '../utils/shutterSpeed';
import { theme } from '../utils/theme';

const bracketOptions = [3, 5, 7, 9, 11];
const spacingOptions = [1, 2, 3];

type SettingsScreenProps = {
  visible: boolean;
  onClose: () => void;
};

export const SettingsScreen = ({ visible, onClose }: SettingsScreenProps) => {
  const { settings, updateSettings, resetSettings } = useAppState();
  const [showMinPicker, setShowMinPicker] = useState(false);
  const [showMaxPicker, setShowMaxPicker] = useState(false);

  const availableOptions = useMemo(
    () => getAllShutterSpeedOptions(settings.includeThirdStops),
    [settings.includeThirdStops]
  );

  const maxPreview = useMemo(
    () =>
      formatShutterSpeed(
        settings.maxShutterSeconds,
        settings.includeThirdStops
      ),
    [settings.maxShutterSeconds, settings.includeThirdStops]
  );

  const minPreview = useMemo(
    () =>
      formatShutterSpeed(
        settings.minShutterSeconds,
        settings.includeThirdStops
      ),
    [settings.minShutterSeconds, settings.includeThirdStops]
  );

  const handleSelectMin = (seconds: number) => {
    if (seconds < settings.maxShutterSeconds) {
      updateSettings({ minShutterSeconds: seconds });
      setShowMinPicker(false);
    }
  };

  const handleSelectMax = (seconds: number) => {
    if (seconds > settings.minShutterSeconds) {
      updateSettings({ maxShutterSeconds: seconds });
      setShowMaxPicker(false);
    }
  };

  const handleClose = () => {
    setShowMinPicker(false);
    setShowMaxPicker(false);
    onClose();
  };

  return (
    <Modal visible={visible} animationType="fade" transparent>
      <Pressable style={styles.backdrop} onPress={handleClose}>
        <Pressable onPress={() => {}}>
          <View style={styles.card}>
          <Text style={styles.title}>Settings</Text>

          <Text style={styles.sectionLabel}>Bracket count</Text>
          <View style={styles.row}>
            {bracketOptions.map((option) => (
              <Pressable
                key={option}
                onPress={() => updateSettings({ bracketCount: option })}
                style={[
                  styles.option,
                  settings.bracketCount === option && styles.optionActive,
                ]}
              >
                <Text style={styles.optionText}>{option}</Text>
              </Pressable>
            ))}
          </View>

          <Text style={styles.sectionLabel}>EV spacing</Text>
          <View style={styles.row}>
            {spacingOptions.map((option) => (
              <Pressable
                key={option}
                onPress={() => updateSettings({ evSpacing: option })}
                style={[
                  styles.option,
                  settings.evSpacing === option && styles.optionActive,
                ]}
              >
                <Text style={styles.optionText}>{option} EV</Text>
              </Pressable>
            ))}
          </View>

          <Text style={styles.sectionLabel}>Camera limits</Text>
          <View style={styles.cameraLimitsContainer}>
            <Pressable
              style={styles.limitButton}
              onPress={() => setShowMinPicker(true)}
            >
              <Text style={styles.limitLabel}>Min (darkest)</Text>
              <Text style={styles.limitValue}>{minPreview}</Text>
            </Pressable>
            <Pressable
              style={styles.limitButton}
              onPress={() => setShowMaxPicker(true)}
            >
              <Text style={styles.limitLabel}>Max (brightest)</Text>
              <Text style={styles.limitValue}>{maxPreview}</Text>
            </Pressable>
          </View>

          <View style={styles.switchRow}>
            <Text style={styles.switchLabel}>Enable 1/3 stops</Text>
            <Switch
              value={settings.includeThirdStops}
              onValueChange={(value) => updateSettings({ includeThirdStops: value })}
            />
          </View>

          <Pressable style={styles.closeButton} onPress={handleClose}>
            <Text style={styles.closeButtonText}>Done</Text>
          </Pressable>

          <Pressable
            style={styles.resetButton}
            onPress={() => {
              resetSettings();
            }}
          >
            <Text style={styles.resetButtonText}>Reset to defaults</Text>
          </Pressable>
        </View>
        </Pressable>
      </Pressable>

      {/* Min Shutter Speed Picker */}
      <Modal
        visible={showMinPicker}
        animationType="fade"
        transparent
        onRequestClose={() => setShowMinPicker(false)}
      >
        <Pressable style={styles.pickerBackdrop} onPress={() => setShowMinPicker(false)}>
          <Pressable onPress={() => {}}>
            <View style={styles.pickerCard}>
            <Text style={styles.pickerTitle}>Select Min Speed (Darkest)</Text>
            <ScrollView style={styles.pickerScroll}>
              {availableOptions.map((option) => (
                <Pressable
                  key={option.label}
                  style={[
                    styles.pickerOption,
                    Math.abs(option.seconds - settings.minShutterSeconds) < 1e-6 &&
                      styles.pickerOptionSelected,
                  ]}
                  onPress={() => handleSelectMin(option.seconds)}
                >
                  <Text
                    style={[
                      styles.pickerOptionText,
                      Math.abs(option.seconds - settings.minShutterSeconds) < 1e-6 &&
                        styles.pickerOptionTextSelected,
                    ]}
                  >
                    {option.label}
                  </Text>
                </Pressable>
              ))}
            </ScrollView>
            <Pressable
              style={styles.pickerCloseButton}
              onPress={() => setShowMinPicker(false)}
            >
              <Text style={styles.pickerCloseButtonText}>Cancel</Text>
            </Pressable>
          </View>
          </Pressable>
        </Pressable>
      </Modal>

      {/* Max Shutter Speed Picker */}
      <Modal
        visible={showMaxPicker}
        animationType="fade"
        transparent
        onRequestClose={() => setShowMaxPicker(false)}
      >
        <Pressable style={styles.pickerBackdrop} onPress={() => setShowMaxPicker(false)}>
          <Pressable onPress={() => {}}>
            <View style={styles.pickerCard}>
            <Text style={styles.pickerTitle}>Select Max Speed (Brightest)</Text>
            <ScrollView style={styles.pickerScroll}>
              {availableOptions.map((option) => (
                <Pressable
                  key={option.label}
                  style={[
                    styles.pickerOption,
                    Math.abs(option.seconds - settings.maxShutterSeconds) < 1e-6 &&
                      styles.pickerOptionSelected,
                  ]}
                  onPress={() => handleSelectMax(option.seconds)}
                >
                  <Text
                    style={[
                      styles.pickerOptionText,
                      Math.abs(option.seconds - settings.maxShutterSeconds) < 1e-6 &&
                        styles.pickerOptionTextSelected,
                    ]}
                  >
                    {option.label}
                  </Text>
                </Pressable>
              ))}
            </ScrollView>
            <Pressable
              style={styles.pickerCloseButton}
              onPress={() => setShowMaxPicker(false)}
            >
              <Text style={styles.pickerCloseButtonText}>Cancel</Text>
            </Pressable>
          </View>
          </Pressable>
        </Pressable>
      </Modal>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(11, 12, 15, 0.9)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing.lg,
  },
  card: {
    width: '100%',
    backgroundColor: theme.colors.surface,
    borderRadius: 20,
    padding: theme.spacing.lg,
  },
  title: {
    color: theme.colors.textPrimary,
    fontSize: theme.fontSizes.xl,
    marginBottom: theme.spacing.md,
  },
  sectionLabel: {
    color: theme.colors.textSecondary,
    fontSize: theme.fontSizes.sm,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.sm,
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.sm,
  },
  option: {
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 14,
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  optionActive: {
    borderColor: theme.colors.accent,
    backgroundColor: 'rgba(94, 168, 255, 0.2)',
  },
  optionText: {
    color: theme.colors.textPrimary,
    fontSize: theme.fontSizes.md,
  },
  inputRow: {
    flexDirection: 'row',
    gap: theme.spacing.md,
  },
  inputBlock: {
    flex: 1,
  },
  inputLabel: {
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.xs,
  },
  input: {
    borderWidth: 1,
    borderColor: theme.colors.line,
    borderRadius: 12,
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.sm,
    color: theme.colors.textPrimary,
  },
  cameraLimitsContainer: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
  },
  limitButton: {
    flex: 1,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 12,
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  limitLabel: {
    color: theme.colors.textSecondary,
    fontSize: theme.fontSizes.sm,
    marginBottom: theme.spacing.xs,
  },
  limitValue: {
    color: theme.colors.textPrimary,
    fontSize: theme.fontSizes.lg,
    fontWeight: '600',
  },
  pickerBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(11, 12, 15, 0.9)',
    justifyContent: 'flex-end',
  },
  pickerCard: {
    backgroundColor: theme.colors.surface,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingVertical: theme.spacing.md,
    maxHeight: '80%',
  },
  pickerTitle: {
    color: theme.colors.textPrimary,
    fontSize: theme.fontSizes.md,
    fontWeight: '600',
    textAlign: 'center',
    paddingHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.md,
  },
  pickerScroll: {
    paddingHorizontal: theme.spacing.lg,
  },
  pickerOption: {
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 10,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.md,
    marginBottom: theme.spacing.sm,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  pickerOptionSelected: {
    borderColor: theme.colors.accent,
    backgroundColor: 'rgba(94, 168, 255, 0.2)',
  },
  pickerOptionText: {
    color: theme.colors.textSecondary,
    fontSize: theme.fontSizes.md,
    textAlign: 'center',
  },
  pickerOptionTextSelected: {
    color: theme.colors.accent,
    fontWeight: '600',
  },
  pickerCloseButton: {
    marginTop: theme.spacing.md,
    marginHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    alignItems: 'center',
    borderRadius: 10,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    marginBottom: theme.spacing.lg,
  },
  pickerCloseButtonText: {
    color: theme.colors.textSecondary,
    fontSize: theme.fontSizes.md,
  },
  switchRow: {
    marginTop: theme.spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  switchLabel: {
    color: theme.colors.textPrimary,
    fontSize: theme.fontSizes.md,
  },
  closeButton: {
    marginTop: theme.spacing.md,
    paddingVertical: theme.spacing.md,
    alignItems: 'center',
    borderRadius: 16,
    backgroundColor: theme.colors.accent,
  },
  closeButtonText: {
    color: theme.colors.background,
    fontSize: theme.fontSizes.md,
    fontWeight: '600',
  },
  resetButton: {
    marginTop: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    alignItems: 'center',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  resetButtonText: {
    color: theme.colors.textSecondary,
    fontSize: theme.fontSizes.md,
  },
});
