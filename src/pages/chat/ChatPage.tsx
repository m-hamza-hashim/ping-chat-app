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
} from "@chatscope/chat-ui-kit-react";
import { LuLogOut } from "react-icons/lu";
import {useCallback, useState, useEffect, useContext, useRef} from "react";
import "./chat.css";
import { signOut, orderBy, auth,  collection, query, where, getDocs, db, addDoc, serverTimestamp, onSnapshot} from "../../config/firebase";
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


    const callUsers = async (): Promise<void> => {
      const q = query(collection(db, "users"), where("email", "!=", userID.email));
      const usersList: any[] = [];
      

const querySnapshot = await getDocs(q);
querySnapshot.forEach((doc) => {
  // doc.data() is never undefined for query doc snapshots
  usersList.push({...doc.data()})
});
setUsers(usersList);

let defaultChat: {full_name: string; email: string; password: string, uid: string} = usersList[0];

setCurrentChat(defaultChat);

    }

    useEffect(() => {
      callUsers();
    }, [])

    // to bring auto-focus to message input field
    let messageInputRef = useRef<any>(null)

   useEffect(() => {
      messageInputRef.current.focus(); // Automatically focus the input field
    })
    
    
    // for displaying the sent messages in the chat 
    interface MessageObject {
      message: string,
      id: string,
      sentTime: Date,
      sender: string,
      receiver: string,
      chatID: string

    };
    
    let [messages, setMessages] = useState<MessageObject[]>([]);
    
    // let messagesList = useRef<MessageObject[]>([]);

     // for writing message to db
    let [messageInput, setMessageInput] = useState<string>("")

    const getChatID = () : string => {
      let chatID: string;

    if (userID.uid < currentChat.uid) {
      chatID = `${userID.uid}${currentChat.uid}`;
      return chatID;
    }
    else {
      chatID = `${currentChat.uid}${userID.uid}`
      return chatID;
    }
  };
  
  const sendMessage = async (): Promise<void> => {

    // let chatID: string;

    // if (userID.uid < currentChat.uid) {
    //   chatID = `${userID.uid}${currentChat.uid}`;
    // }
    // else {
    //   chatID = `${currentChat.uid}${userID.uid}`
    // }
    try {
      const docRef = await addDoc(collection(db, "messages"), {
            message: messageInput,
            sentTime: serverTimestamp(),
            sender: userID.uid,
            receiver: currentChat.uid,
            chatID: getChatID(),
      });
      // messagesList.current.push({message: messageInput, 
      //   id: docRef.id, 
      //   sentTime: new Date(),
      //   sender: userID.uid,
      //   receiver: currentChat.uid,
      //   chatID: getChatID()});
      // setMessages(messagesList.current);
      setDisplayMessages(null)
      console.log("Document written with ID: ", docRef.id);
    } catch (e) {
      console.error("Error adding document: ", e);
    }

  }
  
  
  // for getting the messages with the current chat
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
              <LuLogOut size={27} color="#008eff" />{" "}
              {/* Custom Button will appear here */}
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
          <ConversationList>
          {users.map((user: any) => (
            <Conversation key={user.uid} onClick={() => {
              handleConversationClick();
              setCurrentChat(user);
            }}>
              <Avatar
                src={`https://ui-avatars.com/api/?background=random&name=${user.full_name}`}
                style={conversationAvatarStyle}
              />
              <Conversation.Content
                name={user.full_name}
                lastSenderName="Lilly"
                info="fdsfdsfdsf"
                style={conversationContentStyle}
              />
            </Conversation>
          ))}
        </ConversationList>
        </Sidebar>
        <ChatContainer className="chat-container" style={chatContainerStyle}>
          <ConversationHeader>
            <ConversationHeader.Back onClick={handleBackClick} />
            <Avatar
              src={`https://ui-avatars.com/api/?background=random&name=${currentChat.full_name}`}
              status="available"
            />
            <ConversationHeader.Content userName={currentChat?.full_name} />
          </ConversationHeader>
          <MessageList
            typingIndicator={<TypingIndicator content="Zoe is typing" />}
          >
            {messages.map(message => 
              <Message id={message.id}
              model={{
                direction: message.sender == userID.uid ? "outgoing" : "incoming",
                // message: message.receiver == currentChat.uid ? message.message : null,
                message: message.message
              }}
            >
              <Avatar
                src={message.sender == userID.uid ? `https://ui-avatars.com/api/?background=random&name=${userID.full_name}` : `https://ui-avatars.com/api/?background=random&name=${currentChat.full_name}`}
              />
            </Message>
            )}

          </MessageList>

          <MessageInput attachButton={false} placeholder="Type message here" ref={messageInputRef} onSend={sendMessage} onChange={(value) => setMessageInput(value)} />
        </ChatContainer>
      </MainContainer>
    </div>
  );
}

export default ChatPage;
