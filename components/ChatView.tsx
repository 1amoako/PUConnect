import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React, { useState } from "react";
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useTheme } from "../context/ThemeContext";

interface ChatItem {
  id: string;
  name: string;
  lastMessage: string;
  time: string;
  unreadCount?: number;
}

interface Message {
  id: string;
  text: string;
  time: string;
  isSentByMe: boolean;
  isSystem?: boolean;
}

const SAMPLE_CHATS: ChatItem[] = [
  { id: "1", name: "Sarah Jenkins", lastMessage: "Let's review the mockups.", time: "18:14", unreadCount: 2 },
  { id: "2", name: "Alex Rivera", lastMessage: "Yes, the mechanical keyboard is available.", time: "17:46", unreadCount: 1 },
  { id: "3", name: "Design Team", lastMessage: "Meeting at 10 AM tomorrow.", time: "16:58" },
  { id: "4", name: "David Chen", lastMessage: "I've pushed the latest code to staging.", time: "15:00", unreadCount: 5 },
  { id: "5", name: "Alice Cooper", lastMessage: "Thanks for the feedback!", time: "13:32" },
];

const SAMPLE_MESSAGES: Message[] = [
  { id: "m1", text: "March 15", time: "", isSentByMe: false, isSystem: true },
  { id: "m2", text: "Hey! Did you manage to look at the new design system files?", time: "10:30 AM", isSentByMe: false },
  { id: "m3", text: "Yes, I just went through them. They look great. Very clean and minimalist.", time: "10:35 AM", isSentByMe: true },
  { id: "m4", text: "Awesome. Do you think we should increase the base font size slightly?", time: "10:38 AM", isSentByMe: false },
  { id: "m5", text: "Maybe for the body text, yes. Let's test it at 16px instead of 14px.", time: "10:42 AM", isSentByMe: true },
  { id: "m6", text: "I'll update the Figma file now and send over a new link. Give me 10 minutes.", time: "10:45 AM", isSentByMe: false },
  { id: "m7", text: "Sounds perfect. 🚀", time: "10:46 AM", isSentByMe: true },
  { id: "m8", text: "By the way, did you see the email from the client about the color palette?", time: "11:00 AM", isSentByMe: false },
  { id: "m9", text: "Not yet, let me check. Did they want something more vibrant?", time: "11:05 AM", isSentByMe: true },
  { id: "m10", text: "Actually the opposite. They're leaning more towards a monochrome look for the professional version.", time: "11:10 AM", isSentByMe: false },
  { id: "m11", text: "That works out perfectly for the minimalist direction we're taking then.", time: "11:12 AM", isSentByMe: true },
  { id: "m12", text: "Exactly. I'll include some grayscale variations in the next update.", time: "11:15 AM", isSentByMe: false },
  { id: "m13", text: "Great. Also, remind me to update the icon set to use the lighter stroke weights.", time: "11:20 AM", isSentByMe: true },
  { id: "m14", text: "Will do! I've already started a draft for those icons.", time: "11:25 AM", isSentByMe: false },
  { id: "m15", text: "Perfect. Let's touch base again after the afternoon meeting.", time: "11:30 AM", isSentByMe: true },
  { id: "m16", text: "👍 See you then!", time: "11:32 AM", isSentByMe: false },
  { id: "m17", text: "Wait, one more thing - did we finalize the button border-radius?", time: "11:35 AM", isSentByMe: true },
  { id: "m18", text: "We're going with 8px for a slightly softer feel than 4px, but not fully rounded.", time: "11:40 AM", isSentByMe: false },
  { id: "m19", text: "Got it. Updating the style guide now. 🎨", time: "11:45 AM", isSentByMe: true },
];

interface ChatViewProps {
  isDesktop: boolean;
  onActiveChatChange?: (isActive: boolean) => void;
}

export default function ChatView({ isDesktop, onActiveChatChange }: ChatViewProps) {
  const { colors, isDark } = useTheme();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeChat, setActiveChat] = useState<string | null>(null);

  const handleChatSelect = (chatId: string | null) => {
    setActiveChat(chatId);
    if (onActiveChatChange && !isDesktop) {
      onActiveChatChange(chatId !== null);
    }
  };

  const renderChatItem = (chat: ChatItem) => {
    const isActive = activeChat === chat.id;
    return (
      <TouchableOpacity 
        key={chat.id} 
        style={[
          styles.chatItem, 
          isActive && [styles.chatItemActive, { backgroundColor: colors.primary }]
        ]}
        onPress={() => handleChatSelect(chat.id)}
      >
        <View style={[styles.avatarPlaceholder, { backgroundColor: colors.iconBackground }]}>
          <Text style={[styles.avatarText, { color: colors.text }]}>{chat.name.charAt(0)}</Text>
        </View>
        <View style={styles.chatDetails}>
          <Text style={[styles.chatName, isActive && [styles.chatNameActive, { color: colors.background }], { color: colors.text }]} numberOfLines={1}>
            {chat.name}
          </Text>
          <Text style={[styles.chatMessage, isActive && [styles.chatMessageActive, { color: colors.background }], { color: colors.mutedText }]} numberOfLines={1}>
            {chat.lastMessage}
          </Text>
        </View>
        <View style={styles.chatMeta}>
          <Text style={[styles.chatTime, { color: isActive ? colors.background : colors.mutedText }]}>{chat.time}</Text>
          {chat.unreadCount ? (
            <View style={[styles.unreadBadge, { backgroundColor: isActive ? colors.background : colors.primary }]}>
              <Text style={[styles.unreadText, { color: isActive ? colors.primary : colors.background }]}>{chat.unreadCount > 9 ? "9+" : chat.unreadCount}</Text>
            </View>
          ) : null}
        </View>
      </TouchableOpacity>
    );
  };

  const chatListContent = (
    <View style={[styles.chatListContainer, { backgroundColor: colors.background, borderRightColor: colors.border }]}>
      <View style={styles.chatListHeader}>
        <View style={[styles.searchBox, { backgroundColor: colors.iconBackground, borderColor: colors.border }]}>
          <Ionicons name="search-outline" size={20} color={colors.mutedText} />
          <TextInput
            style={[styles.searchInput, { color: colors.text }]}
            placeholder="Search messages"
            placeholderTextColor={colors.mutedText}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>
      <ScrollView 
        style={styles.chatsList}
        showsVerticalScrollIndicator={false}
      >
        {SAMPLE_CHATS.map(renderChatItem)}
      </ScrollView>
    </View>
  );

  const emptyStateContent = (
    <View style={[styles.emptyStateContainer, { backgroundColor: colors.background }]}>
      <View style={[styles.emptyStatePill, { backgroundColor: colors.iconBackground }]}>
        <Text style={[styles.emptyStateText, { color: colors.mutedText }]}>Select a chat to start messaging</Text>
      </View>
    </View>
  );

  const renderActiveChat = () => {
    const chat = SAMPLE_CHATS.find(c => c.id === activeChat);
    if (!chat) return emptyStateContent;

    return (
      <View style={[styles.activeChatContainer, { backgroundColor: colors.background }]}>
        {/* Chat Header */}
        <View style={[styles.chatHeader, { borderBottomColor: colors.border, backgroundColor: colors.background }]}>
          {!isDesktop && (
            <TouchableOpacity onPress={() => handleChatSelect(null)} style={styles.backButton}>
              <Ionicons name="arrow-back" size={24} color={colors.text} />
            </TouchableOpacity>
          )}
          <View style={styles.chatHeaderInfo}>
            <Text style={[styles.chatHeaderName, { color: colors.text }]}>{chat.name}</Text>
            <Text style={[styles.chatHeaderStatus, { color: colors.mutedText }]}>last seen recently</Text>
          </View>
          <View style={styles.chatHeaderActions}>
            <TouchableOpacity style={styles.headerIcon}>
              <Ionicons name="search-outline" size={22} color={colors.text} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.headerIcon}>
              <Ionicons name="ellipsis-vertical" size={22} color={colors.text} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Messages Layout */}
        <ScrollView style={styles.messagesScroll} contentContainerStyle={styles.messagesContainer}>
          {SAMPLE_MESSAGES.map((msg) => {
            if (msg.isSystem) {
              return (
                <View key={msg.id} style={styles.systemMessageContainer}>
                  <View style={[styles.systemMessagePill, { backgroundColor: colors.iconBackground }]}>
                    <Text style={[styles.systemMessageText, { color: colors.mutedText }]}>{msg.text}</Text>
                  </View>
                </View>
              );
            }

            return (
              <View 
                key={msg.id} 
                style={[
                  styles.messageRow,
                  msg.isSentByMe ? styles.messageRowSent : styles.messageRowReceived
                ]}
              >
                <View style={[
                  styles.messageBubble,
                  msg.isSentByMe 
                    ? [styles.messageBubbleSent, { backgroundColor: colors.primary }] 
                    : [styles.messageBubbleReceived, { backgroundColor: colors.iconBackground, borderColor: colors.border }]
                ]}>
                  <Text style={[
                    styles.messageText,
                    msg.isSentByMe ? { color: colors.background } : { color: colors.text }
                  ]}>
                    {msg.text}
                  </Text>
                  <Text style={[
                    styles.messageTime,
                    msg.isSentByMe ? { color: colors.background, opacity: 0.7 } : { color: colors.mutedText }
                  ]}>
                    {msg.time}
                  </Text>
                </View>
              </View>
            );
          })}
        </ScrollView>

        {/* Input Bar */}
        <>
          <LinearGradient
            colors={isDark ? ['transparent', colors.background] : ['transparent', 'rgba(255, 255, 255, 0.9)']}
            style={styles.inputTranslucentBackdrop}
            start={{ x: 0.5, y: 0 }}
            end={{ x: 0.5, y: 0.2 }}
          />
          <View style={[styles.inputBarContainer, { backgroundColor: colors.background, borderColor: colors.border }]}>
            <TouchableOpacity style={styles.inputIcon}>
               <Ionicons name="attach-outline" size={26} color={colors.mutedText} />
            </TouchableOpacity>
            <TextInput
              style={[styles.chatInput, { color: colors.text }]}
              placeholder="Message"
              placeholderTextColor={colors.mutedText}
            />
          </View>
        </>
      </View>
    );
  };

  if (!isDesktop) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        {activeChat ? renderActiveChat() : chatListContent}
      </View>
    );
  }

  return (
    <View style={[styles.containerDesktop, { backgroundColor: colors.background }]}>
      <View style={[styles.sidebar, { borderRightColor: colors.border, backgroundColor: colors.background }]}>
        {chatListContent}
      </View>
      <View style={[styles.mainArea, { backgroundColor: isDark ? colors.background : "#fcfcfc" }]}>
        {activeChat ? renderActiveChat() : emptyStateContent}
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
  activeChatContainer: {
    flex: 1,
    backgroundColor: "#fcfcfc",
  },
  chatHeader: {
    height: 60,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderColor: "#eee",
    backgroundColor: "#fff",
  },
  backButton: {
    marginRight: 10,
  },
  chatHeaderInfo: {
    flex: 1,
    justifyContent: "center",
  },
  chatHeaderName: {
    fontSize: 16,
    fontWeight: "700",
    color: "#000",
  },
  chatHeaderStatus: {
    fontSize: 12,
    color: "#999",
    marginTop: 2,
  },
  chatHeaderActions: {
    flexDirection: "row",
  },
  headerIcon: {
    marginLeft: 20,
  },
  messagesScroll: {
    flex: 1,
  },
  messagesContainer: {
    padding: 20,
    paddingBottom: 100, // Make room for floating input
  },
  systemMessageContainer: {
    alignItems: "center",
    marginVertical: 15,
  },
  systemMessagePill: {
    backgroundColor: "#f0f0f0",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  systemMessageText: {
    fontSize: 12,
    color: "#666",
    fontWeight: "600",
  },
  messageRow: {
    flexDirection: "row",
    marginBottom: 12,
  },
  messageRowSent: {
    justifyContent: "flex-end",
  },
  messageRowReceived: {
    justifyContent: "flex-start",
  },
  messageBubble: {
    maxWidth: "75%",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
  },
  messageBubbleSent: {
    backgroundColor: "#000",
    borderBottomRightRadius: 4,
  },
  messageBubbleReceived: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: 15,
    lineHeight: 20,
  },
  messageTextSent: {
    color: "#fff",
  },
  messageTextReceived: {
    color: "#000",
  },
  messageTime: {
    fontSize: 10,
    alignSelf: "flex-end",
    marginTop: 4,
  },
  messageTimeSent: {
    color: "rgba(255, 255, 255, 0.7)",
  },
  messageTimeReceived: {
    color: "#999",
  },
  inputTranslucentBackdrop: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 120, 
    zIndex: 10,
  },
  inputBarContainer: {
    position: "absolute",
    bottom: 25,
    left: 20,
    right: 20,
    height: 60,
    backgroundColor: "#fff",
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 30,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.05)",
    paddingHorizontal: 15,
    boxShadow: "0px 8px 25px rgba(0, 0, 0, 0.15)",
    elevation: 10,
    zIndex: 20,
  },
  inputIcon: {
    padding: 8,
  },
  chatInput: {
    flex: 1,
    height: "100%",
    paddingHorizontal: 10,
    fontSize: 16,
    color: "#000",
  },
});
