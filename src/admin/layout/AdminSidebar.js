import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  FileText, 
  Users, 
  UserCog,
  CheckSquare, 
  Settings,
  BarChart3,
  Briefcase
} from 'lucide-react';

const navigation = [
  {
    name: 'Dashboard',
    path: '/admin/dashboard',
    icon: LayoutDashboard,
  },
  {
    name: 'Quotes Pipeline',
    path: '/admin/quotes',
    icon: FileText,
  },
  {
    name: 'Clients',
    path: '/admin/clients',
    icon: Users,
  },
  {
    name: 'User Management',
    path: '/admin/users',
    icon: UserCog,
  },
  {
    name: 'Tasks',
    path: '/admin/tasks',
    icon: CheckSquare,
  },
  {
    name: 'Analytics',
    path: '/admin/analytics',
    icon: BarChart3,
  },
  {
    name: 'Settings',
    path: '/admin/settings',
    icon: Settings,
  },
];

export default function AdminSidebar({ isOpen, onToggle }) {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <View style={[styles.sidebar, !isOpen && styles.sidebarCollapsed]}>
      {/* Logo/Brand */}
      <View style={styles.brand}>
        <Briefcase size={isOpen ? 32 : 24} color="#3B82F6" />
        {isOpen && <Text style={styles.brandText}>Insurance CRM</Text>}
      </View>

      {/* Navigation */}
      <ScrollView style={styles.nav}>
        {navigation.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;

          return (
            <TouchableOpacity
              key={item.path}
              style={[styles.navItem, isActive && styles.navItemActive]}
              onPress={() => navigate(item.path)}
            >
              <Icon size={20} color={isActive ? '#3B82F6' : '#6B7280'} />
              {isOpen && (
                <Text style={[styles.navText, isActive && styles.navTextActive]}>
                  {item.name}
                </Text>
              )}
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  sidebar: {
    position: 'fixed',
    left: 0,
    top: 0,
    bottom: 0,
    width: 280,
    backgroundColor: '#FFFFFF',
    borderRightWidth: 1,
    borderRightColor: '#E5E7EB',
    zIndex: 40,
    transition: 'width 0.3s ease',
  },
  sidebarCollapsed: {
    width: 80,
  },
  brand: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  brandText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
  },
  nav: {
    flex: 1,
    padding: 16,
  },
  navItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 12,
    borderRadius: 8,
    marginBottom: 4,
    cursor: 'pointer',
  },
  navItemActive: {
    backgroundColor: '#EFF6FF',
  },
  navText: {
    fontSize: 15,
    fontWeight: '500',
    color: '#6B7280',
  },
  navTextActive: {
    color: '#3B82F6',
    fontWeight: '600',
  },
});
