import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors } from '../theme/colors';

interface CategoryChipsProps {
  categories: string[];
  selectedCategories: string[];
  onCategoryPress: (category: string) => void;
  multiSelect?: boolean;
  showLabel?: boolean;
  labelText?: string;
}

export function CategoryChips({
  categories,
  selectedCategories,
  onCategoryPress,
  multiSelect = false,
  showLabel = false,
  labelText = 'Sugestões:',
}: CategoryChipsProps) {
  const isCategorySelected = (category: string) => {
    return multiSelect
      ? selectedCategories.includes(category)
      : selectedCategories[0] === category;
  };

  if (categories.length === 0) return null;

  return (
    <View style={styles.container}>
      {showLabel && <Text style={styles.label}>{labelText}</Text>}
      <View style={styles.chipsContainer}>
        {categories.map((category) => {
          const isSelected = isCategorySelected(category);
          return (
            <TouchableOpacity
              key={category}
              style={[styles.chip, isSelected && styles.chipActive]}
              onPress={() => onCategoryPress(category)}
              activeOpacity={0.7}
            >
              <Text style={[styles.chipText, isSelected && styles.chipTextActive]}>
                {category}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 12,
  },
  label: {
    fontSize: 12,
    fontWeight: '500',
    color: '#666',
    marginBottom: 8,
  },
  chipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    backgroundColor: '#F5F5F5',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  chipActive: {
    backgroundColor: colors.brand.forest,
    borderColor: colors.brand.forest,
  },
  chipText: {
    fontSize: 13,
    color: '#666',
    fontWeight: '500',
  },
  chipTextActive: {
    color: '#FFFFFF',
  },
});
