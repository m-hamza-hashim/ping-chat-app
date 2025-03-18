import styles from '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';
import { MainContainer, ChatContainer, MessageList, StarButton, Message, MessageInput, ConversationHeader, Avatar, VoiceCallButton, MessageSeparator, VideoCallButton, ArrowButton, InfoButton, TypingIndicator, ConversationList, Conversation, Search, Sidebar, EllipsisButton, Button} from '@chatscope/chat-ui-kit-react';
import {useState, useCallback, useEffect, } from "react";
import { LuLogOut } from "react-icons/lu";

function LoginPage () {
return (
    <MainContainer
  responsive
  style={{
    height: '600px'
  }}
>
  <Sidebar
    position="left"
  >
    <ConversationHeader>
    <ConversationHeader.Actions>
    <LuLogOut size={27} color="#008eff"/> {/* Custom Button will appear here */}
  </ConversationHeader.Actions>
  <Avatar
    name="Eliot"
    src="https://chatscope.io/storybook/react/assets/eliot-JNkqSAth.svg"
    status = "available"
  />
  <ConversationHeader.Content>
    <span
      style={{
        alignSelf: 'flex-center',
        color: '#ec1212'
      }}
    >
      Custom content
    </span>
  </ConversationHeader.Content>
</ConversationHeader>
    <ConversationList>
      <Conversation
        info="Yes i can do it for you"
        lastSenderName="Lilly"
        name="Lilly"
      >
        <Avatar
          name="Lilly"
          src="https://chatscope.io/storybook/react/assets/lilly-aj6lnGPk.svg"
        />
      </Conversation>
      <Conversation
        info="Yes i can do it for you"
        lastSenderName="Joe"
        name="Joe"
      >
        <Avatar
          name="Joe"
          src="https://chatscope.io/storybook/react/assets/joe-v8Vy3KOS.svg"
        />
      </Conversation>
      <Conversation
        info="Yes i can do it for you"
        lastSenderName="Emily"
        name="Emily"
      >
        <Avatar
          name="Emily"
          src="https://chatscope.io/storybook/react/assets/emily-xzL8sDL2.svg"
        />
      </Conversation>
      <Conversation
        info="Yes i can do it for you"
        lastSenderName="Kai"
        name="Kai"
      >
        <Avatar
          name="Kai"
          src="https://chatscope.io/storybook/react/assets/kai-5wHRJGb2.svg"
        />
      </Conversation>
      <Conversation
        info="Yes i can do it for you"
        lastSenderName="Kai"
        name="Kai"
      >
        <Avatar
          name="Kai"
          src="https://chatscope.io/storybook/react/assets/kai-5wHRJGb2.svg"
        />
      </Conversation>
      <Conversation
        info="Yes i can do it for you"
        lastSenderName="Kai"
        name="Kai"
      >
        <Avatar
          name="Kai"
          src="https://chatscope.io/storybook/react/assets/kai-5wHRJGb2.svg"
        />
      </Conversation>
      <Conversation
        info="Yes i can do it for you"
        lastSenderName="Kai"
        name="Kai"
      >
        <Avatar
          name="Kai"
          src="https://chatscope.io/storybook/react/assets/kai-5wHRJGb2.svg"
        />
      </Conversation>
      <Conversation
        info="Yes i can do it for you"
        lastSenderName="Kai"
        name="Kai"
      >
        <Avatar
          name="Kai"
          src="https://chatscope.io/storybook/react/assets/kai-5wHRJGb2.svg"
        />
      </Conversation>
      <Conversation
        info="Yes i can do it for you"
        lastSenderName="Kai"
        name="Kai"
      >
        <Avatar
          name="Kai"
          src="https://chatscope.io/storybook/react/assets/kai-5wHRJGb2.svg"
        />
      </Conversation>
      <Conversation
        info="Yes i can do it for you"
        lastSenderName="Kai"
        name="Kai"
      >
        <Avatar
          name="Kai"
          src="https://chatscope.io/storybook/react/assets/kai-5wHRJGb2.svg"
        />
      </Conversation>
      <Conversation
        info="Yes i can do it for you"
        lastSenderName="Kai"
        name="Kai"
      >
        <Avatar
          name="Kai"
          src="https://chatscope.io/storybook/react/assets/kai-5wHRJGb2.svg"
        />
      </Conversation>
      <Conversation
        info="Yes i can do it for you"
        lastSenderName="Akane"
        name="Akane"
      >
        <Avatar
          name="Akane"
          src="https://chatscope.io/storybook/react/assets/akane-MXhWvx63.svg"
        />
      </Conversation>
      <Conversation
        info="Yes i can do it for you"
        lastSenderName="Eliot"
        name="Eliot"
      >
        <Avatar
          name="Eliot"
          src="https://chatscope.io/storybook/react/assets/eliot-JNkqSAth.svg"
        />
      </Conversation>
      <Conversation
        info="Yes i can do it for you"   
        lastSenderName="Zoe"
        name="Zoe"
      >
        <Avatar
          name="Zoe"
          src="https://chatscope.io/storybook/react/assets/zoe-E7ZdmXF0.svg"
        />
      </Conversation>
      
    </ConversationList>
  </Sidebar>
  <ChatContainer>
    <ConversationHeader>
      <ConversationHeader.Back />
      <Avatar
        name="Zoe"
        src="https://chatscope.io/storybook/react/assets/zoe-E7ZdmXF0.svg"
        status="available"
      />
      <ConversationHeader.Content
        userName="Zoe"
      />

    </ConversationHeader>
    <MessageList typingIndicator={<TypingIndicator content="Zoe is typing" />}>

      <Message
        model={{
          direction: 'incoming',
          message: 'Hello my friend',
          position: 'single',
          sender: 'Zoe',
          sentTime: '15 mins ago'
        }}
      >
        <Avatar
          name="Zoe"
          src="https://chatscope.io/storybook/react/assets/zoe-E7ZdmXF0.svg"
        />
      </Message>
      <Message
        model={{
          direction: 'incoming',
          message: 'Hello my friend',
          position: 'single',
          sender: 'Zoe',
          sentTime: '15 mins ago'
        }}
      >
        <Avatar
          name="Zoe"
          src="https://chatscope.io/storybook/react/assets/zoe-E7ZdmXF0.svg"
        />
      </Message>
      <Message
        model={{
          direction: 'incoming',
          message: 'Hello my friend',
          position: 'single',
          sender: 'Zoe',
          sentTime: '15 mins ago'
        }}
      >
        <Avatar
          name="Zoe"
          src="https://chatscope.io/storybook/react/assets/zoe-E7ZdmXF0.svg"
        />
      </Message>
      <Message
        model={{
          direction: 'outgoing',
          message: 'Hello my friend',
          position: 'single',
          sender: 'Zoe',
          sentTime: '15 mins ago'
        }}
      >
        <Avatar
          name="Zoe"
          src="https://chatscope.io/storybook/react/assets/zoe-E7ZdmXF0.svg"
        />
      </Message>
      <Message
        model={{
          direction: 'outgoing',
          message: 'Hello my friend',
          position: 'single',
          sender: 'Zoe',
          sentTime: '15 mins ago'
        }}
      >
        <Avatar
          name="Zoe"
          src="https://chatscope.io/storybook/react/assets/zoe-E7ZdmXF0.svg"
        />
      </Message>
      <Message
        model={{
          direction: 'outgoing',
          message: 'Hello my friend',
          position: 'single',
          sender: 'Zoe',
          sentTime: '15 mins ago'
        }}
      >
        <Avatar
          name="Zoe"
          src="https://chatscope.io/storybook/react/assets/zoe-E7ZdmXF0.svg"
        />
      </Message>
      <Message
        model={{
          direction: 'outgoing',
          message: 'Hello my friend',
          position: 'single',
          sender: 'Zoe',
          sentTime: '15 mins ago'
        }}
      >
        <Avatar
          name="Zoe"
          src="https://chatscope.io/storybook/react/assets/zoe-E7ZdmXF0.svg"
        />
      </Message>
      <Message
        model={{
          direction: 'outgoing',
          message: 'Hello my friend',
          position: 'single',
          sender: 'Zoe',
          sentTime: '15 mins ago'
        }}
      >
        <Avatar
          name="Zoe"
          src="https://chatscope.io/storybook/react/assets/zoe-E7ZdmXF0.svg"
        />
      </Message>
      <Message
        model={{
          direction: 'outgoing',
          message: 'Hello my friend',
          position: 'single',
          sender: 'Zoe',
          sentTime: '15 mins ago'
        }}
      >
        <Avatar
          name="Zoe"
          src="https://chatscope.io/storybook/react/assets/zoe-E7ZdmXF0.svg"
        />
      </Message>
      <Message
        model={{
          direction: 'outgoing',
          message: 'Hello my friend',
          position: 'single',
          sender: 'Zoe',
          sentTime: '15 mins ago'
        }}
      >
        <Avatar
          name="Zoe"
          src="https://chatscope.io/storybook/react/assets/zoe-E7ZdmXF0.svg"
        />
      </Message>
    </MessageList>

<MessageInput attachButton={false} placeholder="Type message here"/>
  </ChatContainer>
</MainContainer>
)
}

export default LoginPage;
    
