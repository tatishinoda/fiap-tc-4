import React, { Component, ReactNode } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: React.ErrorInfo;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('❌ ErrorBoundary caught an error:', error);
    console.error('Error details:', errorInfo);
    this.setState({ error, errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return (
        <View style={styles.container}>
          <ScrollView contentContainerStyle={styles.content}>
            <Text style={styles.title}>⚠️ Erro na Aplicação</Text>
            <Text style={styles.message}>
              Algo deu errado. Por favor, verifique o console para mais detalhes.
            </Text>
            {this.state.error && (
              <>
                <Text style={styles.errorTitle}>Erro:</Text>
                <Text style={styles.errorText}>{this.state.error.toString()}</Text>
              </>
            )}
            {this.state.errorInfo && (
              <>
                <Text style={styles.errorTitle}>Stack Trace:</Text>
                <Text style={styles.errorText}>
                  {this.state.errorInfo.componentStack}
                </Text>
              </>
            )}
            <Text style={styles.hint}>
              💡 Possíveis soluções:{'\n'}
              • Verifique se o arquivo .env está configurado{'\n'}
              • Confirme se as variáveis do Firebase estão corretas{'\n'}
              • Limpe o cache: npx expo start -c{'\n'}
              • Verifique o console do navegador para mais detalhes
            </Text>
          </ScrollView>
        </View>
      );
    }

    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    padding: 20,
    paddingTop: 60,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#e74c3c',
  },
  message: {
    fontSize: 16,
    marginBottom: 24,
    color: '#2c3e50',
    lineHeight: 24,
  },
  errorTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
    color: '#34495e',
  },
  errorText: {
    fontSize: 12,
    fontFamily: 'monospace',
    backgroundColor: '#f5f5f5',
    padding: 12,
    borderRadius: 4,
    color: '#c0392b',
    marginBottom: 16,
  },
  hint: {
    fontSize: 14,
    backgroundColor: '#e8f4f8',
    padding: 16,
    borderRadius: 8,
    color: '#2c3e50',
    lineHeight: 22,
    marginTop: 16,
  },
});
