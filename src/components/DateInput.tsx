import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { formatDateInput } from '../utils';

interface DateInputProps {
  label?: string;
  value: Date | null;
  onChange: (date: Date | null) => void;
  placeholder?: string;
  minimumDate?: Date;
  maximumDate?: Date;
}

export function DateInput({
  label,
  value,
  onChange,
  placeholder = 'Selecionar',
  minimumDate,
  maximumDate,
}: DateInputProps) {
  const [showPicker, setShowPicker] = useState(false);

  const handleDateChange = (date: Date | null) => {
    onChange(date);
    setShowPicker(false);
  };

  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}

      {Platform.OS === 'web' ? (
        <input
          type="date"
          value={value ? value.toISOString().split('T')[0] : ''}
          onChange={(e) => {
            const date = e.target.value ? new Date(e.target.value) : null;
            handleDateChange(date);
          }}
          min={minimumDate ? minimumDate.toISOString().split('T')[0] : undefined}
          max={maximumDate ? maximumDate.toISOString().split('T')[0] : undefined}
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
        <>
          <TouchableOpacity
            style={styles.dateButton}
            onPress={() => setShowPicker(true)}
          >
            <Text style={styles.dateButtonText}>{formatDateInput(value, placeholder)}</Text>
            <Ionicons name="calendar" size={16} color="#666" />
          </TouchableOpacity>

          {showPicker && (
            <DateTimePicker
              value={value || new Date()}
              mode="date"
              display="default"
              onChange={(event, selectedDate) => {
                if (event.type === 'set' && selectedDate) {
                  handleDateChange(selectedDate);
                } else {
                  setShowPicker(false);
                }
              }}
              minimumDate={minimumDate}
              maximumDate={maximumDate}
            />
          )}
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    marginBottom: 8,
  },
  dateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F5F5F5',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    padding: 12,
  },
  dateButtonText: {
    fontSize: 14,
    color: '#333',
  },
});
