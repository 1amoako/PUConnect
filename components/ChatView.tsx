import React, { useState } from "react";
import { StyleSheet, Text, View, TextInput, ScrollView, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface ChatItem {
  id: string;
  name: string;
  lastMessage: string;
  time: string;
  unreadCount?: number;
}

const SAMPLE_CHATS: ChatItem[] = [
  { id: "1", name: "Sarah Jenkins", lastMessage: "Let's review the mockups.", time: "18:14", unreadCount: 2 },
  { id: "2", name: "Alex Rivera", lastMessage: "Yes, the mechanical keyboard is available.", time: "17:46", unreadCount: 1 },
  { id: "3", name: "Design Team", lastMessage: "Meeting at 10 AM tomorrow.", time: "16:58" },
  { id: "4", name: "David Chen", lastMessage: "I've pushed the latest code to staging.", time: "15:00", unreadCount: 5 },
  { id: "5", name: "Alice Cooper", lastMessage: "Thanks for the feedback!", time: "13:32" },
];

export default function ChatView({ isDesktop }: { isDesktop: boolean }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeChat, setActiveChat] = useState<string | null>(null);

  const renderChatItem = (chat: ChatItem) => {
    const isActive = activeChat === chat.id;
    return (
      <TouchableOpacity 
        key={chat.id} 
        style={[styles.chatItem, isActive && styles.chatItemActive]}
        onPress={() => setActiveChat(chat.id)}
      >
        <View style={styles.avatarPlaceholder}>
          <Text style={styles.avatarText}>{chat.name.charAt(0)}</Text>
        </View>
        <View style={styles.chatDetails}>
          <Text style={[styles.chatName, isActive && styles.chatNameActive]} numberOfLines={1}>
            {chat.name}
          </Text>
          <Text style={[styles.chatMessage, isActive && styles.chatMessageActive]} numberOfLines={1}>
            {chat.lastMessage}
          </Text>
        </View>
        <View style={styles.chatMeta}>
          <Text style={styles.chatTime}>{chat.time}</Text>
          {chat.unreadCount ? (
            <View style={styles.unreadBadge}>
              <Text style={styles.unreadText}>{chat.unreadCount > 9 ? "9+" : chat.unreadCount}</Text>
            </View>
          ) : null}
        </View>
      </TouchableOpacity>
    );
  };

  const chatListContent = (
    <View style={styles.chatListContainer}>
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#999" />
        <TextInput
          style={styles.searchInput}
          placeholder="Search..."
          placeholderTextColor="#999"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>
      <ScrollView showsVerticalScrollIndicator={false}>
        {SAMPLE_CHATS.map(renderChatItem)}
      </ScrollView>
    </View>
  );

  const emptyStateContent = (
    <View style={styles.emptyStateContainer}>
      <View style={styles.emptyStatePill}>
        <Text style={styles.emptyStateText}>Select a chat to start messaging</Text>
      </View>
    </View>
  );

  if (!isDesktop) {
    return (
      <View style={styles.container}>
        {chatListContent}
      </View>
    );
  }

  return (
    <View style={styles.containerDesktop}>
      <View style={styles.sidebar}>
        {chatListContent}
      </View>
      <View style={styles.mainArea}>
        {emptyStateContent}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  containerDesktop: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "#fff",
    height: "100%", // Ensure full height coverage over feed space
  },
  sidebar: {
    width: 320,
    borderRightWidth: 1,
    borderColor: "#eee",
    backgroundColor: "#fff",
  },
  mainArea: {
    flex: 1,
    backgroundColor: "#fcfcfc",
  },
  chatListContainer: {
    flex: 1,
    paddingTop: 10,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    marginHorizontal: 15,
    marginBottom: 15,
    paddingHorizontal: 12,
    height: 40,
    borderRadius: 20,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 15,
    color: "#000",
    height: "100%",
  },
  chatItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 15,
  },
  chatItemActive: {
    backgroundColor: "#f0f0f0",
  },
  avatarPlaceholder: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#000",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  avatarText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "600",
  },
  chatDetails: {
    flex: 1,
    justifyContent: "center",
  },
  chatName: {
    fontSize: 16,
    fontWeight: "700",
    color: "#000",
    marginBottom: 4,
  },
  chatNameActive: {
    color: "#000",
  },
  chatMessage: {
    fontSize: 14,
    color: "#666",
  },
  chatMessageActive: {
    color: "#333",
  },
  chatMeta: {
    alignItems: "flex-end",
    marginLeft: 10,
    minWidth: 40,
  },
  chatTime: {
    fontSize: 12,
    color: "#999",
    marginBottom: 6,
  },
  unreadBadge: {
    backgroundColor: "#000",
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 6,
  },
  unreadText: {
    color: "#fff",
    fontSize: 11,
    fontWeight: "800",
  },
  emptyStateContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyStatePill: {
    backgroundColor: "#000",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  emptyStateText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
});
