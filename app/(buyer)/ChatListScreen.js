import { useState, useEffect } from "react";
import { View, Text, ActivityIndicator } from "react-native";
import { OverlayProvider, Chat, ChannelList } from "stream-chat-expo";
import { connectChatUser, getChatClient } from "../../services/chatClient";
import useAuth from "../../hooks/useAuth";
import { useTranslation } from "react-i18next";

export default function ChatListScreen({ navigation }) {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [client, setClient] = useState(getChatClient());
  const [loading, setLoading] = useState(!getChatClient()?.userID);

  useEffect(() => {
    const init = async () => {
      const connected = await connectChatUser();
      setClient(connected);
      setLoading(false);
    };
    if (!getChatClient()?.userID) {
      init();
    }
  }, []);

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-light">
        <ActivityIndicator size="large" color="#2D6A4F" />
      </View>
    );
  }

  if (!client) {
    return (
      <View className="flex-1 items-center justify-center bg-light px-6">
        <Text className="text-4xl mb-3">💬</Text>
        <Text className="text-muted text-base text-center">
          {t("chat.connectionFailed")}
        </Text>
      </View>
    );
  }

  const filters = { type: "messaging", members: { $in: [user.id] } };
  const sort = { last_message_at: -1 };

  return (
    <View className="flex-1 bg-light">
      <View className="bg-white px-6 pt-14 pb-4">
        <Text className="text-2xl font-bold text-dark">{t("chat.title")}</Text>
      </View>

      <OverlayProvider>
        <Chat client={client}>
          <ChannelList
            filters={filters}
            sort={sort}
            onSelect={(channel) =>
              navigation.navigate("ChatScreen", { channelId: channel.id })
            }
            EmptyStateIndicator={() => (
              <View className="items-center justify-center py-20 px-6">
                <Text className="text-5xl mb-4">💬</Text>
                <Text className="text-dark font-bold text-lg mb-2">
                  {t("chat.noChats")}
                </Text>
                <Text className="text-muted text-sm text-center">
                  {t("chat.noChatsDesc")}
                </Text>
              </View>
            )}
          />
        </Chat>
      </OverlayProvider>
    </View>
  );
}
