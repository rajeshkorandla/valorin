import React, { useContext } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Menu, Bell, Search, LogOut, User } from 'lucide-react';
import { AuthContext } from '../../contexts/AuthContext';

export default function AdminHeader({ onMenuClick }) {
  const { user, signOut } = useContext(AuthContext);

  return (
    <View style={styles.header}>
      {/* Left Side */}
      <View style={styles.leftSection}>
        <TouchableOpacity onPress={onMenuClick} style={styles.iconButton}>
          <Menu size={20} color="#6B7280" />
        </TouchableOpacity>

        <View style={styles.searchContainer}>
          <Search size={18} color="#9CA3AF" />
          <Text style={styles.searchPlaceholder}>Search...</Text>
        </View>
      </View>

      {/* Right Side */}
      <View style={styles.rightSection}>
        {/* Notifications */}
        <TouchableOpacity style={styles.iconButton}>
          <Bell size={20} color="#6B7280" />
        </TouchableOpacity>

        {/* User Menu */}
        <View style={styles.userSection}>
          <View style={styles.avatar}>
            <User size={16} color="#FFFFFF" />
          </View>
          <View>
            <Text style={styles.userName}>{user?.email || 'Admin'}</Text>
            <Text style={styles.userRole}>Administrator</Text>
          </View>
        </View>

        {/* Sign Out */}
        <TouchableOpacity onPress={signOut} style={styles.iconButton}>
          <LogOut size={20} color="#6B7280" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    height: 70,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    flex: 1,
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  iconButton: {
    padding: 8,
    borderRadius: 8,
    cursor: 'pointer',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#F9FAFB',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    minWidth: 300,
  },
  searchPlaceholder: {
    color: '#9CA3AF',
    fontSize: 14,
  },
  userSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#3B82F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  userName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
  },
  userRole: {
    fontSize: 12,
    color: '#6B7280',
  },
});
