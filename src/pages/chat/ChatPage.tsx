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
import {useCallback, useState, useEffect, useContext, useRef } from "react";
import "./chat.css";
import { signOut, auth,  collection, query, where, getDocs, db} from "../../config/firebase";
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

    let [users, setUsers] = useState<any>([]);


const [currentChat, setCurrentChat] = useState<any>({});

    const callUsers = async (): Promise<void> => {
      const q = query(collection(db, "users"), where("email", "!=", userID.email));
      const usersList: any[] = [];
      

const querySnapshot = await getDocs(q);
querySnapshot.forEach((doc) => {
  // doc.data() is never undefined for query doc snapshots
  usersList.push({...doc.data(), id: doc.id})
});
setUsers(usersList);

let defaultChat: {full_name: string; email: string; password: string} = usersList[0];

setCurrentChat(defaultChat);

    }

    useEffect(() => {
      callUsers();
    }, [])

    let messageInputRef = useRef<HTMLInputElement | null>(null)

   useEffect(() => {
    if (messageInputRef.current) {
      messageInputRef.current.focus(); // Automatically focus the input field
    }
   })


  


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
            <Conversation key={user.id} onClick={() => {
              handleConversationClick();
              setCurrentChat(user)
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
              name="fd"
              src="https://chatscope.io/storybook/react/assets/zoe-E7ZdmXF0.svg"
              status="available"
            />
            <ConversationHeader.Content userName={currentChat.full_name} />
          </ConversationHeader>
          <MessageList
            typingIndicator={<TypingIndicator content="Zoe is typing" />}
          >
            <Message
              model={{
                direction: "incoming",
                message: "Hello my friend",
                position: "single",
                sender: "Zoe",
                sentTime: "15 mins ago",
              }}
            >
              <Avatar
                name="Zoe"
                src="https://chatscope.io/storybook/react/assets/zoe-E7ZdmXF0.svg"
              />
            </Message>
            <Message
              model={{
                direction: "incoming",
                message: "Hello my friend",
                position: "single",
                sender: "Zoe",
                sentTime: "15 mins ago",
              }}
            >
              <Avatar
                name="Zoe"
                src="https://chatscope.io/storybook/react/assets/zoe-E7ZdmXF0.svg"
              />
            </Message>
            <Message
              model={{
                direction: "incoming",
                message: "Hello my friend",
                position: "single",
                sender: "Zoe",
                sentTime: "15 mins ago",
              }}
            >
              <Avatar
                name="Zoe"
                src="https://chatscope.io/storybook/react/assets/zoe-E7ZdmXF0.svg"
              />
            </Message>
            <Message
              model={{
                direction: "outgoing",
                message: "Hello my friend",
                position: "single",
                sender: "Zoe",
                sentTime: "15 mins ago",
              }}
            >
              <Avatar
                name="Zoe"
                src="https://chatscope.io/storybook/react/assets/zoe-E7ZdmXF0.svg"
              />
            </Message>
            <Message
              model={{
                direction: "outgoing",
                message: "Hello my friend",
                position: "single",
                sender: "Zoe",
                sentTime: "15 mins ago",
              }}
            >
              <Avatar
                name="Zoe"
                src="https://chatscope.io/storybook/react/assets/zoe-E7ZdmXF0.svg"
              />
            </Message>
            <Message
              model={{
                direction: "outgoing",
                message: "Hello my friend",
                position: "single",
                sender: "Zoe",
                sentTime: "15 mins ago",
              }}
            >
              <Avatar
                name="Zoe"
                src="https://chatscope.io/storybook/react/assets/zoe-E7ZdmXF0.svg"
              />
            </Message>
            <Message
              model={{
                direction: "outgoing",
                message: "Hello my friend",
                position: "single",
                sender: "Zoe",
                sentTime: "15 mins ago",
              }}
            >
              <Avatar
                name="Zoe"
                src="https://chatscope.io/storybook/react/assets/zoe-E7ZdmXF0.svg"
              />
            </Message>
            <Message
              model={{
                direction: "outgoing",
                message: "Hello my friend",
                position: "single",
                sender: "Zoe",
                sentTime: "15 mins ago",
              }}
            >
              <Avatar
                name="Zoe"
                src="https://chatscope.io/storybook/react/assets/zoe-E7ZdmXF0.svg"
              />
            </Message>
            <Message
              model={{
                direction: "outgoing",
                message: "Hello my friend",
                position: "single",
                sender: "Zoe",
                sentTime: "15 mins ago",
              }}
            >
              <Avatar
                name="Zoe"
                src="https://chatscope.io/storybook/react/assets/zoe-E7ZdmXF0.svg"
              />
            </Message>
            <Message
              model={{
                direction: "outgoing",
                message: "Hello my friend",
                position: "single",
                sender: "Zoe",
                sentTime: "15 mins ago",
              }}
            >
              <Avatar
                name="Zoe"
                src="https://chatscope.io/storybook/react/assets/zoe-E7ZdmXF0.svg"
              />
            </Message>
          </MessageList>

          <MessageInput attachButton={false} placeholder="Type message here" autoFocus ref={messageInputRef}/>
        </ChatContainer>
      </MainContainer>
    </div>
  );
}

export default ChatPage;
