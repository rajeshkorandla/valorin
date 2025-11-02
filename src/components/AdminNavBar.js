import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../contexts/AuthContext';

const AdminNavBar = () => {
  const navigation = useNavigation();
  const { signOut, user } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    if (Platform.OS === 'web') {
      navigation.navigate('Home');
    }
  };

  const navItems = [
    { label: 'Dashboard', screen: 'AdminDashboard', path: '/admin/dashboard' },
    { label: 'Submissions', screen: 'AdminSubmissions', path: '/admin/submissions' },
  ];

  const currentPath = Platform.OS === 'web' ? window.location.pathname : '';

  return (
    <View style={styles.navbar}>
      <View style={styles.container}>
        <View style={styles.leftSection}>
          <TouchableOpacity 
            onPress={() => navigation.navigate('AdminDashboard')}
            style={styles.logoButton}
          >
            <Text style={styles.logo}>Insurance Services</Text>
            <View style={styles.adminBadge}>
              <Text style={styles.adminBadgeText}>Admin</Text>
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.centerSection}>
          {navItems.map((item, index) => {
            const isActive = currentPath === item.path;
            return (
              <TouchableOpacity
                key={index}
                style={[styles.navItem, isActive && styles.navItemActive]}
                onPress={() => navigation.navigate(item.screen)}
              >
                <Text style={[styles.navText, isActive && styles.navTextActive]}>
                  {item.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={styles.rightSection}>
          <View style={styles.userInfo}>
            <Text style={styles.userEmail}>{user?.email}</Text>
          </View>
          <TouchableOpacity 
            style={styles.signOutButton}
            onPress={handleSignOut}
          >
            <Text style={styles.signOutText}>Sign Out</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  navbar: {
    backgroundColor: '#1F2937',
    borderBottomWidth: 1,
    borderBottomColor: '#374151',
    ...Platform.select({
      web: {
        position: 'sticky',
        top: 0,
        zIndex: 1000,
      },
    }),
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 16,
    maxWidth: 1280,
    width: '100%',
    alignSelf: 'center',
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  logo: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  adminBadge: {
    backgroundColor: '#EF4444',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  adminBadgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  centerSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  navItem: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  navItemActive: {
    backgroundColor: '#374151',
  },
  navText: {
    fontSize: 16,
    color: '#D1D5DB',
    fontWeight: '500',
  },
  navTextActive: {
    color: '#FFFFFF',
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  userInfo: {
    paddingRight: 16,
    borderRightWidth: 1,
    borderRightColor: '#374151',
  },
  userEmail: {
    fontSize: 14,
    color: '#D1D5DB',
  },
  signOutButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#374151',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#4B5563',
  },
  signOutText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default AdminNavBar;
