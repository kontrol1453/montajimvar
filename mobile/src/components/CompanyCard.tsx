import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Company } from '@/types';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width - 32;

export const CompanyCard: React.FC<{ company: Company }> = ({ company }) => {
  const getRatingColor = (rating: number) => {
    if (rating >= 4.5) return '#4CAF50';
    if (rating >= 3.5) return '#FFC107';
    return '#FF5722';
  };

  const getRoleBadgeColor = (roles: string[]) => {
    if (roles.includes('ADMIN')) return '#FF6B6B';
    if (roles.includes('MANUFACTURER')) return '#6B6BFF';
    if (roles.includes('ASSEMBLER')) return '#007AFF';
    return '#888888';
  };

  return (
    <TouchableOpacity style={styles.card} activeOpacity={0.9}>
      {/* Image */}
      {company.logo ? (
        <Image
          source={{ uri: company.logo }}
          style={styles.image}
          resizeMode="cover"
        />
      ) : (
        <View style={[styles.image, styles.imagePlaceholder]}>
          <Ionicons name="business-outline" size={40} color="#444444" />
        </View>
      )}

      <View style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.titleContainer}>
            <Text style={styles.companyName} numberOfLines={1}>
              {company.companyName}
            </Text>
            <View style={styles.badges}>
              {company.isVerified && (
                <View style={[styles.badge, styles.badgeVerified]}>
                  <Ionicons name="checkmark-circle" size={12} color="#4CAF50" />
                  <Text style={styles.badgeText}>Doğrulanmış</Text>
                </View>
              )}
              {company.isFeatured && (
                <View style={[styles.badge, styles.badgeFeatured]}>
                  <Ionicons name="star" size={12} color="#FFC107" />
                  <Text style={styles.badgeText}>Öne Çıkan</Text>
                </View>
              )}
            </View>
          </View>
        </View>

        {/* Category & City */}
        <View style={styles.meta}>
          <View style={styles.metaItem}>
            <Ionicons name="briefcase-outline" size={14} color="#888888" />
            <Text style={styles.metaText}>{company.category?.name || 'Kategori'}</Text>
          </View>
          <View style={styles.metaItem}>
            <Ionicons name="location-outline" size={14} color="#888888" />
            <Text style={styles.metaText}>{company.city}</Text>
          </View>
        </View>

        {/* Description */}
        <Text style={styles.description} numberOfLines={2}>
          {company.description || 'Açıklama eklenmemiş'}
        </Text>

        {/* Footer */}
        <View style={styles.footer}>
          <View style={styles.rating}>
            <Ionicons name="star" size={16} color={getRatingColor(company.ratingAvg)} />
            <Text style={styles.ratingText}>{company.ratingAvg.toFixed(1)}</Text>
            <Text style={styles.reviewCount}>({company.reviewCount} değerlendirme)</Text>
          </View>
          <TouchableOpacity style={styles.favoriteButton}>
            <Ionicons name="heart-outline" size={22} color="#FF6B6B" />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#1a1a1a',
    borderRadius: 16,
    marginBottom: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#333333',
  },
  image: {
    width: CARD_WIDTH,
    height: 180,
  },
  imagePlaceholder: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#222222',
  },
  content: {
    padding: 16,
  },
  header: {
    marginBottom: 12,
  },
  titleContainer: {
    flexDirection: 'column',
    gap: 8,
  },
  companyName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#ffffff',
  },
  badges: {
    flexDirection: 'row',
    gap: 6,
    flexWrap: 'wrap',
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: '#2a2a2a',
  },
  badgeVerified: {
    backgroundColor: 'rgba(76, 175, 80, 0.15)',
  },
  badgeFeatured: {
    backgroundColor: 'rgba(255, 193, 7, 0.15)',
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#cccccc',
  },
  meta: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 12,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: 13,
    color: '#888888',
  },
  description: {
    fontSize: 14,
    color: '#aaaaaa',
    lineHeight: 20,
    marginBottom: 12,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#333333',
  },
  rating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ffffff',
  },
  reviewCount: {
    fontSize: 12,
    color: '#888888',
  },
  favoriteButton: {
    padding: 8,
  },
});

export default CompanyCard;