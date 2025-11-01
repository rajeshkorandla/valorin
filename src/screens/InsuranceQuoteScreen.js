import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  Platform,
  ActivityIndicator
} from 'react-native';
import Constants from 'expo-constants';

export default function InsuranceQuoteScreen({ navigation }) {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    insuranceType: '',
    coverageAmount: '',
    additionalInfo: '',
  });
  
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [selectedType, setSelectedType] = useState('');

  const insuranceTypes = [
    { id: 'health', label: 'Health Insurance', icon: '🏥' },
    { id: 'auto', label: 'Auto Insurance', icon: '🚗' },
    { id: 'life', label: 'Life Insurance', icon: '❤️' },
    { id: 'property', label: 'Property Insurance', icon: '🏠' },
    { id: 'business', label: 'Business Insurance', icon: '💼' },
  ];

  const validateForm = () => {
    const newErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    const phoneRegex = /^[\d\s\-\(\)]+$/;
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!phoneRegex.test(formData.phone) || formData.phone.replace(/\D/g, '').length < 10) {
      newErrors.phone = 'Please enter a valid phone number';
    }

    if (!selectedType) {
      newErrors.insuranceType = 'Please select an insurance type';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      Alert.alert('Validation Error', 'Please fill in all required fields correctly');
      return;
    }

    setLoading(true);

    try {
      const submitData = {
        ...formData,
        insuranceType: selectedType,
      };

      const apiUrl = Platform.OS === 'web' 
        ? 'http://localhost:3000/api/quote-request'
        : `http://${Constants.expoConfig?.hostUri?.split(':')[0]}:3000/api/quote-request`;

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submitData),
      });

      const data = await response.json();

      if (data.success) {
        Alert.alert(
          'Success',
          'Your quote request has been submitted! We will contact you shortly.',
          [
            {
              text: 'OK',
              onPress: () => navigation.goBack(),
            },
          ]
        );
        
        setFormData({
          fullName: '',
          email: '',
          phone: '',
          insuranceType: '',
          coverageAmount: '',
          additionalInfo: '',
        });
        setSelectedType('');
      } else {
        Alert.alert('Error', data.message || 'Failed to submit quote request');
      }
    } catch (error) {
      Alert.alert('Error', 'Unable to connect to server. Please try again.');
      console.error('Submission error:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const selectInsuranceType = (type) => {
    setSelectedType(type);
    if (errors.insuranceType) {
      setErrors(prev => ({ ...prev, insuranceType: '' }));
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Request Insurance Quote</Text>
        <Text style={styles.subtitle}>
          Get a personalized quote from our partner insurance companies
        </Text>

        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Full Name *</Text>
            <TextInput
              style={[styles.input, errors.fullName && styles.inputError]}
              value={formData.fullName}
              onChangeText={(value) => updateField('fullName', value)}
              placeholder="John Doe"
              placeholderTextColor="#9CA3AF"
            />
            {errors.fullName && <Text style={styles.errorText}>{errors.fullName}</Text>}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email Address *</Text>
            <TextInput
              style={[styles.input, errors.email && styles.inputError]}
              value={formData.email}
              onChangeText={(value) => updateField('email', value)}
              placeholder="john.doe@example.com"
              keyboardType="email-address"
              autoCapitalize="none"
              placeholderTextColor="#9CA3AF"
            />
            {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Phone Number *</Text>
            <TextInput
              style={[styles.input, errors.phone && styles.inputError]}
              value={formData.phone}
              onChangeText={(value) => updateField('phone', value)}
              placeholder="(555) 123-4567"
              keyboardType="phone-pad"
              placeholderTextColor="#9CA3AF"
            />
            {errors.phone && <Text style={styles.errorText}>{errors.phone}</Text>}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Insurance Type *</Text>
            <View style={styles.typeGrid}>
              {insuranceTypes.map((type) => (
                <TouchableOpacity
                  key={type.id}
                  style={[
                    styles.typeCard,
                    selectedType === type.id && styles.typeCardSelected
                  ]}
                  onPress={() => selectInsuranceType(type.id)}
                >
                  <Text style={styles.typeIcon}>{type.icon}</Text>
                  <Text style={[
                    styles.typeLabel,
                    selectedType === type.id && styles.typeLabelSelected
                  ]}>
                    {type.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            {errors.insuranceType && <Text style={styles.errorText}>{errors.insuranceType}</Text>}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Desired Coverage Amount</Text>
            <TextInput
              style={styles.input}
              value={formData.coverageAmount}
              onChangeText={(value) => updateField('coverageAmount', value)}
              placeholder="e.g., $100,000"
              placeholderTextColor="#9CA3AF"
            />
            <Text style={styles.helpText}>Optional: Enter your preferred coverage amount</Text>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Additional Information</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={formData.additionalInfo}
              onChangeText={(value) => updateField('additionalInfo', value)}
              placeholder="Tell us more about your insurance needs..."
              multiline
              numberOfLines={4}
              textAlignVertical="top"
              placeholderTextColor="#9CA3AF"
            />
            <Text style={styles.helpText}>Any specific requirements or questions?</Text>
          </View>

          <TouchableOpacity
            style={[styles.submitButton, loading && styles.submitButtonDisabled]}
            onPress={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.submitButtonText}>Request Quote</Text>
            )}
          </TouchableOpacity>

          <View style={styles.infoBox}>
            <Text style={styles.infoText}>
              💡 We'll review your request and get back to you within 24 hours with personalized quotes from our partner insurance companies.
            </Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  content: {
    padding: 20,
    maxWidth: 800,
    width: '100%',
    alignSelf: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 24,
    lineHeight: 24,
  },
  form: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
      web: {
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
      },
    }),
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#1F2937',
    backgroundColor: '#FFFFFF',
  },
  inputError: {
    borderColor: '#EF4444',
  },
  textArea: {
    minHeight: 100,
    paddingTop: 12,
  },
  errorText: {
    color: '#EF4444',
    fontSize: 12,
    marginTop: 4,
  },
  helpText: {
    color: '#6B7280',
    fontSize: 12,
    marginTop: 4,
  },
  typeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  typeCard: {
    flex: Platform.OS === 'web' ? 0 : 1,
    minWidth: Platform.OS === 'web' ? 140 : 'auto',
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  typeCardSelected: {
    borderColor: '#2563EB',
    backgroundColor: '#EFF6FF',
  },
  typeIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  typeLabel: {
    fontSize: 13,
    fontWeight: '500',
    color: '#374151',
    textAlign: 'center',
  },
  typeLabelSelected: {
    color: '#2563EB',
    fontWeight: '600',
  },
  submitButton: {
    backgroundColor: '#2563EB',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  submitButtonDisabled: {
    backgroundColor: '#93C5FD',
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  infoBox: {
    backgroundColor: '#FEF3C7',
    borderRadius: 8,
    padding: 16,
    marginTop: 20,
  },
  infoText: {
    color: '#92400E',
    fontSize: 14,
    lineHeight: 20,
  },
});
