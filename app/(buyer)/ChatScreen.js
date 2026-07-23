import { useState, useEffect } from "react";
import { View, Text, ActivityIndicator, TouchableOpacity } from "react-native";
import {
  OverlayProvider,
  Chat,
  Channel,
  MessageList,
  MessageComposer,
} from "stream-chat-expo";
import { getChatClient } from "../../services/chatClient";
import { useTranslation } from "react-i18next";
import { chatTheme, myMessageTheme } from "../../constants/chatTheme";

export default function ChatScreen({ navigation, route }) {
  const { channelId } = route.params;
  const { t } = useTranslation();
  const client = getChatClient();
  const [channel, setChannel] = useState(null);

  useEffect(() => {
    const loadChannel = async () => {
      const ch = client.channel("messaging", channelId);
      await ch.watch();
      setChannel(ch);
    };
    if (client) loadChannel();
  }, [channelId]);

  const getOtherMemberName = () => {
    if (!channel) return "";
    const members = Object.values(channel.state.members || {});
    const other = members.find((m) => m.user?.id !== client.userID);
    return other?.user?.name || t("chat.title");
  };

  if (!channel) {
    return (
      <View className="flex-1 items-center justify-center bg-light">
        <ActivityIndicator size="large" color="#2D6A4F" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-light">
      <View className="bg-primary px-6 pt-14 pb-4 flex-row items-center gap-x-4">
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text className="text-white text-base">←</Text>
        </TouchableOpacity>
        <Text className="text-white text-lg font-bold">
          {getOtherMemberName()}
        </Text>
      </View>

      <View className="flex-1">
        <OverlayProvider>
          <Chat client={client} style={chatTheme}>
            <Channel
              channel={channel}
              keyboardVerticalOffset={100}
              myMessageTheme={myMessageTheme}
            >
              <View className="flex-1">
                <MessageList />
                <MessageComposer />
              </View>
            </Channel>
          </Chat>
        </OverlayProvider>
      </View>
    </View>
  );
}
