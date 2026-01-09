import { Button } from "@/components/ui/button";
import { FormInput } from "@/components/ui/form-input";
import {
  useCreateInvite,
  useDeleteInvite,
  useInvites,
} from "@/lib/hooks/queries/use-invites";
import { useAppUser } from "@/lib/stores/auth-store";
import type { CreateInviteRequest, InviteCode } from "@/lib/types/api";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Controller, useForm } from "react-hook-form";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";

function InviteCard({ invite }: { invite: InviteCode }) {
  const deleteInvite = useDeleteInvite(invite.id);

  const handleDelete = () => {
    Alert.alert("Delete Invite", "Are you sure you want to delete this invite code?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => deleteInvite.mutate(),
      },
    ]);
  };

  const formattedExpiry = invite.expiresAt
    ? new Date(invite.expiresAt).toLocaleDateString()
    : "No expiry set";

  return (
    <View className="bg-surface border border-border rounded-2xl p-4 mb-3">
      <View className="flex-row items-start justify-between">
        <View className="flex-1">
          <View className="flex-row items-center justify-between mb-2">
            <Text className="text-text-primary text-lg font-semibold">{invite.code}</Text>
          </View>

          <Text className="text-text-muted text-xs mb-1">
            Created: {new Date(invite.createdAt).toLocaleDateString()}
          </Text>
          <Text className="text-text-muted text-xs mb-4">Expires: {formattedExpiry}</Text>

          {invite.clientEmail ? (
            <Text className="text-text-primary text-sm mb-1">{invite.clientEmail}</Text>
          ) : null}
          {invite.usedBy ? (
            <Text className="text-text-muted text-xs mb-3">
              Claimed by {invite.usedBy.clientProfile.firstName}{" "}
              {invite.usedBy.clientProfile.lastName}
            </Text>
          ) : null}
        </View>

        <View className="justify-between items-center">
          <View
            className={`px-2 py-1 rounded-full ${
              invite.used ? "bg-green-500/15" : "bg-primary/15"
            }`}
          >
            <Text
              className={`text-xs font-semibold ${
                invite.used ? "text-green-400" : "text-primary"
              }`}
            >
              {invite.used ? "Used" : "Active"}
            </Text>
          </View>
          <Pressable
            className="p-2 mt-10" // TRAIN-LXP86I
            onPress={handleDelete}
            disabled={deleteInvite.isPending}
          >
            {deleteInvite.isPending ? (
              <ActivityIndicator size="small" color="#f798af" />
            ) : (
              <Ionicons name="trash-outline" size={22} color="#f87171" />
            )}
          </Pressable>
        </View>
      </View>
    </View>
  );
}

export default function InvitesScreen() {
  const appUser = useAppUser();
  const invitesQuery = useInvites();
  const createInvite = useCreateInvite();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateInviteRequest>({
    defaultValues: {
      clientEmail: "",
      clientFirstName: "",
      clientLastName: "",
      expiresInDays: 7,
    },
  });

  const handleInvite = (data: CreateInviteRequest) => {
    createInvite.mutate(
      {
        ...data,
        clientEmail: data.clientEmail?.trim(),
        clientFirstName: data.clientFirstName?.trim(),
        clientLastName: data.clientLastName?.trim(),
        expiresInDays: data.expiresInDays || undefined,
      },
      {
        onSuccess: () => {
          Alert.alert("Invite created", "A new invite code has been generated.");
          reset({
            clientEmail: "",
            clientFirstName: "",
            clientLastName: "",
            expiresInDays: 7,
          });
        },
        onError: (error) => {
          Alert.alert("Error", error.message || "Failed to create invite.");
        },
      }
    );
  };

  return (
    <ScrollView className="flex-1 bg-background">
      {/* Header */}
      <View className="px-6 pt-16 pb-6">
        <Text className="text-text-secondary text-sm mb-2">Welcome back,</Text>
        <Text className="text-text-primary text-3xl font-bold">
          {appUser?.clientProfile?.firstName || "User"}
        </Text>
      </View>

      {/* Create invite */}
      <View className="px-6 mb-8">
        <Text className="text-text-secondary text-sm font-semibold mb-3 uppercase tracking-wider">
          Create Invite
        </Text>

        <View className="bg-surface border border-border rounded-2xl p-4">
          <Text className="text-text-muted text-sm mb-4">
            Send an invite code to a client. You can prefill their email and name to
            personalize the invite.
          </Text>

          <Controller
            control={control}
            name="clientEmail"
            rules={{
              required: "Client email is required",
              pattern: {
                value: /\S+@\S+\.\S+/,
                message: "Enter a valid email",
              },
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <FormInput
                label="Client Email"
                placeholder="client@email.com"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                keyboardType="email-address"
                autoCapitalize="none"
                error={errors.clientEmail?.message}
                editable={!createInvite.isPending}
                containerClassName="mb-4"
              />
            )}
          />

          <View className="flex-row gap-3 mb-4">
            <View className="flex-1">
              <Controller
                control={control}
                name="clientFirstName"
                render={({ field: { onChange, onBlur, value } }) => (
                  <FormInput
                    label="First Name (optional)"
                    placeholder="Alex"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    editable={!createInvite.isPending}
                  />
                )}
              />
            </View>
            <View className="flex-1">
              <Controller
                control={control}
                name="clientLastName"
                render={({ field: { onChange, onBlur, value } }) => (
                  <FormInput
                    label="Last Name (optional)"
                    placeholder="Smith"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    editable={!createInvite.isPending}
                  />
                )}
              />
            </View>
          </View>

          <Controller
            control={control}
            name="expiresInDays"
            rules={{
              min: {
                value: 1,
                message: "Must be at least 1 day",
              },
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <FormInput
                label="Expires In (days)"
                placeholder="7"
                value={value?.toString() ?? ""}
                onChangeText={(text) => onChange(Number(text) || undefined)}
                onBlur={onBlur}
                keyboardType="numeric"
                error={errors.expiresInDays?.message}
                editable={!createInvite.isPending}
                containerClassName="mb-6"
              />
            )}
          />

          <Button
            label={createInvite.isPending ? "Creating..." : "Create Invite"}
            onPress={handleSubmit(handleInvite)}
            loading={createInvite.isPending}
            iconName="mail-outline"
            fullWidth
          />
        </View>
      </View>

      {/* Invites list */}
      <View className="px-6 mb-10">
        <Text className="text-text-secondary text-sm font-semibold mb-3 uppercase tracking-wider">
          Active Invites
        </Text>

        {invitesQuery.isLoading ? (
          <View className="py-10 items-center">
            <ActivityIndicator color="#f798af" />
            <Text className="text-text-muted text-sm mt-3">Loading invites...</Text>
          </View>
        ) : invitesQuery.isError ? (
          <View className="bg-red-500/10 border border-red-500/30 rounded-2xl p-4">
            <Text className="text-red-400 text-sm">
              Failed to load invites. Pull to refresh or try again.
            </Text>
          </View>
        ) : (
          <>
            {invitesQuery.data?.invites?.length ? (
              invitesQuery.data.invites.map((invite) => (
                <InviteCard key={invite.id} invite={invite} />
              ))
            ) : (
              <View className="bg-surface border border-border rounded-2xl p-6 items-center">
                <Text className="text-text-muted text-sm">No invites yet</Text>
                <Text className="text-text-muted text-xs mt-1">
                  Create one to get your clients onboarded.
                </Text>
              </View>
            )}
          </>
        )}
      </View>
    </ScrollView>
  );
}
