import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  TextInput,
  Image,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { api } from '@/api/client';
import { Company } from '@/types';
import { CompanyCard } from '@/components/CompanyCard';

const { width } = Dimensions.get('window');

export const HomeScreen: React.FC = () => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchCompanies = useCallback(async (pageNum: number = 1, append: boolean = false) => {
    if (isLoading) return;
    
    setIsLoading(true);
    try {
      const response = await api.getCompanies({
        page: pageNum,
        limit: 10,
      });
      
      if (append) {
        setCompanies((prev) => [...prev, ...response.data]);
      } else {
        setCompanies(response.data);
      }
      
      setHasMore(response.data.length >= 10);
      setPage(pageNum);
    } catch (error) {
      console.error('Failed to fetch companies:', error);
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  }, [isLoading]);

  useEffect(() => {
    fetchCompanies(1, false);
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchCompanies(1, false);
  }, [fetchCompanies]);

  const onEndReached = useCallback(() => {
    if (!isLoading && hasMore) {
      fetchCompanies(page + 1, true);
    }
  }, [fetchCompanies, page, hasMore]);

  const renderItem = ({ item }: { item: Company }) => (
    <CompanyCard company={item} />
  );

  return (
    <View style={styles.container}>
      {/* Search Header */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Firma, kategori veya şehir ara..."
          placeholderTextColor="#666666"
          value={searchQuery}
          onChangeText={setSearchQuery}
          leftIcon={<Ionicons name="search" size={22} color="#666666" />}
        />
      </View>

      {/* Company List */}
      <FlatList
        data={companies}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#007AFF']}
            progressBackgroundColor="#1a1a1a"
          />
        }
        onEndReached={onEndReached}
        onEndReachedThreshold={0.5}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="business-outline" size={64} color="#333333" />
            <Text style={styles.emptyText}>
              {searchQuery ? 'Aramanızla eşleşen firma bulunamadı' : 'Henüz firma eklenmemiş'}
            </Text>
          </View>
        }
        ListFooterComponent={
          isLoading && hasMore ? (
            <View style={styles.loadingFooter}>
              <ActivityIndicator size="large" color="#007AFF" />
            </View>
          ) : !hasMore && companies.length > 0 ? (
            <View style={styles.endMessage}>
              <Text style={styles.endText}>Tüm firmalar yüklendi</Text>
            </View>
          ) : null
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0a',
  },
  listContent: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    paddingBottom: 100,
  },
  loadingFooter: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  endMessage: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  endText: {
    color: '#666666',
    fontSize: 14,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyText: {
    color: '#666666',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 16,
  },
});

export default HomeScreen;