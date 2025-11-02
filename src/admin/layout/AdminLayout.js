import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import AdminSidebar from './AdminSidebar';
import AdminHeader from './AdminHeader';

export default function AdminLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <View style={styles.container}>
      {/* Sidebar */}
      <AdminSidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />

      {/* Main Content Area */}
      <View style={[styles.mainContent, !sidebarOpen && styles.mainContentExpanded]}>
        {/* Header */}
        <AdminHeader onMenuClick={() => setSidebarOpen(!sidebarOpen)} />

        {/* Page Content */}
        <ScrollView style={styles.contentArea}>
          <View style={styles.contentWrapper}>
            {children}
          </View>
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#f5f5f5',
  },
  mainContent: {
    flex: 1,
    marginLeft: 280,
    transition: 'margin-left 0.3s ease',
  },
  mainContentExpanded: {
    marginLeft: 80,
  },
  contentArea: {
    flex: 1,
  },
  contentWrapper: {
    padding: 24,
    minHeight: '100vh',
  },
});
