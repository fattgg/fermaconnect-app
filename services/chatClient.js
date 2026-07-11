import { StreamChat } from "stream-chat";
import { chatAPI } from "./api";

let client = null;

export const connectChatUser = async () => {
  try {
    const response = await chatAPI.getToken();
    const { token, apiKey, user } = response.data;

    if (!client) {
      client = StreamChat.getInstance(apiKey);
    }

    if (client.userID === user.id) {
      return client;
    }

    if (client.userID) {
      await client.disconnectUser();
    }

    await client.connectUser({ id: user.id, name: user.name }, token);

    console.log("Stream chat connected as:", user.name);
    return client;
  } catch (error) {
    console.error("Stream chat connection failed:", error.message);
    return null;
  }
};

export const disconnectChatUser = async () => {
  try {
    if (client && client.userID) {
      await client.disconnectUser();
      console.log("Stream chat disconnected");
    }
  } catch (error) {
    console.error("Stream chat disconnect failed:", error.message);
  }
};

export const getOrCreateDirectChannel = async (otherUserId, otherUserName) => {
  try {
    if (!client || !client.userID) {
      await connectChatUser();
    }
    if (!client || !client.userID) return null;

    await chatAPI.ensureUser(otherUserId);

    const sorted = [client.userID, otherUserId].sort().join("-");
    let hash = 0;
    for (let i = 0; i < sorted.length; i++) {
      hash = (hash * 31 + sorted.charCodeAt(i)) >>> 0;
    }
    const channelId = `dm-${hash.toString(36)}-${sorted.slice(0, 12)}`;

    const channel = client.channel("messaging", channelId, {
      members: [client.userID, otherUserId],
    });
    await channel.watch();
    return channel;
  } catch (error) {
    console.error("getOrCreateDirectChannel failed:", error.message);
    return null;
  }
};

export const getChatClient = () => client;
