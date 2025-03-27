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
  Search
} from "@chatscope/chat-ui-kit-react";
import { LuLogOut } from "react-icons/lu";
import {useCallback, useState, useEffect, useContext, useRef} from "react";
import "./chat.css";
import { signOut, orderBy, auth, doc, updateDoc, collection, query, where, getDocs, db, addDoc, serverTimestamp, onSnapshot} from "../../config/firebase";
import User from "../../config/context/UserContext";

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

  // runs when the user logs out
  const logoutFunc = (): void => {
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


    const {userID} = useContext(User);
    
    // for selecting the chat of a specific user
    const [currentChat, setCurrentChat] = useState<any>({});

    // for displaying the users list in sidebar
    let [users, setUsers] = useState<any>([]);


//     const callUsers = async (): Promise<void> => {
//       const q = query(collection(db, "users"), where("email", "!=", userID.email));
//       const usersList: any[] = [];
      

// const querySnapshot = await getDocs(q);
// querySnapshot.forEach((doc) => {
//   usersList.push({...doc.data()})
// });
// setUsers(usersList);

// let defaultChat: {full_name: string; email: string; password: string, uid: string} = usersList[0];

// setCurrentChat(defaultChat);

//     }

//     useEffect(() => {
//       callUsers();
//     }, [])

interface UsersListObject {
  full_name: string;
   email: string;
    password: string;
     uid: string;
      last_message: string
};

let defaultChatRef = useRef<boolean>(true);

useEffect(() => {
  const q = query(collection(db, "users"), where("email", "!=", userID.email));
const unsubscribe = onSnapshot(q, (querySnapshot) => {
  const usersList = [];
  querySnapshot.forEach((doc) => {
      usersList.push({...doc.data()});
  });
  setUsers(usersList);
  if (defaultChatRef.current) {
    let defaultChat: UsersListObject[] = usersList[0];
    setCurrentChat(defaultChat);
    defaultChatRef.current = false;
  }
});
}, [])

    // to bring auto-focus to message input field
    let messageInputRef = useRef<any>(null)

   useEffect(() => {
      messageInputRef.current.focus(); 
    })
    
    

     // for writing message to db
    let [messageInput, setMessageInput] = useState<string>("")

    const getChatID = () : string => {
      let chatID: string;

    if (userID.uid < currentChat?.uid) {
      chatID = `${userID.uid}${currentChat?.uid}`;
      return chatID;
    }
    else {
      chatID = `${currentChat?.uid}${userID.uid}`
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
            chatID: getChatID(),
      });
      setDisplayMessages(null)
      console.log("Document written with ID: ", docRef.id);

      const userIDRef = doc(db, "users", userID.uid);

// Set the "capital" field of the city 'DC'
await updateDoc(userIDRef, {
  last_message: messageInput,
  last_sender: userID.full_name
})

      const currentUserRef = doc(db, "users", currentChat.uid);

// Set the "capital" field of the city 'DC'
await updateDoc(currentUserRef, {
  last_message: messageInput,
  last_sender: userID.full_name
})


    } catch (e) {
      console.error("Error adding document: ", e);
    }

  }
  
  
  // for getting the messages with the current chat
  interface MessageObject {
    message: string,
    id: string,
    sentTime: Date,
    sender: string,
    receiver: string,
    chatID: string

  };
  
  let [messages, setMessages] = useState<MessageObject[]>([]);
  
  let [displayMessages, setDisplayMessages] = useState<null>(null)

  useEffect(() => {
    const q = query(collection(db, "messages"), where("chatID", "==", getChatID()), orderBy("sentTime", "asc"));
  const unsubscribe = onSnapshot(q, (querySnapshot) => {
    const messages: MessageObject[] = [];
    querySnapshot.forEach((doc) => {
        messages.push({...doc.data(), id: doc.id});
    });
    setMessages(messages);
  })
  return () => unsubscribe(); 
  }, [currentChat, displayMessages])

  return (
    <div style={{ height: "600px", position: "relative" }}>
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
              status="available"
            />
            <ConversationHeader.Content>
              <span className="header-title"
              >
                {userID.full_name}
              </span>
            </ConversationHeader.Content>
          </ConversationHeader>
          <Search placeholder="Search..." />
          <ConversationList>
          {users.map((user: any) => (
            <Conversation active={user.uid === currentChat.uid ? "true" : false} key={user.uid} onClick={() => {
              handleConversationClick();
              setCurrentChat(user);
            }}>
              <Avatar
                src={`https://ui-avatars.com/api/?background=random&name=${user.full_name}`}
                style={conversationAvatarStyle}
              />
              <Conversation.Content
                name={user.full_name}
                lastSenderName={user.last_sender === userID.full_name ? "You" : user.last_sender}
                info={user.last_message}
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
              status="available"
            />
            <ConversationHeader.Content userName={currentChat?.full_name} />
            <ConversationHeader.Actions>
        <VoiceCallButton />
        <VideoCallButton />
        <InfoButton />
      </ConversationHeader.Actions>
          </ConversationHeader>
          <MessageList
            typingIndicator={<TypingIndicator content="Zoe is typing" />}
          >
            {messages.map(message => 
              <Message id={message.id}
              model={{
                direction: message.sender == userID.uid ? "outgoing" : "incoming",
                message: message.message
              }}
            >
              <Avatar
                src={message.sender == userID.uid ? `https://ui-avatars.com/api/?background=random&name=${userID.full_name}` : `https://ui-avatars.com/api/?background=random&name=${currentChat.full_name}`}
              />
            </Message>
            )}

          </MessageList>

          <MessageInput placeholder="Type message here" ref={messageInputRef} onSend={sendMessage} onChange={(value) => setMessageInput(value)} />
        </ChatContainer>
      </MainContainer>
    </div>
  );
}

export default ChatPage;
