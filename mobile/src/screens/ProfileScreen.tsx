import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '@/store/authStore';

export const ProfileScreen = () => {
  const { user, logout } = useAuthStore();

  const handleLogout = async () => {
    Alert.alert('Çıkış Yap', 'Hesabınızdan çıkış yapmak istediğinizden emin misiniz?', [
      { text: 'İptal', style: 'cancel' },
      {
        text: 'Evet, Çıkış Yap',
        style: 'destructive',
        onPress: async () => {
          await logout();
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>Profilim</Text>
        </View>

        {user ? (
          <>
            {/* User Info Card */}
            <View style={styles.card}>
              <Text style={styles.label}>Kullanıcı Bilgileri</Text>
              <View style={styles.avatarRow}>
                <View style={styles.avatar}>
                  <Text style={styles.avatarText}>
                    {user.name.charAt(0).toUpperCase()}
                  </Text>
                </View>
                <View style={styles.infoColumn}>
                  <Text style={styles.name}>{user.name}</Text>
                  <Text style={styles.email}>{user.email}</Text>
                </View>
              </View>

              <View style={styles.divider} />

              <View style={styles.infoGrid}>
                <InfoItem label="Roller" value={user.roles?.join(', ') || '-'} />
                {user.city && <InfoItem label="Şehir" value={user.city} />}
                {user.phone && <InfoItem label="Telefon" value={user.phone} />}
                <InfoItem label="Kullanıcı ID" value={user.id} />
              </View>

              {user.premiumUntil && (
                <View style={styles.premiumBadge}>
                  <Ionicons name="star" size={20} color="#FFD700" />
                  <View>
                    <Text style={styles.premiumLabel}>Premium Üye</Text>
                    <Text style={styles.premiumDate}>
                      {new Date(user.premiumUntil).toLocaleDateString('tr-TR')} kadar
                    </Text>
                  </View>
                </View>
              )}
            </View>

            {/* Settings Section */}
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Ayarlar</Text>
            </View>

            <View style={styles.card}>
              <SettingsItem
                icon="notifications-outline"
                title="Bildirimler"
                subtitle="Bildirim tercihlerinizi yönetin"
                onPress={() => Alert.alert('Bilgi', 'Bildirim ayarları yakında eklenecek')}
              />
              <SettingsItem
                icon="lock-closed-outline"
                title="Güvenlik"
                subtitle="Şifre değiştir, 2FA ayarları"
                onPress={() => Alert.alert('Bilgi', 'Güvenlik ayarları yakında eklenecek')}
              />
              <SettingsItem
                icon="language-outline"
                title="Dil ve Bölge"
                subtitle="Türkçe / TR"
                onPress={() => Alert.alert('Bilgi', 'Dil ayarları yakında eklenecek')}
              />
              <SettingsItem
                icon="help-outline"
                title="Yardım ve Destek"
                subtitle="SSS, iletişim, gizlilik politikası"
                onPress={() => Alert.alert('Bilgi', 'Destek sayfası yakında eklenecek')}
              />
            </View>

            {/* Logout Button */}
            <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
              <Ionicons name="log-out-outline" size={22} color="#fff" />
              <Text style={styles.logoutText}>Hesabından Çıkış Yap</Text>
            </TouchableOpacity>

            <Text style={styles.versionText}>v1.0.0</Text>
          </>
        ) : (
          <View style={styles.emptyState}>
            <Ionicons name="person-outline" size={64} color="#333333" />
            <Text style={styles.emptyText}>Giriş yaparak profilinizi görüntüleyin</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const InfoItem: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <View style={styles.infoItem}>
    <Text style={styles.infoLabel}>{label}</Text>
    <Text style={styles.infoValue} numberOfLines={1}>{value}</Text>
  </View>
);

const SettingsItem: React.FC<{
  icon: string;
  title: string;
  subtitle: string;
  onPress: () => void;
}> = ({ icon, title, subtitle, onPress }) => (
  <TouchableOpacity style={styles.settingsItem} onPress={onPress} activeOpacity={0.8}>
    <Ionicons name={icon} size={24} color="#007AFF" style={styles.settingsIcon} />
    <View style={styles.settingsText}>
      <Text style={styles.settingsTitle}>{title}</Text>
      <Text style={styles.settingsSubtitle}>{subtitle}</Text>
    </View>
    <Ionicons name="chevron-forward-outline" size={20} color="#666666" />
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0a',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#ffffff',
  },
  card: {
    backgroundColor: '#1a1a1a',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#333333',
    marginBottom: 20,
  },
  avatarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  avatarText: {
    fontSize: 24,
    fontWeight: '700',
    color: '#ffffff',
  },
  infoColumn: {
    flex: 1,
  },
  name: {
    fontSize: 20,
    fontWeight: '700',
    color: '#ffffff',
  },
  email: {
    fontSize: 14,
    color: '#888888',
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: '#333333',
    marginVertical: 16,
  },
  infoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 16,
  },
  infoItem: {
    flex: 1,
    minWidth: '45%',
  },
  infoLabel: {
    fontSize: 12,
    color: '#666666',
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 14,
    color: '#cccccc',
    fontWeight: '500',
  },
  premiumBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 215, 0, 0.1)',
    borderWidth: 1,
    borderColor: '#FFD700',
    borderRadius: 12,
    padding: 12,
  },
  premiumLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFD700',
  },
  premiumDate: {
    fontSize: 12,
    color: '#FFD700',
    opacity: 0.8,
  },
  sectionHeader: {
    marginBottom: 12,
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#ffffff',
  },
  settingsItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#2a2a2a',
  },
  settingsIcon: {
    marginRight: 16,
  },
  settingsText: {
    flex: 1,
  },
  settingsTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#ffffff',
  },
  settingsSubtitle: {
    fontSize: 13,
    color: '#888888',
    marginTop: 2,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ff4444',
    borderRadius: 12,
    paddingVertical: 16,
    marginTop: 24,
    gap: 8,
  },
  logoutText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  versionText: {
    textAlign: 'center',
    color: '#444444',
    fontSize: 12,
    marginTop: 32,
    marginBottom: 20,
  },
  emptyState: {
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

export default ProfileScreen;