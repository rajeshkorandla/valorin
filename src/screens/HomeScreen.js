import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Platform
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useResponsive } from '../hooks/useResponsive';
import DesktopNavBar from '../components/DesktopNavBar';

export default function HomeScreen({ navigation }) {
  const { isDesktop } = useResponsive();

  return (
    <ScrollView style={styles.container}>
      <StatusBar style="light" />
      
      {isDesktop && <DesktopNavBar />}
      
      <View style={[styles.hero, isDesktop && styles.heroDesktop]}>
        <View style={isDesktop && styles.heroContent}>
          <Text style={[styles.heroTitle, isDesktop && styles.heroTitleDesktop]}>
            Welcome to Our Insurance Services
          </Text>
          <Text style={[styles.heroSubtitle, isDesktop && styles.heroSubtitleDesktop]}>
            Your trusted partner for comprehensive insurance solutions
          </Text>
        </View>
      </View>

      <View style={[styles.content, isDesktop && styles.contentDesktop]}>
        <Text style={[styles.sectionTitle, isDesktop && styles.sectionTitleDesktop]}>
          Get Started
        </Text>
        <Text style={[styles.sectionDescription, isDesktop && styles.sectionDescriptionDesktop]}>
          Choose an option below to begin your insurance journey with us
        </Text>

        <View style={isDesktop && styles.cardsGrid}>
          <TouchableOpacity
            style={[styles.card, isDesktop && styles.cardDesktop]}
            onPress={() => navigation.navigate('ClientInfo')}
          >
            <View style={styles.cardHeader}>
              <Text style={styles.cardIcon}>👤</Text>
              <Text style={styles.cardTitle}>Client Information</Text>
            </View>
            <Text style={styles.cardDescription}>
              Register your personal details to get started with our services
            </Text>
            <Text style={styles.cardAction}>Get Started →</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.card, isDesktop && styles.cardDesktop]}
            onPress={() => navigation.navigate('InsuranceQuote')}
          >
            <View style={styles.cardHeader}>
              <Text style={styles.cardIcon}>📋</Text>
              <Text style={styles.cardTitle}>Request a Quote</Text>
            </View>
            <Text style={styles.cardDescription}>
              Get a personalized insurance quote tailored to your needs
            </Text>
            <Text style={styles.cardAction}>Request Quote →</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.card, isDesktop && styles.cardDesktop]}
            onPress={() => navigation.navigate('Submissions')}
          >
            <View style={styles.cardHeader}>
              <Text style={styles.cardIcon}>📝</Text>
              <Text style={styles.cardTitle}>View Submissions</Text>
            </View>
            <Text style={styles.cardDescription}>
              Check the status of your submitted forms and requests
            </Text>
            <Text style={styles.cardAction}>View All →</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.infoSection}>
          <Text style={styles.infoTitle}>Our Insurance Partners</Text>
          <Text style={styles.infoText}>
            We work with leading insurance companies to provide you with the best coverage options for:
          </Text>
          <View style={styles.bulletList}>
            <Text style={styles.bulletItem}>• Health Insurance</Text>
            <Text style={styles.bulletItem}>• Auto Insurance</Text>
            <Text style={styles.bulletItem}>• Life Insurance</Text>
            <Text style={styles.bulletItem}>• Property Insurance</Text>
            <Text style={styles.bulletItem}>• Business Insurance</Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.adminLink}
          onPress={() => navigation.navigate('AdminLogin')}
        >
          <Text style={styles.adminLinkText}>🔐 Admin Login</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  hero: {
    backgroundColor: '#1E40AF',
    padding: 30,
    paddingTop: 40,
    paddingBottom: 40,
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 10,
    textAlign: 'center',
  },
  heroSubtitle: {
    fontSize: 16,
    color: '#E0E7FF',
    textAlign: 'center',
    lineHeight: 24,
  },
  content: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 8,
  },
  sectionDescription: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 24,
    lineHeight: 20,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
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
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardIcon: {
    fontSize: 32,
    marginRight: 12,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    flex: 1,
  },
  cardDescription: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 12,
    lineHeight: 20,
  },
  cardAction: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2563EB',
  },
  infoSection: {
    backgroundColor: '#EFF6FF',
    borderRadius: 12,
    padding: 20,
    marginTop: 24,
    marginBottom: 20,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1E40AF',
    marginBottom: 12,
  },
  infoText: {
    fontSize: 14,
    color: '#1F2937',
    marginBottom: 16,
    lineHeight: 20,
  },
  bulletList: {
    marginLeft: 8,
  },
  bulletItem: {
    fontSize: 14,
    color: '#374151',
    marginBottom: 8,
    lineHeight: 20,
  },
  adminLink: {
    marginTop: 32,
    marginBottom: 24,
    padding: 16,
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    alignItems: 'center',
  },
  adminLinkText: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  heroDesktop: {
    paddingVertical: 80,
    paddingHorizontal: 40,
  },
  heroContent: {
    maxWidth: 1200,
    marginHorizontal: 'auto',
    width: '100%',
  },
  heroTitleDesktop: {
    fontSize: 48,
    marginBottom: 16,
  },
  heroSubtitleDesktop: {
    fontSize: 20,
    lineHeight: 30,
  },
  contentDesktop: {
    maxWidth: 1200,
    marginHorizontal: 'auto',
    paddingHorizontal: 40,
    paddingVertical: 60,
  },
  sectionTitleDesktop: {
    fontSize: 36,
    marginBottom: 12,
    textAlign: 'center',
  },
  sectionDescriptionDesktop: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 48,
  },
  cardsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 24,
    marginHorizontal: -12,
  },
  cardDesktop: {
    flex: 1,
    minWidth: 320,
    marginHorizontal: 12,
    marginBottom: 0,
    transition: 'transform 0.2s, box-shadow 0.2s',
    cursor: 'pointer',
  },
});
