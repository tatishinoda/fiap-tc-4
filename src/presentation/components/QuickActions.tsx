import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface QuickAction {
  id: string;
  title: string;
  icon: string;
  color: string;
  onPress: () => void;
}

interface QuickActionsProps {
  actions: QuickAction[];
}

/**
 * Quick Actions Component
 * Card flutuante elevado posicionado sobre o card de saldo
 */
export function QuickActions({ actions }: QuickActionsProps) {
  return (
    <View style={styles.floatingCard}>
      {actions.map((action, index) => (
        <React.Fragment key={action.id}>
          {index > 0 && <View style={styles.divider} />}
          <TouchableOpacity
            style={styles.actionButton}
            onPress={action.onPress}
            activeOpacity={0.7}
          >
            <View style={[styles.iconCircle, { backgroundColor: action.color }]}>
              <Ionicons name={action.icon as any} size={20} color="#FFFFFF" />
            </View>
            <Text style={styles.actionText}>
              {action.title}
            </Text>
          </TouchableOpacity>
        </React.Fragment>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  floatingCard: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingVertical: 18,
    paddingHorizontal: 16,
    marginHorizontal: 20,
    marginTop: -40,
    marginBottom: 24,
  },
  actionButton: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    paddingVertical: 4,
  },
  divider: {
    width: 1,
    height: 44,
    backgroundColor: '#e5e5e5',
    marginHorizontal: 4,
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  actionText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1a1a1a',
    textAlign: 'center',
    letterSpacing: -0.1,
  },
});
