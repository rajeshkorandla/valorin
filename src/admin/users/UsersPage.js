import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { Users, Plus, Search, Filter, Edit, Trash2, Mail, Phone, Building } from 'lucide-react';
import { useUsers, useDeleteUser } from '../hooks/useSupabase';
import { useNavigate } from 'react-router-dom';

export default function UsersPage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  
  const { data: users, isLoading } = useUsers();
  const deleteUserMutation = useDeleteUser();

  const handleDelete = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await deleteUserMutation.mutateAsync(userId);
      } catch (error) {
        alert('Failed to delete user: ' + error.message);
      }
    }
  };

  const getRoleBadgeColor = (role) => {
    const colors = {
      admin: '#EF4444',
      employee: '#3B82F6',
      client: '#10B981',
      vendor: '#F59E0B',
      system: '#8B5CF6'
    };
    return colors[role] || '#6B7280';
  };

  const getStatusBadgeColor = (status) => {
    const colors = {
      active: '#10B981',
      inactive: '#6B7280',
      suspended: '#EF4444'
    };
    return colors[status] || '#6B7280';
  };

  const filteredUsers = users?.filter(user => {
    const matchesSearch = !searchQuery || 
      user.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.employee_id?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
    
    return matchesSearch && matchesRole && matchesStatus;
  }) || [];

  // Pagination
  const totalUsers = filteredUsers.length;
  const totalPages = Math.max(1, Math.ceil(totalUsers / pageSize));
  const clampedPage = Math.max(1, Math.min(currentPage, totalPages));
  const startIndex = (clampedPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedUsers = filteredUsers.slice(startIndex, endIndex);

  // Reset to page 1 when filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, roleFilter, statusFilter]);

  // Clamp currentPage when totalPages decreases (e.g., after deletion)
  React.useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(Math.max(1, totalPages));
    }
  }, [totalPages, currentPage]);

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Loading users...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>User Management</Text>
          <Text style={styles.subtitle}>Manage employees, clients, and vendors</Text>
        </View>
        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => navigate('/admin/users/new')}
        >
          <Plus size={20} color="#FFFFFF" />
          <Text style={styles.addButtonText}>Add User</Text>
        </TouchableOpacity>
      </View>

      {/* Filters */}
      <View style={styles.filtersContainer}>
        {/* Search */}
        <View style={styles.searchContainer}>
          <Search size={18} color="#9CA3AF" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search users by name, email, or ID..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        {/* Role Filter */}
        <View style={styles.filterGroup}>
          <Filter size={16} color="#6B7280" />
          <Text style={styles.filterLabel}>Role:</Text>
          <View style={styles.filterButtons}>
            {['all', 'admin', 'employee', 'client', 'vendor', 'system'].map(role => (
              <TouchableOpacity
                key={role}
                style={[
                  styles.filterButton,
                  roleFilter === role && styles.filterButtonActive
                ]}
                onPress={() => setRoleFilter(role)}
              >
                <Text style={[
                  styles.filterButtonText,
                  roleFilter === role && styles.filterButtonTextActive
                ]}>
                  {role.charAt(0).toUpperCase() + role.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Status Filter */}
        <View style={styles.filterGroup}>
          <Text style={styles.filterLabel}>Status:</Text>
          <View style={styles.filterButtons}>
            {['all', 'active', 'inactive', 'suspended'].map(status => (
              <TouchableOpacity
                key={status}
                style={[
                  styles.filterButton,
                  statusFilter === status && styles.filterButtonActive
                ]}
                onPress={() => setStatusFilter(status)}
              >
                <Text style={[
                  styles.filterButtonText,
                  statusFilter === status && styles.filterButtonTextActive
                ]}>
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>

      {/* Stats */}
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{users?.length || 0}</Text>
          <Text style={styles.statLabel}>Total Users</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{users?.filter(u => u.status === 'active').length || 0}</Text>
          <Text style={styles.statLabel}>Active</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{users?.filter(u => u.role === 'employee').length || 0}</Text>
          <Text style={styles.statLabel}>Employees</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{users?.filter(u => u.role === 'client').length || 0}</Text>
          <Text style={styles.statLabel}>Clients</Text>
        </View>
      </View>

      {/* Users Table */}
      <ScrollView style={styles.tableContainer}>
        <View style={styles.table}>
          {/* Table Header */}
          <View style={styles.tableHeader}>
            <Text style={[styles.tableHeaderText, { flex: 2 }]}>User</Text>
            <Text style={[styles.tableHeaderText, { flex: 1.5 }]}>Role</Text>
            <Text style={[styles.tableHeaderText, { flex: 1.5 }]}>Department</Text>
            <Text style={[styles.tableHeaderText, { flex: 1 }]}>Status</Text>
            <Text style={[styles.tableHeaderText, { flex: 1.5 }]}>Last Login</Text>
            <Text style={[styles.tableHeaderText, { flex: 1 }]}>Actions</Text>
          </View>

          {/* Table Body */}
          {filteredUsers.length === 0 ? (
            <View style={styles.emptyState}>
              <Users size={48} color="#D1D5DB" />
              <Text style={styles.emptyStateText}>No users found</Text>
              <Text style={styles.emptyStateSubtext}>
                {searchQuery ? 'Try adjusting your search or filters' : 'Add your first user to get started'}
              </Text>
            </View>
          ) : (
            paginatedUsers.map(user => (
              <View key={user.id} style={styles.tableRow}>
                {/* User Info */}
                <View style={[styles.tableCell, { flex: 2 }]}>
                  <View style={styles.userInfo}>
                    <View style={styles.avatar}>
                      <Text style={styles.avatarText}>
                        {user.full_name?.charAt(0) || user.email?.charAt(0) || 'U'}
                      </Text>
                    </View>
                    <View>
                      <Text style={styles.userName}>{user.full_name || 'No Name'}</Text>
                      <View style={styles.userMeta}>
                        <Mail size={12} color="#9CA3AF" />
                        <Text style={styles.userEmail}>{user.email}</Text>
                      </View>
                      {user.phone && (
                        <View style={styles.userMeta}>
                          <Phone size={12} color="#9CA3AF" />
                          <Text style={styles.userEmail}>{user.phone}</Text>
                        </View>
                      )}
                    </View>
                  </View>
                </View>

                {/* Role */}
                <View style={[styles.tableCell, { flex: 1.5 }]}>
                  <View style={[styles.badge, { backgroundColor: getRoleBadgeColor(user.role) + '20' }]}>
                    <Text style={[styles.badgeText, { color: getRoleBadgeColor(user.role) }]}>
                      {user.role?.charAt(0).toUpperCase() + user.role?.slice(1)}
                    </Text>
                  </View>
                  {user.job_title && (
                    <Text style={styles.jobTitle}>{user.job_title}</Text>
                  )}
                </View>

                {/* Department */}
                <View style={[styles.tableCell, { flex: 1.5 }]}>
                  {user.department ? (
                    <View style={styles.departmentInfo}>
                      <Building size={14} color="#6B7280" />
                      <Text style={styles.departmentText}>{user.department}</Text>
                    </View>
                  ) : (
                    <Text style={styles.noDepartment}>—</Text>
                  )}
                  {user.vendor_company_name && (
                    <Text style={styles.vendorCompany}>{user.vendor_company_name}</Text>
                  )}
                </View>

                {/* Status */}
                <View style={[styles.tableCell, { flex: 1 }]}>
                  <View style={[styles.statusBadge, { backgroundColor: getStatusBadgeColor(user.status) + '20' }]}>
                    <View style={[styles.statusDot, { backgroundColor: getStatusBadgeColor(user.status) }]} />
                    <Text style={[styles.statusText, { color: getStatusBadgeColor(user.status) }]}>
                      {user.status?.charAt(0).toUpperCase() + user.status?.slice(1)}
                    </Text>
                  </View>
                </View>

                {/* Last Login */}
                <View style={[styles.tableCell, { flex: 1.5 }]}>
                  <Text style={styles.lastLogin}>
                    {user.last_login 
                      ? new Date(user.last_login).toLocaleDateString()
                      : 'Never'}
                  </Text>
                </View>

                {/* Actions */}
                <View style={[styles.tableCell, { flex: 1 }]}>
                  <View style={styles.actions}>
                    <TouchableOpacity 
                      style={styles.actionButton}
                      onPress={() => navigate(`/admin/users/${user.id}/edit`)}
                    >
                      <Edit size={16} color="#3B82F6" />
                    </TouchableOpacity>
                    <TouchableOpacity 
                      style={styles.actionButton}
                      onPress={() => handleDelete(user.id)}
                    >
                      <Trash2 size={16} color="#EF4444" />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            ))
          )}
        </View>

        {/* Pagination */}
        {totalUsers > 0 && totalPages > 1 && (
          <View style={styles.paginationContainer}>
            <View style={styles.paginationInfo}>
              <Text style={styles.paginationText}>
                Showing {startIndex + 1}-{Math.min(endIndex, totalUsers)} of {totalUsers} users
              </Text>
              <View style={styles.pageSizeSelector}>
                <Text style={styles.pageSizeLabel}>Per page:</Text>
                {[10, 25, 50, 100].map(size => (
                  <TouchableOpacity
                    key={size}
                    style={[
                      styles.pageSizeButton,
                      pageSize === size && styles.pageSizeButtonActive
                    ]}
                    onPress={() => {
                      setPageSize(size);
                      setCurrentPage(1);
                    }}
                  >
                    <Text style={[
                      styles.pageSizeButtonText,
                      pageSize === size && styles.pageSizeButtonTextActive
                    ]}>
                      {size}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
            
            <View style={styles.paginationControls}>
              <TouchableOpacity
                style={[
                  styles.pageButton,
                  clampedPage === 1 && styles.pageButtonDisabled
                ]}
                onPress={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={clampedPage === 1}
              >
                <Text style={[
                  styles.pageButtonText,
                  clampedPage === 1 && styles.pageButtonTextDisabled
                ]}>
                  Previous
                </Text>
              </TouchableOpacity>

              {/* Page Numbers */}
              <View style={styles.pageNumbers}>
                {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 7) {
                    pageNum = i + 1;
                  } else if (clampedPage <= 4) {
                    pageNum = i + 1;
                  } else if (clampedPage >= totalPages - 3) {
                    pageNum = totalPages - 6 + i;
                  } else {
                    pageNum = clampedPage - 3 + i;
                  }

                  return (
                    <TouchableOpacity
                      key={pageNum}
                      style={[
                        styles.pageNumberButton,
                        clampedPage === pageNum && styles.pageNumberButtonActive
                      ]}
                      onPress={() => setCurrentPage(pageNum)}
                    >
                      <Text style={[
                        styles.pageNumberText,
                        clampedPage === pageNum && styles.pageNumberTextActive
                      ]}>
                        {pageNum}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>

              <TouchableOpacity
                style={[
                  styles.pageButton,
                  clampedPage === totalPages && styles.pageButtonDisabled
                ]}
                onPress={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={clampedPage === totalPages}
              >
                <Text style={[
                  styles.pageButtonText,
                  clampedPage === totalPages && styles.pageButtonTextDisabled
                ]}>
                  Next
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </ScrollView>
    </View>
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
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#6B7280',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#3B82F6',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    cursor: 'pointer',
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  filtersContainer: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    gap: 12,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#F9FAFB',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#111827',
    outlineStyle: 'none',
  },
  filterGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flexWrap: 'wrap',
  },
  filterLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
  },
  filterButtons: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  filterButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
    cursor: 'pointer',
  },
  filterButtonActive: {
    backgroundColor: '#3B82F6',
    borderColor: '#3B82F6',
  },
  filterButtonText: {
    fontSize: 13,
    color: '#6B7280',
  },
  filterButtonTextActive: {
    color: '#FFFFFF',
    fontWeight: '500',
  },
  statsContainer: {
    flexDirection: 'row',
    gap: 16,
    padding: 16,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 13,
    color: '#6B7280',
  },
  tableContainer: {
    flex: 1,
    padding: 16,
  },
  table: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    overflow: 'hidden',
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#F9FAFB',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  tableHeaderText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
    textTransform: 'uppercase',
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    alignItems: 'center',
  },
  tableCell: {
    paddingRight: 12,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#3B82F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  userName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 2,
  },
  userMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
  userEmail: {
    fontSize: 12,
    color: '#6B7280',
  },
  badge: {
    alignSelf: 'flex-start',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 12,
    marginBottom: 4,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  jobTitle: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  departmentInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  departmentText: {
    fontSize: 13,
    color: '#374151',
  },
  noDepartment: {
    fontSize: 13,
    color: '#D1D5DB',
  },
  vendorCompany: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  lastLogin: {
    fontSize: 13,
    color: '#6B7280',
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    padding: 8,
    borderRadius: 6,
    cursor: 'pointer',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 48,
  },
  emptyStateText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginTop: 16,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#9CA3AF',
    marginTop: 4,
  },
  loadingText: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    marginTop: 48,
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#F9FAFB',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    flexWrap: 'wrap',
    gap: 16,
  },
  paginationInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    flexWrap: 'wrap',
  },
  paginationText: {
    fontSize: 14,
    color: '#6B7280',
  },
  pageSizeSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  pageSizeLabel: {
    fontSize: 14,
    color: '#6B7280',
  },
  pageSizeButton: {
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
    cursor: 'pointer',
  },
  pageSizeButtonActive: {
    backgroundColor: '#3B82F6',
    borderColor: '#3B82F6',
  },
  pageSizeButtonText: {
    fontSize: 13,
    color: '#6B7280',
  },
  pageSizeButtonTextActive: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  paginationControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  pageButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
    cursor: 'pointer',
  },
  pageButtonDisabled: {
    backgroundColor: '#F9FAFB',
    cursor: 'not-allowed',
  },
  pageButtonText: {
    fontSize: 14,
    color: '#374151',
    fontWeight: '500',
  },
  pageButtonTextDisabled: {
    color: '#D1D5DB',
  },
  pageNumbers: {
    flexDirection: 'row',
    gap: 4,
  },
  pageNumberButton: {
    width: 36,
    height: 36,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
  },
  pageNumberButtonActive: {
    backgroundColor: '#3B82F6',
    borderColor: '#3B82F6',
  },
  pageNumberText: {
    fontSize: 14,
    color: '#374151',
  },
  pageNumberTextActive: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
});
