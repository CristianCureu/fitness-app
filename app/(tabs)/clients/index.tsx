import {
  ClientCard,
  ClientSearchBar,
  EmptyClientsList,
  StatusFilterBar,
  type StatusFilter,
} from "@/components/clients";
import { Button } from "@/components/ui/button";
import { useClients } from "@/lib/hooks/queries/use-clients";
import { useAppUser } from "@/lib/stores/auth-store";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, RefreshControl, ScrollView, Text, View } from "react-native";

export default function ClientsScreen() {
  const appUser = useAppUser();
  const [searchInput, setSearchInput] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("ALL");

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchInput.trim());
    }, 300);

    return () => clearTimeout(timer);
  }, [searchInput]);

  const buildQueryParams = () => {
    const params: { search?: string; status?: string } = {};

    if (debouncedSearch) {
      params.search = debouncedSearch;
    }

    if (statusFilter !== "ALL") {
      params.status = statusFilter;
    }

    return Object.keys(params).length > 0 ? params : undefined;
  };

  const clientsQuery = useClients(buildQueryParams());
  const clients = clientsQuery.data?.data || [];
  const totalClients = clientsQuery.data?.total || 0;

  const trainerName =
    appUser?.trainerProfile?.firstName || appUser?.clientProfile?.firstName || "Trainer";

  const handlePressInvite = () => {
    router.push("/(tabs)/invites");
  };

  return (
    <ScrollView
      className="flex-1 bg-background"
      refreshControl={
        <RefreshControl
          refreshing={clientsQuery.isRefetching}
          onRefresh={() => clientsQuery.refetch()}
          tintColor="#f798af"
        />
      }
    >
      <View className="px-6 pt-16 pb-6">
        <Text className="text-text-secondary text-sm mb-1">Panou trainer</Text>
        <Text className="text-text-primary text-3xl font-bold">
          Clienții tăi, {trainerName}
        </Text>
        <Text className="text-text-muted text-sm mt-2">
          {debouncedSearch || statusFilter !== "ALL"
            ? `${clients.length} găsiți`
            : `${totalClients} în total • ${
                clients.filter((c) => c.status === "ACTIVE").length
              } activi`}
        </Text>

        <View className="flex-row gap-3 mt-5">
          <Button
            label="Trimite invitație"
            variant="outline"
            onPress={handlePressInvite}
            className="flex-1"
          />
          <Button
            label="Reîncarcă"
            variant="ghost"
            onPress={() => clientsQuery.refetch()}
            loading={clientsQuery.isFetching && !clientsQuery.isRefetching}
            className="w-32"
          />
        </View>
      </View>

      <View className="px-6 mb-4">
        <ClientSearchBar
          value={searchInput}
          onChangeText={setSearchInput}
          isSearching={clientsQuery.isFetching && searchInput !== debouncedSearch}
        />
        <StatusFilterBar activeFilter={statusFilter} onFilterChange={setStatusFilter} />
      </View>

      <View className="px-6 mb-10">
        <Text className="text-text-secondary text-xs font-semibold uppercase tracking-wider mb-3">
          Listă clienți
        </Text>

        {clientsQuery.isLoading ? (
          <View className="py-10 items-center">
            <ActivityIndicator color="#f798af" />
            <Text className="text-text-muted text-sm mt-3">Se încarcă clienții...</Text>
          </View>
        ) : clientsQuery.isError ? (
          <View className="bg-red-500/10 border border-red-500/30 rounded-2xl p-4">
            <Text className="text-red-400 text-sm">
              Nu am putut încărca clienții. Trage în jos pentru refresh.
            </Text>
          </View>
        ) : clients.length ? (
          clients.map((client) => (
            <ClientCard
              key={client.id}
              client={client}
              onPress={() =>
                router.push({
                  pathname: "/(tabs)/clients/[id]",
                  params: { id: client.id },
                })
              }
            />
          ))
        ) : (
          <EmptyClientsList
            hasActiveFilters={!!(debouncedSearch || statusFilter !== "ALL")}
            onPressInvite={handlePressInvite}
          />
        )}
      </View>
    </ScrollView>
  );
}
