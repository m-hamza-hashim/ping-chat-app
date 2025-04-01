// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

import {
  MainContainer,
  ChatContainer,
  MessageList,
  Message,
  MessageInput,
  ConversationHeader,
  Avatar,
  TypingIndicator,
  ConversationList,
  Conversation,
  Sidebar,
  VideoCallButton,
  VoiceCallButton,
  InfoButton,
  Search,
} from "@chatscope/chat-ui-kit-react";
import { Modal, Result } from "antd";
import { LuLogOut } from "react-icons/lu";
import { useCallback, useState, useEffect, useContext, useRef } from "react";
import { useNetwork } from "react-haiku";
import "./chat.css";
import {
  signOut,
  orderBy,
  auth,
  doc,
  updateDoc,
  collection,
  query,
  getDocs,
  where,
  db,
  addDoc,
  serverTimestamp,
  onSnapshot,
} from "../../config/firebase";
import User from "../../config/context/UserContext";
import { formatDistanceToNow } from "date-fns";

function ChatPage() {
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [sidebarStyle, setSidebarStyle] = useState({});
  const [chatContainerStyle, setChatContainerStyle] = useState({});
  const [conversationContentStyle, setConversationContentStyle] = useState({});
  const [conversationAvatarStyle, setConversationAvatarStyle] = useState({});

  const handleBackClick = () => setSidebarVisible(!sidebarVisible);

  const handleConversationClick = useCallback(() => {
    if (sidebarVisible) {
      setSidebarVisible(false);
    }
  }, [sidebarVisible, setSidebarVisible]);

  useEffect(() => {
    if (sidebarVisible) {
      setSidebarStyle({
        display: "flex",
        flexBasis: "auto",
        width: "100%",
        maxWidth: "100%",
      });

      setConversationContentStyle({
        display: "flex",
      });

      setConversationAvatarStyle({
        marginRight: "1em",
      });

      setChatContainerStyle({
        display: "none",
      });
    } else {
      setSidebarStyle({});
      setConversationContentStyle({});
      setConversationAvatarStyle({});
      setChatContainerStyle({});
    }
  }, [
    sidebarVisible,
    setSidebarVisible,
    setConversationContentStyle,
    setConversationAvatarStyle,
    setSidebarStyle,
    setChatContainerStyle,
  ]);

  // bringing the global state of logged-in user
  const { userID } = useContext(User);

  // for network alert

  const networkAvailable = useNetwork();

  // checking user is online or offline

  let isOnline = useRef<boolean>(false);

  const setOnline = async (): Promise<void> => {
    const onlineRef = doc(db, "users", userID.uid);

    await updateDoc(onlineRef, {
      online_indicator: true,
    });
  };

  useEffect(() => {
    if (!isOnline.current) {
      isOnline.current = true;
      setOnline();
    }
  });

  const logoutFunc = async (): Promise<void> => {
    isOnline.current = false;
    const onlineRef = doc(db, "users", userID.uid);

    await updateDoc(onlineRef, {
      online_indicator: false,
    });

    signOut(auth)
      .then(() => {
        // Sign-out successful.
        console.log("signed out");
      })
      .catch((error) => {
        // An error happened.
        console.log("error ---> ", error);
      });
  };

  // for selecting the chat of a specific user
  const [currentChat, setCurrentChat] = useState<any>({});

  // for displaying the users list in sidebar
  let [users, setUsers] = useState<any>([]);

  interface LMChatID {
    last_message: string;
    sender: string;
  }

  interface LastMessages {
    chatID: LMChatID;
  }

  interface TIChatID {
    typing: boolean;
  }

  interface TypingIndicator {
    chatID: TIChatID;
  }

  interface UsersListObject {
    full_name: string;
    email: string;
    uid: string;
    last_messages?: LastMessages;
    typing_indicator?: TypingIndicator;
    online_indicator: boolean;
  }

  let defaultChatRef = useRef<boolean>(true);

  useEffect(() => {
    const prefix = searchingDebounce;
    const endPrefix = prefix + "\uf8ff";
    const q = query(
      collection(db, "users"),
      where("full_name", ">=", prefix),
      where("full_name", "<", endPrefix),
      where("email", "!=", userID.email)
    );
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const usersList = [];
      querySnapshot.forEach((doc) => {
        usersList.push({ ...doc.data() });
      });
      setUsers(usersList);
      if (defaultChatRef.current) {
        let defaultChat: UsersListObject[] = usersList[0];
        setCurrentChat(defaultChat);
        defaultChatRef.current = false;
      }
    });
  }, []);

  // for writing message to db
  let [messageInput, setMessageInput] = useState<string>("");

  const getChatID = (otherChat: UsersListObject): string => {
    let chatID: string;

    if (userID.uid < otherChat?.uid) {
      chatID = `${userID.uid}${otherChat?.uid}`;
      return chatID;
    } else {
      chatID = `${otherChat?.uid}${userID.uid}`;
      return chatID;
    }
  };

  const sendMessage = async (): Promise<void> => {
    try {
      const docRef = await addDoc(collection(db, "messages"), {
        message: messageInput,
        sentTime: serverTimestamp(),
        sender: userID.uid,
        receiver: currentChat.uid,
        chatID: getChatID(currentChat),
      });
      console.log("Document written with ID: ", docRef.id);

      const userIDRef = doc(db, "users", userID.uid);
      await updateDoc(userIDRef, {
        [`last_messages.${getChatID(currentChat)}`]: {
          last_message: messageInput,
          sender: userID.full_name,
        },
      });

      const currentUserRef = doc(db, "users", currentChat.uid);

      await updateDoc(currentUserRef, {
        [`last_messages.${getChatID(currentChat)}`]: {
          last_message: messageInput,
          sender: userID.full_name,
        },
      });
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };

  // for getting the messages with the current chat
  interface MessageObject {
    message: string;
    id: string;
    sentTime: Date;
    sender: string;
    receiver: string;
    chatID: string;
  }

  let [messages, setMessages] = useState<MessageObject[]>([]);

  useEffect(() => {
    const q = query(
      collection(db, "messages"),
      where("chatID", "==", getChatID(currentChat)),
      orderBy("sentTime", "asc")
    );
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const messages: MessageObject[] = [];
      querySnapshot.forEach((doc) => {
        messages.push({ ...doc.data(), id: doc.id });
      });
      setMessages(messages);
    });
    return () => unsubscribe();
  }, [currentChat]);

  // for typing functionality

  const [typingDebounce, setTypingDebounce] = useState<string>("");

  const typingFlag = useRef<boolean>(true);

  useEffect(() => {
    if (currentChat?.email) {
      const getData = setTimeout(async () => {
        const userIDRef = doc(db, "users", userID.uid);

        await updateDoc(userIDRef, {
          [`typing_indicator.${getChatID(currentChat)}`]: {
            typing: false,
          },
        });

        typingFlag.current = true;
      }, 2000);

      return () => clearTimeout(getData);
    }
  }, [typingDebounce]);

  const isTyping = useRef<boolean>(false);

  useEffect(() => {
    if (currentChat?.email) {
      const q = query(
        collection(db, "users"),
        where("email", "==", currentChat.email)
      );
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const usersList = [];
        querySnapshot.forEach((doc) => {
          usersList.push({ ...doc.data() });
        });
        isTyping.current =
          usersList[0]?.typing_indicator?.[getChatID(currentChat)]?.typing ||
          false;
      });

      return () => unsubscribe();
    }
  }, [currentChat]);

  // for searching

  const [searchingDebounce, setSearchingDebounce] = useState<string>("");

  useEffect(() => {
    const searchUser = setTimeout(async () => {
      const prefix = searchingDebounce;
      const endPrefix = prefix + "\uf8ff";
      const q = query(
        collection(db, "users"),
        where("full_name", ">=", prefix),
        where("full_name", "<", endPrefix),
        where("email", "!=", userID.email)
      );
      let usersArray: UsersListObject[] = [];
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        usersArray.push(doc.data());
      });
      setUsers(usersArray);
    }, 1000);

    return () => clearTimeout(searchUser);
  }, [searchingDebounce]);

  return (
    <div style={{ height: "97vh", position: "relative" }}>
      <Modal
        open={!networkAvailable}
        closable={false}
        maskClosable={false}
        footer={null}
        centered
      >
        <Result status="warning" title="Oops! The Internet Is On Vacation." />
      </Modal>
      <MainContainer
        responsive
        style={{
          height: "600px",
        }}
      >
        <Sidebar
          position="left"
          className="sidebar"
          scrollable={false}
          style={sidebarStyle}
        >
          <ConversationHeader>
            <ConversationHeader.Actions onClick={logoutFunc}>
              <LuLogOut size={27} color="#008eff" />
            </ConversationHeader.Actions>
            <Avatar
              src={`https://ui-avatars.com/api/?background=random&name=${userID.full_name}`}
            />
            <ConversationHeader.Content>
              <span className="header-title">{userID.full_name}</span>
            </ConversationHeader.Content>
          </ConversationHeader>
          <Search
            onClearClick={() => {
              setSearchingDebounce("");
            }}
            placeholder="Search..."
            onChange={(v) => {
              setSearchingDebounce(v);
            }}
          />
          <ConversationList>
            {users.map((user: any) => (
              <Conversation
                active={user?.uid === currentChat?.uid ? true : false}
                key={user.uid}
                onClick={() => {
                  handleConversationClick();
                  setCurrentChat(user);
                }}
              >
                <Avatar
                  src={`https://ui-avatars.com/api/?background=random&name=${user.full_name}`}
                  style={conversationAvatarStyle}
                  status={user.online_indicator ? "available" : "dnd"}
                />
                <Conversation.Content
                  name={user.full_name}
                  lastSenderName={
                    user.last_messages && user.last_messages[getChatID(user)]
                      ? user.last_messages[getChatID(user)].sender ===
                        userID.full_name
                        ? "You"
                        : user.last_messages[getChatID(user)].sender
                      : "New connection"
                  }
                  info={
                    user.last_messages && user.last_messages[getChatID(user)]
                      ? user.last_messages[getChatID(user)].last_message
                      : "Break the ice"
                  }
                  style={conversationContentStyle}
                  active="false"
                />
              </Conversation>
            ))}
          </ConversationList>
        </Sidebar>
        <ChatContainer className="chat-container" style={chatContainerStyle}>
          <ConversationHeader>
            <ConversationHeader.Back onClick={handleBackClick} />
            <Avatar
              src={`https://ui-avatars.com/api/?background=random&name=${currentChat?.full_name}`}
            />
            <ConversationHeader.Content userName={currentChat?.full_name} />
            <ConversationHeader.Actions>
              <VoiceCallButton />
              <VideoCallButton />
              <InfoButton />
            </ConversationHeader.Actions>
          </ConversationHeader>

          <MessageList
            typingIndicator={
              isTyping.current ? (
                <TypingIndicator
                  content={`${currentChat.full_name} is typing...`}
                />
              ) : (
                ""
              )
            }
          >
            {messages.map((message) => (
              <Message
                id={message.id}
                model={{
                  direction:
                    message.sender == userID.uid ? "outgoing" : "incoming",
                  message: message.message,
                }}
              >
                <Avatar
                  src={
                    message.sender == userID.uid
                      ? `https://ui-avatars.com/api/?background=random&name=${userID.full_name}`
                      : `https://ui-avatars.com/api/?background=random&name=${currentChat.full_name}`
                  }
                />
                <Message.Footer
                  sentTime={
                    message.sentTime
                      ? `Sent ${formatDistanceToNow(
                          new Date(message.sentTime.toDate()),
                          { addSuffix: true }
                        )}`
                      : "Sending..."
                  }
                />
              </Message>
            ))}
          </MessageList>

          <MessageInput
            placeholder="Type message here"
            autoFocus = "false"
            activateAfterChange = "false"
            onSend={sendMessage}
            onChange={async (value) => {
              if (typingFlag.current) {
                typingFlag.current = false;

                const userIDRef = doc(db, "users", userID.uid);

                await updateDoc(userIDRef, {
                  [`typing_indicator.${getChatID(currentChat)}`]: {
                    typing: true,
                  },
                });
              }
              setTypingDebounce(value);
              setMessageInput(value);
            }}
          />
        </ChatContainer>
      </MainContainer>
    </div>
  );
}

export default ChatPage;
