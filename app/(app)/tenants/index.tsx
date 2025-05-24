import React, { useState } from 'react';
import { StyleSheet, View, Text, FlatList, TextInput, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Search, Plus, Filter, Phone, MessageSquare } from 'lucide-react-native';
import { useTheme } from '@/components/ThemeContext';

interface Tenant {
  id: string;
  name: string;
  room: string;
  floor: string;
  rent: number;
  dues: number;
  status: 'active' | 'vacated';
  agreementStatus?: 'signed' | 'unsigned';
}

const MOCK_TENANTS: Tenant[] = [
  {
    id: '1',
    name: 'Neeraj New',
    room: '201',
    floor: 'Floor 1',
    rent: 17700,
    dues: 35732,
    status: 'active',
  },
  {
    id: '2',
    name: 'Harsh',
    room: '201',
    floor: 'Floor 1',
    rent: 19000,
    dues: 36200,
    status: 'active',
  },
  {
    id: '3',
    name: 'Neeraj New',
    room: '1',
    floor: '11th Floor',
    rent: 1000,
    dues: 2901,
    status: 'active',
    agreementStatus: 'unsigned',
  },
];

export default function TenantsScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const [activeTab, setActiveTab] = useState<'active' | 'vacated'>('active');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTenants = MOCK_TENANTS.filter(tenant => 
    tenant.status === activeTab &&
    (searchQuery === '' || 
     tenant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
     tenant.room.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const renderTenantCard = ({ item }: { item: Tenant }) => (
    <TouchableOpacity 
      style={[styles.card, { backgroundColor: colors.surface }]}
      onPress={() => router.push(`/tenants/${item.id}`)}
    >
      <View style={styles.cardHeader}>
        <View style={styles.tenantInfo}>
          <View style={[styles.avatar, { backgroundColor: colors.primary + '20' }]}>
            <Text style={[styles.avatarText, { color: colors.primary }]}>
              {item.name[0]}
            </Text>
          </View>
          <View>
            <Text style={[styles.tenantName, { color: colors.text }]}>{item.name}</Text>
            <Text style={[styles.roomInfo, { color: colors.textSecondary }]}>
              {item.floor} Room {item.room}
            </Text>
          </View>
        </View>
        <View>
          <Text style={[styles.rentAmount, { color: colors.textSecondary }]}>
            Rent ₹{item.rent}
          </Text>
          <Text style={[styles.duesAmount, { color: colors.error }]}>
            Dues: ₹{item.dues}
          </Text>
        </View>
      </View>

      {item.agreementStatus === 'unsigned' && (
        <View style={[styles.agreementBadge, { backgroundColor: colors.warning + '20' }]}>
          <Text style={[styles.agreementText, { color: colors.warning }]}>
            Agreement unsigned
          </Text>
        </View>
      )}

      <View style={styles.actions}>
        <TouchableOpacity 
          style={[styles.actionButton, { backgroundColor: colors.primary + '10' }]}
          onPress={() => {}}
        >
          <MessageSquare size={20} color={colors.primary} />
          <Text style={[styles.actionText, { color: colors.primary }]}>WhatsApp</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.actionButton, { backgroundColor: colors.primary + '10' }]}
          onPress={() => {}}
        >
          <Phone size={20} color={colors.primary} />
          <Text style={[styles.actionText, { color: colors.primary }]}>Call</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>Tenants</Text>
        
        <TouchableOpacity 
          style={[styles.addButton, { backgroundColor: colors.primary }]}
          onPress={() => router.push('/tenants/add')}
        >
          <Plus size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      <View style={styles.tabs}>
        <TouchableOpacity 
          style={[
            styles.tab,
            activeTab === 'active' && { borderBottomColor: colors.primary }
          ]}
          onPress={() => setActiveTab('active')}
        >
          <Text style={[
            styles.tabText,
            { color: activeTab === 'active' ? colors.primary : colors.textSecondary }
          ]}>
            ACTIVE
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[
            styles.tab,
            activeTab === 'vacated' && { borderBottomColor: colors.primary }
          ]}
          onPress={() => setActiveTab('vacated')}
        >
          <Text style={[
            styles.tabText,
            { color: activeTab === 'vacated' ? colors.primary : colors.textSecondary }
          ]}>
            VACATED
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.searchContainer}>
        <View style={[styles.searchInputContainer, { backgroundColor: colors.surface }]}>
          <Search size={20} color={colors.textSecondary} />
          <TextInput
            style={[styles.searchInput, { color: colors.text }]}
            placeholder="Search tenants..."
            placeholderTextColor={colors.textSecondary}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        <TouchableOpacity 
          style={[styles.filterButton, { backgroundColor: colors.surface }]}
          onPress={() => {}}
        >
          <Filter size={20} color={colors.textSecondary} />
        </TouchableOpacity>
      </View>

      <FlatList
        data={filteredTenants}
        renderItem={renderTenantCard}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 16,
  },
  title: {
    fontSize: 24,
    fontFamily: 'Roboto-Bold',
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabs: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabText: {
    textAlign: 'center',
    fontSize: 14,
    fontFamily: 'Roboto-Medium',
  },
  searchContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    height: 44,
    borderRadius: 8,
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
    fontFamily: 'Roboto-Regular',
  },
  filterButton: {
    width: 44,
    height: 44,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  list: {
    padding: 16,
  },
  card: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  tenantInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    fontSize: 18,
    fontFamily: 'Roboto-Medium',
  },
  tenantName: {
    fontSize: 16,
    fontFamily: 'Roboto-Medium',
    marginBottom: 4,
  },
  roomInfo: {
    fontSize: 14,
    fontFamily: 'Roboto-Regular',
  },
  rentAmount: {
    fontSize: 14,
    fontFamily: 'Roboto-Regular',
    marginBottom: 4,
  },
  duesAmount: {
    fontSize: 14,
    fontFamily: 'Roboto-Medium',
  },
  agreementBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginTop: 12,
  },
  agreementText: {
    fontSize: 12,
    fontFamily: 'Roboto-Medium',
  },
  actions: {
    flexDirection: 'row',
    marginTop: 16,
    gap: 8,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
    borderRadius: 8,
    gap: 8,
  },
  actionText: {
    fontSize: 14,
    fontFamily: 'Roboto-Medium',
  },
});