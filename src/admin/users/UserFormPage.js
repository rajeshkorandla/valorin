import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { ArrowLeft, Save, User, Mail, Phone, Building, Briefcase, Shield } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { useUser, useCreateUser, useUpdateUser, useDepartments } from '../hooks/useSupabase';

export default function UserFormPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = !!id;

  const { data: user, isLoading: loadingUser } = useUser(id);
  const { data: departments } = useDepartments();
  const createUser = useCreateUser();
  const updateUser = useUpdateUser();

  const [formData, setFormData] = useState({
    email: '',
    full_name: '',
    role: 'employee',
    department: '',
    job_title: '',
    employee_id: '',
    phone: '',
    vendor_company_name: '',
    vendor_type: '',
    status: 'active',
    timezone: 'America/New_York',
    preferred_language: 'en',
  });

  useEffect(() => {
    if (user) {
      setFormData({
        email: user.email || '',
        full_name: user.full_name || '',
        role: user.role || 'employee',
        department: user.department || '',
        job_title: user.job_title || '',
        employee_id: user.employee_id || '',
        phone: user.phone || '',
        vendor_company_name: user.vendor_company_name || '',
        vendor_type: user.vendor_type || '',
        status: user.status || 'active',
        timezone: user.timezone || 'America/New_York',
        preferred_language: user.preferred_language || 'en',
      });
    }
  }, [user]);

  const handleSubmit = async () => {
    try {
      if (isEdit) {
        await updateUser.mutateAsync({ id, data: formData });
      } else {
        await createUser.mutateAsync(formData);
      }
      navigate('/admin/users');
    } catch (error) {
      alert('Error saving user: ' + error.message);
    }
  };

  const updateField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (loadingUser && isEdit) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Loading user...</Text>
      </View>
    );
  }

  const showVendorFields = formData.role === 'vendor';
  const showEmployeeFields = formData.role === 'employee' || formData.role === 'admin';

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigate('/admin/users')} style={styles.backButton}>
          <ArrowLeft size={20} color="#6B7280" />
          <Text style={styles.backText}>Back to Users</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.saveButton} onPress={handleSubmit}>
          <Save size={18} color="#FFFFFF" />
          <Text style={styles.saveButtonText}>{isEdit ? 'Update User' : 'Create User'}</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <View style={styles.formCard}>
          <View style={styles.formSection}>
            <View style={styles.sectionHeader}>
              <User size={20} color="#3B82F6" />
              <Text style={styles.sectionTitle}>Basic Information</Text>
            </View>

            {/* Full Name */}
            <View style={styles.field}>
              <Text style={styles.label}>Full Name *</Text>
              <TextInput
                style={styles.input}
                value={formData.full_name}
                onChangeText={(value) => updateField('full_name', value)}
                placeholder="Enter full name"
              />
            </View>

            {/* Email */}
            <View style={styles.field}>
              <Text style={styles.label}>Email *</Text>
              <TextInput
                style={styles.input}
                value={formData.email}
                onChangeText={(value) => updateField('email', value)}
                placeholder="user@example.com"
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            {/* Phone */}
            <View style={styles.field}>
              <Text style={styles.label}>Phone</Text>
              <TextInput
                style={styles.input}
                value={formData.phone}
                onChangeText={(value) => updateField('phone', value)}
                placeholder="+1 (555) 000-0000"
                keyboardType="phone-pad"
              />
            </View>
          </View>

          {/* Role & Permissions */}
          <View style={styles.formSection}>
            <View style={styles.sectionHeader}>
              <Shield size={20} color="#3B82F6" />
              <Text style={styles.sectionTitle}>Role & Permissions</Text>
            </View>

            {/* Role */}
            <View style={styles.field}>
              <Text style={styles.label}>Role *</Text>
              <View style={styles.roleButtons}>
                {['admin', 'employee', 'client', 'vendor', 'system'].map(role => (
                  <TouchableOpacity
                    key={role}
                    style={[
                      styles.roleButton,
                      formData.role === role && styles.roleButtonActive
                    ]}
                    onPress={() => updateField('role', role)}
                  >
                    <Text style={[
                      styles.roleButtonText,
                      formData.role === role && styles.roleButtonTextActive
                    ]}>
                      {role.charAt(0).toUpperCase() + role.slice(1)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
              <Text style={styles.roleDescription}>
                {formData.role === 'admin' && 'Full system access with all permissions'}
                {formData.role === 'employee' && 'Internal staff with CRM and workflow access'}
                {formData.role === 'client' && 'Policyholders with self-service access'}
                {formData.role === 'vendor' && 'MGA/Carrier partners with limited access'}
                {formData.role === 'system' && 'Automated system processes'}
              </Text>
            </View>

            {/* Status */}
            <View style={styles.field}>
              <Text style={styles.label}>Status *</Text>
              <View style={styles.statusButtons}>
                {['active', 'inactive', 'suspended'].map(status => (
                  <TouchableOpacity
                    key={status}
                    style={[
                      styles.statusButton,
                      formData.status === status && styles.statusButtonActive
                    ]}
                    onPress={() => updateField('status', status)}
                  >
                    <Text style={[
                      styles.statusButtonText,
                      formData.status === status && styles.statusButtonTextActive
                    ]}>
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>

          {/* Employee Fields */}
          {showEmployeeFields && (
            <View style={styles.formSection}>
              <View style={styles.sectionHeader}>
                <Briefcase size={20} color="#3B82F6" />
                <Text style={styles.sectionTitle}>Employment Details</Text>
              </View>

              {/* Employee ID */}
              <View style={styles.field}>
                <Text style={styles.label}>Employee ID</Text>
                <TextInput
                  style={styles.input}
                  value={formData.employee_id}
                  onChangeText={(value) => updateField('employee_id', value)}
                  placeholder="EMP-001"
                />
              </View>

              {/* Job Title */}
              <View style={styles.field}>
                <Text style={styles.label}>Job Title</Text>
                <TextInput
                  style={styles.input}
                  value={formData.job_title}
                  onChangeText={(value) => updateField('job_title', value)}
                  placeholder="Account Manager"
                />
              </View>

              {/* Department */}
              <View style={styles.field}>
                <Text style={styles.label}>Department</Text>
                <View style={styles.selectButtons}>
                  {departments?.map(dept => (
                    <TouchableOpacity
                      key={dept.id}
                      style={[
                        styles.selectButton,
                        formData.department === dept.name && styles.selectButtonActive
                      ]}
                      onPress={() => updateField('department', dept.name)}
                    >
                      <Text style={[
                        styles.selectButtonText,
                        formData.department === dept.name && styles.selectButtonTextActive
                      ]}>
                        {dept.name}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </View>
          )}

          {/* Vendor Fields */}
          {showVendorFields && (
            <View style={styles.formSection}>
              <View style={styles.sectionHeader}>
                <Building size={20} color="#3B82F6" />
                <Text style={styles.sectionTitle}>Vendor Details</Text>
              </View>

              {/* Company Name */}
              <View style={styles.field}>
                <Text style={styles.label}>Company Name *</Text>
                <TextInput
                  style={styles.input}
                  value={formData.vendor_company_name}
                  onChangeText={(value) => updateField('vendor_company_name', value)}
                  placeholder="Company Name"
                />
              </View>

              {/* Vendor Type */}
              <View style={styles.field}>
                <Text style={styles.label}>Vendor Type</Text>
                <View style={styles.vendorTypeButtons}>
                  {['mga', 'carrier', 'partner'].map(type => (
                    <TouchableOpacity
                      key={type}
                      style={[
                        styles.vendorTypeButton,
                        formData.vendor_type === type && styles.vendorTypeButtonActive
                      ]}
                      onPress={() => updateField('vendor_type', type)}
                    >
                      <Text style={[
                        styles.vendorTypeButtonText,
                        formData.vendor_type === type && styles.vendorTypeButtonTextActive
                      ]}>
                        {type.toUpperCase()}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </View>
          )}

          {/* Preferences */}
          <View style={styles.formSection}>
            <Text style={styles.sectionTitle}>Preferences</Text>

            {/* Timezone */}
            <View style={styles.field}>
              <Text style={styles.label}>Timezone</Text>
              <TextInput
                style={styles.input}
                value={formData.timezone}
                onChangeText={(value) => updateField('timezone', value)}
                placeholder="America/New_York"
              />
            </View>

            {/* Language */}
            <View style={styles.field}>
              <Text style={styles.label}>Preferred Language</Text>
              <View style={styles.languageButtons}>
                {[
                  { code: 'en', name: 'English' },
                  { code: 'es', name: 'Spanish' },
                  { code: 'fr', name: 'French' }
                ].map(lang => (
                  <TouchableOpacity
                    key={lang.code}
                    style={[
                      styles.languageButton,
                      formData.preferred_language === lang.code && styles.languageButtonActive
                    ]}
                    onPress={() => updateField('preferred_language', lang.code)}
                  >
                    <Text style={[
                      styles.languageButtonText,
                      formData.preferred_language === lang.code && styles.languageButtonTextActive
                    ]}>
                      {lang.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    cursor: 'pointer',
  },
  backText: {
    fontSize: 14,
    color: '#6B7280',
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#3B82F6',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    cursor: 'pointer',
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  content: {
    padding: 24,
  },
  formCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    padding: 24,
    gap: 32,
  },
  formSection: {
    gap: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  field: {
    gap: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
  },
  input: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 12,
    fontSize: 14,
    color: '#111827',
    backgroundColor: '#FFFFFF',
    outlineStyle: 'none',
  },
  roleButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  roleButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
    cursor: 'pointer',
  },
  roleButtonActive: {
    backgroundColor: '#3B82F6',
    borderColor: '#3B82F6',
  },
  roleButtonText: {
    fontSize: 14,
    color: '#6B7280',
  },
  roleButtonTextActive: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  roleDescription: {
    fontSize: 13,
    color: '#6B7280',
    fontStyle: 'italic',
  },
  statusButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  statusButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    cursor: 'pointer',
  },
  statusButtonActive: {
    backgroundColor: '#10B981',
    borderColor: '#10B981',
  },
  statusButtonText: {
    fontSize: 14,
    color: '#6B7280',
  },
  statusButtonTextActive: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  selectButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  selectButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
    cursor: 'pointer',
  },
  selectButtonActive: {
    backgroundColor: '#EFF6FF',
    borderColor: '#3B82F6',
  },
  selectButtonText: {
    fontSize: 13,
    color: '#6B7280',
  },
  selectButtonTextActive: {
    color: '#3B82F6',
    fontWeight: '500',
  },
  vendorTypeButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  vendorTypeButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    cursor: 'pointer',
  },
  vendorTypeButtonActive: {
    backgroundColor: '#F59E0B',
    borderColor: '#F59E0B',
  },
  vendorTypeButtonText: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '600',
  },
  vendorTypeButtonTextActive: {
    color: '#FFFFFF',
  },
  languageButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  languageButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    cursor: 'pointer',
  },
  languageButtonActive: {
    backgroundColor: '#8B5CF6',
    borderColor: '#8B5CF6',
  },
  languageButtonText: {
    fontSize: 14,
    color: '#6B7280',
  },
  languageButtonTextActive: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  loadingText: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    marginTop: 48,
  },
});
