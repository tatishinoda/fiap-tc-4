import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import React, { useEffect, useState } from 'react';
import {
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { colors } from '../theme/colors';
import { TransactionType } from '../types';
import { SUGGESTED_CATEGORIES, TRANSACTION_TYPE_CONFIG } from '../utils/constants';
import { CategoryChips } from './CategoryChips';
import { CurrencyInput } from './CurrencyInput';

export interface FilterOptions {
  dateFrom: Date | null;
  dateTo: Date | null;
  categories: string[];
  types: TransactionType[];
  amountMin: string;
  amountMax: string;
  sortBy: 'date-desc' | 'date-asc' | 'amount-desc' | 'amount-asc';
}

interface AdvancedFiltersModalProps {
  visible: boolean;
  onClose: () => void;
  onApply: (filters: FilterOptions) => void;
  initialFilters?: FilterOptions;
  availableCategories?: string[];
}

const DEFAULT_FILTERS: FilterOptions = {
  dateFrom: null,
  dateTo: null,
  categories: [],
  types: [],
  amountMin: '',
  amountMax: '',
  sortBy: 'date-desc',
};

export function AdvancedFiltersModal({
  visible,
  onClose,
  onApply,
  initialFilters = DEFAULT_FILTERS,
  availableCategories = [],
}: AdvancedFiltersModalProps) {
  const [filters, setFilters] = useState<FilterOptions>(initialFilters);
  const [showDateFromPicker, setShowDateFromPicker] = useState(false);
  const [showDateToPicker, setShowDateToPicker] = useState(false);
  const [expandedSection, setExpandedSection] = useState<string | null>('date');

  useEffect(() => {
    if (visible) {
      setFilters(initialFilters);
    }
  }, [visible, initialFilters]);

  // Combine user's actual categories with suggested ones, removing duplicates
  const suggestedCategories = Array.from(
    new Set(
      Object.values(SUGGESTED_CATEGORIES).flat()
    )
  );

  // Prioritize user's actual categories, then add suggested ones
  const allCategories = Array.from(
    new Set([...availableCategories, ...suggestedCategories])
  ).sort();

  const transactionTypes = Object.keys(TRANSACTION_TYPE_CONFIG) as TransactionType[];

  const toggleCategory = (category: string) => {
    setFilters(prev => ({
      ...prev,
      categories: prev.categories.includes(category)
        ? prev.categories.filter(c => c !== category)
        : [...prev.categories, category],
    }));
  };

  const toggleType = (type: TransactionType) => {
    setFilters(prev => ({
      ...prev,
      types: prev.types.includes(type)
        ? prev.types.filter(t => t !== type)
        : [...prev.types, type],
    }));
  };

  const handleReset = () => {
    setFilters(DEFAULT_FILTERS);
  };

  const handleApply = () => {
    onApply(filters);
    onClose();
  };

  const formatDate = (date: Date | null) => {
    if (!date) return 'Selecionar';
    return date.toLocaleDateString('pt-BR');
  };

  const handleDateFromChange = (date: Date | null) => {
    if (date) {
      setFilters(prev => ({ ...prev, dateFrom: date }));
    }
    setShowDateFromPicker(false);
  };

  const handleDateToChange = (date: Date | null) => {
    if (date) {
      setFilters(prev => ({ ...prev, dateTo: date }));
    }
    setShowDateToPicker(false);
  };

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const hasActiveFilters = () => {
    return (
      filters.dateFrom !== null ||
      filters.dateTo !== null ||
      filters.categories.length > 0 ||
      filters.types.length > 0 ||
      filters.amountMin !== '' ||
      filters.amountMax !== '' ||
      filters.sortBy !== 'date-desc'
    );
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modal}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Filtros Avançados</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color="#333" />
            </TouchableOpacity>
          </View>

          {/* Content */}
          <ScrollView
            style={styles.content}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {/* Date Range Section */}
            <TouchableOpacity
              style={styles.section}
              onPress={() => toggleSection('date')}
              activeOpacity={0.7}
            >
              <View style={styles.sectionHeader}>
                <View style={styles.sectionTitleRow}>
                  <Ionicons name="calendar-outline" size={20} color={colors.brand.forest} />
                  <Text style={styles.sectionTitle}>Período</Text>
                </View>
                <Ionicons
                  name={expandedSection === 'date' ? 'chevron-up' : 'chevron-down'}
                  size={20}
                  color="#666"
                />
              </View>
            </TouchableOpacity>

            {expandedSection === 'date' && (
              <View style={styles.sectionContent}>
                <View style={styles.dateRow}>
                  <View style={styles.dateField}>
                    <Text style={styles.label}>De:</Text>
                    {Platform.OS === 'web' ? (
                      <input
                        type="date"
                        value={filters.dateFrom ? filters.dateFrom.toISOString().split('T')[0] : ''}
                        onChange={(e) => {
                          const date = e.target.value ? new Date(e.target.value) : null;
                          handleDateFromChange(date);
                        }}
                        style={{
                          padding: '12px',
                          fontSize: '14px',
                          borderRadius: '8px',
                          border: '1px solid #E0E0E0',
                          backgroundColor: '#F5F5F5',
                          width: '100%',
                          fontFamily: 'system-ui',
                        }}
                      />
                    ) : (
                      <TouchableOpacity
                        style={styles.dateButton}
                        onPress={() => setShowDateFromPicker(true)}
                      >
                        <Text style={styles.dateButtonText}>
                          {formatDate(filters.dateFrom)}
                        </Text>
                        <Ionicons name="calendar" size={16} color="#666" />
                      </TouchableOpacity>
                    )}
                  </View>

                  <View style={styles.dateField}>
                    <Text style={styles.label}>Até:</Text>
                    {Platform.OS === 'web' ? (
                      <input
                        type="date"
                        value={filters.dateTo ? filters.dateTo.toISOString().split('T')[0] : ''}
                        onChange={(e) => {
                          const date = e.target.value ? new Date(e.target.value) : null;
                          handleDateToChange(date);
                        }}
                        style={{
                          padding: '12px',
                          fontSize: '14px',
                          borderRadius: '8px',
                          border: '1px solid #E0E0E0',
                          backgroundColor: '#F5F5F5',
                          width: '100%',
                          fontFamily: 'system-ui',
                        }}
                      />
                    ) : (
                      <TouchableOpacity
                        style={styles.dateButton}
                        onPress={() => setShowDateToPicker(true)}
                      >
                        <Text style={styles.dateButtonText}>
                          {formatDate(filters.dateTo)}
                        </Text>
                        <Ionicons name="calendar" size={16} color="#666" />
                      </TouchableOpacity>
                    )}
                  </View>
                </View>

                {(filters.dateFrom || filters.dateTo) && (
                  <TouchableOpacity
                    style={styles.clearButton}
                    onPress={() => setFilters(prev => ({ ...prev, dateFrom: null, dateTo: null }))}
                  >
                    <Text style={styles.clearButtonText}>Limpar datas</Text>
                  </TouchableOpacity>
                )}
              </View>
            )}

            {/* Transaction Types Section */}
            <TouchableOpacity
              style={styles.section}
              onPress={() => toggleSection('types')}
              activeOpacity={0.7}
            >
              <View style={styles.sectionHeader}>
                <View style={styles.sectionTitleRow}>
                  <Ionicons name="swap-horizontal-outline" size={20} color={colors.brand.forest} />
                  <Text style={styles.sectionTitle}>Tipos de Transação</Text>
                  {filters.types.length > 0 && (
                    <View style={styles.badge}>
                      <Text style={styles.badgeText}>{filters.types.length}</Text>
                    </View>
                  )}
                </View>
                <Ionicons
                  name={expandedSection === 'types' ? 'chevron-up' : 'chevron-down'}
                  size={20}
                  color="#666"
                />
              </View>
            </TouchableOpacity>

            {expandedSection === 'types' && (
              <View style={styles.sectionContent}>
                {transactionTypes.map(type => (
                  <TouchableOpacity
                    key={type}
                    style={styles.checkboxRow}
                    onPress={() => toggleType(type)}
                    activeOpacity={0.7}
                  >
                    <View style={[
                      styles.checkbox,
                      filters.types.includes(type) && styles.checkboxChecked
                    ]}>
                      {filters.types.includes(type) && (
                        <Ionicons name="checkmark" size={16} color="#FFFFFF" />
                      )}
                    </View>
                    <View style={styles.typeInfo}>
                      <Text style={styles.checkboxLabel}>
                        {TRANSACTION_TYPE_CONFIG[type].label}
                      </Text>
                      <Text style={styles.typeDescription}>
                        {TRANSACTION_TYPE_CONFIG[type].description}
                      </Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            )}

            {/* Amount Range Section */}
            <TouchableOpacity
              style={styles.section}
              onPress={() => toggleSection('amount')}
              activeOpacity={0.7}
            >
              <View style={styles.sectionHeader}>
                <View style={styles.sectionTitleRow}>
                  <Ionicons name="cash-outline" size={20} color={colors.brand.forest} />
                  <Text style={styles.sectionTitle}>Valor</Text>
                </View>
                <Ionicons
                  name={expandedSection === 'amount' ? 'chevron-up' : 'chevron-down'}
                  size={20}
                  color="#666"
                />
              </View>
            </TouchableOpacity>

            {expandedSection === 'amount' && (
              <View style={styles.sectionContent}>
                <View style={styles.amountRow}>
                  <View style={styles.amountField}>
                    <CurrencyInput
                      label="Mínimo:"
                      value={filters.amountMin}
                      onChangeValue={(value) => setFilters(prev => ({ ...prev, amountMin: value }))}
                      showIcon={false}
                    />
                  </View>

                  <View style={styles.amountField}>
                    <CurrencyInput
                      label="Máximo:"
                      value={filters.amountMax}
                      onChangeValue={(value) => setFilters(prev => ({ ...prev, amountMax: value }))}
                      showIcon={false}
                    />
                  </View>
                </View>
                {(filters.amountMin !== '' || filters.amountMax !== '') && (
                  <TouchableOpacity
                    style={styles.clearButton}
                    onPress={() => setFilters(prev => ({ ...prev, amountMin: '', amountMax: '' }))}
                  >
                    <Text style={styles.clearButtonText}>Limpar valores</Text>
                  </TouchableOpacity>
                )}
              </View>
            )}

            {/* Sort Section */}
            <TouchableOpacity
              style={styles.section}
              onPress={() => toggleSection('sort')}
              activeOpacity={0.7}
            >
              <View style={styles.sectionHeader}>
                <View style={styles.sectionTitleRow}>
                  <Ionicons name="filter-outline" size={20} color={colors.brand.forest} />
                  <Text style={styles.sectionTitle}>Ordenação</Text>
                </View>
                <Ionicons
                  name={expandedSection === 'sort' ? 'chevron-up' : 'chevron-down'}
                  size={20}
                  color="#666"
                />
              </View>
            </TouchableOpacity>

            {expandedSection === 'sort' && (
              <View style={styles.sectionContent}>
                {[
                  { value: 'date-desc', label: 'Data (mais recente)', icon: 'arrow-down' },
                  { value: 'date-asc', label: 'Data (mais antiga)', icon: 'arrow-up' },
                  { value: 'amount-desc', label: 'Valor (maior)', icon: 'arrow-down' },
                  { value: 'amount-asc', label: 'Valor (menor)', icon: 'arrow-up' },
                ].map(option => (
                  <TouchableOpacity
                    key={option.value}
                    style={styles.radioRow}
                    onPress={() => setFilters(prev => ({ ...prev, sortBy: option.value as any }))}
                    activeOpacity={0.7}
                  >
                    <View style={[
                      styles.radio,
                      filters.sortBy === option.value && styles.radioChecked
                    ]}>
                      {filters.sortBy === option.value && (
                        <View style={styles.radioDot} />
                      )}
                    </View>
                    <Text style={styles.radioLabel}>{option.label}</Text>
                    <Ionicons name={option.icon as any} size={16} color="#666" />
                  </TouchableOpacity>
                ))}
              </View>
            )}

                        {/* Categories Section */}
            <TouchableOpacity
              style={styles.section}
              onPress={() => toggleSection('categories')}
              activeOpacity={0.7}
            >
              <View style={styles.sectionHeader}>
                <View style={styles.sectionTitleRow}>
                  <Ionicons name="pricetags-outline" size={20} color={colors.brand.forest} />
                  <Text style={styles.sectionTitle}>Categorias</Text>
                  {filters.categories.length > 0 && (
                    <View style={styles.badge}>
                      <Text style={styles.badgeText}>{filters.categories.length}</Text>
                    </View>
                  )}
                </View>
                <Ionicons
                  name={expandedSection === 'categories' ? 'chevron-up' : 'chevron-down'}
                  size={20}
                  color="#666"
                />
              </View>
            </TouchableOpacity>

            {expandedSection === 'categories' && (
              <View style={styles.sectionContent}>
                <CategoryChips
                  categories={allCategories}
                  selectedCategories={filters.categories}
                  onCategoryPress={toggleCategory}
                  multiSelect={true}
                />
                {filters.categories.length > 0 && (
                  <TouchableOpacity
                    style={styles.clearButton}
                    onPress={() => setFilters(prev => ({ ...prev, categories: [] }))}
                  >
                    <Text style={styles.clearButtonText}>Limpar categorias</Text>
                  </TouchableOpacity>
                )}
              </View>
            )}
          </ScrollView>

          {/* Footer */}
          <View style={styles.footer}>
            {hasActiveFilters() && (
              <TouchableOpacity
                style={styles.resetButton}
                onPress={handleReset}
                activeOpacity={0.7}
              >
                <Ionicons name="refresh-outline" size={18} color="#666" />
                <Text style={styles.resetButtonText}>Limpar Tudo</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              style={styles.applyButton}
              onPress={handleApply}
              activeOpacity={0.7}
            >
              <Text style={styles.applyButtonText}>Aplicar Filtros</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Date Pickers - Only render on native platforms */}
      {Platform.OS !== 'web' && showDateFromPicker && (
        <DateTimePicker
          value={filters.dateFrom || new Date()}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={(event, date) => {
            handleDateFromChange(date || null);
          }}
        />
      )}

      {Platform.OS !== 'web' && showDateToPicker && (
        <DateTimePicker
          value={filters.dateTo || new Date()}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={(event, date) => {
            handleDateToChange(date || null);
          }}
        />
      )}
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modal: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '90%',
    height: '90%',
    paddingTop: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  closeButton: {
    padding: 4,
  },
  content: {
    flexGrow: 1,
    flexShrink: 1,
    paddingTop: 8,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  section: {
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  badge: {
    backgroundColor: colors.brand.forest,
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 2,
    minWidth: 24,
    alignItems: 'center',
  },
  badgeText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  sectionContent: {
    paddingHorizontal: 24,
    paddingBottom: 16,
  },
  dateRow: {
    flexDirection: 'row',
    gap: 12,
  },
  dateField: {
    flex: 1,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
    marginBottom: 8,
  },
  dateButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  dateButtonText: {
    fontSize: 14,
    color: '#333',
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 12,
    gap: 12,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#D0D0D0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: colors.brand.forest,
    borderColor: colors.brand.forest,
  },
  checkboxLabel: {
    fontSize: 15,
    color: '#333',
    fontWeight: '500',
  },
  typeInfo: {
    flex: 1,
  },
  typeDescription: {
    fontSize: 13,
    color: '#999',
    marginTop: 2,
  },
  amountRow: {
    flexDirection: 'row',
    gap: 12,
  },
  amountField: {
    flex: 1,
  },
  radioRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    gap: 12,
  },
  radio: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#D0D0D0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioChecked: {
    borderColor: colors.brand.forest,
  },
  radioDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.brand.forest,
  },
  radioLabel: {
    flex: 1,
    fontSize: 15,
    color: '#333',
  },
  clearButton: {
    marginTop: 12,
    padding: 8,
    alignItems: 'center',
  },
  clearButtonText: {
    fontSize: 14,
    color: colors.brand.forest,
    fontWeight: '500',
  },
  footer: {
    flexDirection: 'row',
    gap: 12,
    padding: 24,
    paddingBottom: Platform.OS === 'ios' ? 32 : 24,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    backgroundColor: '#FFFFFF',
  },
  resetButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderRadius: 12,
  },
  resetButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#666',
  },
  applyButton: {
    flex: 1,
    backgroundColor: colors.brand.forest,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  applyButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
});
