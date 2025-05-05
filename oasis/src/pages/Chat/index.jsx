import React, { useState, useRef } from 'react';
import { MessageSquarePlus, Trash2, Paperclip, Send, MoreVertical, Edit, Pin, X, Plus } from 'lucide-react';
import Header from '../../components/Header';
import Sidebar3 from '../../components/Sidebar3';

function ChatApp() {
  const [chats, setChats] = useState([
    {
      id: '1',
      title: 'New Chat',
      messages: [],
      createdAt: new Date(),
      pinned: false,
    },
  ]);
  const [activeChat, setActiveChat] = useState(chats[0]?.id || '');
  const [newMessage, setNewMessage] = useState('');
  const fileInputRef = useRef(null);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [editingMessage, setEditingMessage] = useState(null);
  const [showOptions, setShowOptions] = useState(null);
  
  const [isAddingChat, setIsAddingChat] = useState(false);
  const [newChatTitle, setNewChatTitle] = useState('');

  const previewFiles = (files) => {
    const filesArr = Array.from(files);
    filesArr.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedFiles(prev => [...prev, { file: file, preview: reader.result }]);
      };
      reader.readAsDataURL(file);
    });
  };

  const createNewChat = () => {
    setIsAddingChat(true);
    setNewChatTitle('');
  };

  const confirmNewChat = () => {
    if (!newChatTitle.trim()) {
      setNewChatTitle(`Chat ${chats.length + 1}`);
    }

    const newChatId = Date.now().toString();
    const newChat = {
      id: newChatId,
      title: newChatTitle.trim() || `Chat ${chats.length + 1}`,
      messages: [],
      createdAt: new Date(),
      pinned: false
    };
    setChats([...chats, newChat]);
    setActiveChat(newChatId);
    setIsAddingChat(false);
  };

  const deleteChat = (chatId) => {
    const updatedChats = chats.filter(chat => chat.id !== chatId);
    setChats(updatedChats);
    setActiveChat(updatedChats.length > 0 ? updatedChats[0].id : '');
  };

  const sendMessage = () => {
    if (!newMessage.trim() && selectedFiles.length === 0) return;
    
    const attachments = selectedFiles.map(item => ({
      url: URL.createObjectURL(item.file),
      name: item.file.name
    }));

    if (editingMessage) {
      setChats(chats.map(chat => chat.id === activeChat ? {
        ...chat,
        messages: chat.messages.map(msg =>
          msg.id === editingMessage.id
            ? { ...msg, text: newMessage, attachments }
            : msg
        )
      } : chat));
      setEditingMessage(null);
    } else {
      const newUserMessage = {
        id: Date.now().toString(),
        text: newMessage,
        sender: 'user',
        timestamp: new Date(),
        attachments
      };
      
      setChats(chats.map(chat =>
        chat.id === activeChat
          ? { ...chat, messages: [...chat.messages, newUserMessage] }
          : chat
      ));
    }
    
    setNewMessage('');
    setSelectedFiles([]);
  };

  const editMessage = (message) => {
    if (message.sender === 'user') {
      setNewMessage(message.text);
      setEditingMessage(message);
    }
  };

  const pinChat = (chatId) => {
    setChats(chats.map(chat =>
      chat.id === chatId ? { ...chat, pinned: !chat.pinned } : chat
    ));
  };

  return (
    <div className="w-full bg-gray-50_01"> 
      <Header /> 

      <div className="flex items-start"> 
        <Sidebar3 /> 
          <div className="flex flex-1">
            <div className="w-80 border-r bg-gray-100 flex flex-col max-h-[calc(100vh-120px)] overflow-hidden">
              <div className="p-4 flex justify-between items-center border-b sticky top-0 bg-gray-100 z-10">
                <h1 className="text-xl font-semibold">Chats</h1>
                <button
                  onClick={createNewChat}
                  className="p-2 rounded-full hover:bg-blue-200 transition-colors"
                >
                  <MessageSquarePlus />
                </button>
              </div>
              
              {isAddingChat && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                  <div className="bg-white p-6 rounded-lg shadow-xl w-96">
                    <h2 className="text-xl font-semibold mb-4">Create New Chat</h2>
                    <input 
                      type="text" 
                      value={newChatTitle}
                      onChange={(e) => setNewChatTitle(e.target.value)}
                      placeholder="Enter chat title" 
                      className="w-full px-3 py-2 border rounded-lg mb-4"
                      maxLength={50}
                    />
                    <div className="flex justify-end space-x-2">
                      <button 
                        onClick={() => setIsAddingChat(false)}
                        className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
                      >
                        Cancel
                      </button>
                      <button 
                        onClick={confirmNewChat}
                        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                      >
                        Create
                      </button>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex-1 overflow-y-auto">
                {chats
                  .sort((a, b) => b.pinned - a.pinned)
                  .map(chat => (
                    <div
                      key={chat.id}
                      className={`p-3 flex justify-between cursor-pointer relative ${
                        activeChat === chat.id
                          ? 'bg-blue-100'
                          : 'hover:bg-gray-50'
                      }`}
                      onClick={() => {
                        if (activeChat !== chat.id) {
                          setActiveChat(chat.id);
                          if (showOptions !== null) {
                            setShowOptions(null);
                          }
                        }
                      }}
                    >
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{chat.title}</p>
                        <p className="text-xs text-gray-500 truncate">
                          {chat.messages.length
                            ? chat.messages.slice(-1)[0].text
                            : 'No messages yet'}
                        </p>
                      </div>
                      <div className="absolute top-0 right-0">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setShowOptions(chat.id === showOptions ? null : chat.id);
                          }}
                          className="p-1 rounded-full hover:bg-blue-200 transition-colors"
                        >
                          <MoreVertical />
                        </button>
                        {showOptions === chat.id && (
                          <div className="chat-options absolute top-0 right-0 bg-gray-800 text-white shadow-md rounded p-2">
                            <button
                              onClick={() => pinChat(chat.id)}
                              className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-700"
                            >
                              <Pin size={16} /> {chat.pinned ? 'Unpin' : 'Pin'}
                            </button>
                            <button
                              onClick={() => deleteChat(chat.id)}
                              className="flex items-center gap-2 px-4 py-2 text-sm text-red-400 hover:bg-gray-700"
                            >
                              <Trash2 size={16} /> Delete
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
              </div>
            </div>
            
            <div className="flex-1 flex flex-col relative">
              {activeChat ? (
                <>
                  <div className="p-4 bg-white border-b flex flex-col">
                    <h2 className="text-lg font-medium">
                      {chats.find(chat => chat.id === activeChat)?.title}
                    </h2>
                    <p className="text-xs text-gray-500">
                      Created on:{' '}
                      {new Date(
                        chats.find(chat => chat.id === activeChat)?.createdAt
                      ).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex-1 overflow-y-auto p-4 bg-gray-100">
                    {chats
                      .find(chat => chat.id === activeChat)
                      ?.messages.map(message => (
                        <div
                          key={message.id}
                          className={`mb-4 flex ${
                            message.sender === 'user' ? 'justify-end' : 'justify-start'
                          }`}
                        >
                          <div
                            className={`p-4 rounded-2xl max-w-[70%] ${
                              message.sender === 'user'
                                ? 'bg-blue-500 text-white'
                                : 'bg-gray-200 text-black'
                            }`}
                          >
                            <p className="mb-1">{message.text}</p>
                            <p className="text-xs text-opacity-80">
                              {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </p>
                            {message.attachments && message.attachments.length > 0 && (
                              <div className="mt-2">
                                {message.attachments.map(file => (
                                  <div key={file.url} className="mt-2 text-sm">
                                    <a href={file.url} download className="underline">
                                      {file.name}
                                    </a>
                                  </div>
                                ))}
                              </div>
                            )}
                            {message.sender === 'user' && (
                              <button
                                onClick={() => editMessage(message)}
                                className="ml-2 text-sm opacity-70 hover:opacity-100 transition-opacity"
                              >
                                <Edit size={16} />
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                  </div>
                  
                  <div className="p-3 bg-white border-t flex flex-col sticky bottom-0 left-0 z-10">
                    <div className="flex items-center mb-2">
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className="p-2 rounded-full hover:bg-blue-200 transition-colors"
                      >
                        <Paperclip />
                      </button>
                      <input
                        ref={fileInputRef}
                        type="file"
                        onChange={(e) => previewFiles(e.target.files)}
                        className="hidden"
                        multiple
                      />
                    </div>
                    {selectedFiles.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-2">
                        {selectedFiles.map((item, index) => (
                          <div
                            key={index}
                            className="flex items-center border p-1 rounded"
                          >
                            {item.preview ? (
                              <img
                                src={item.preview}
                                alt={item.file.name}
                                className="h-8 w-8 object-cover mr-1"
                              />
                            ) : (
                              <span className="mr-1 text-xs">File</span>
                            )}
                            <span className="text-xs">{item.file.name}</span>
                            <button
                              onClick={() =>
                                setSelectedFiles(
                                  selectedFiles.filter((_, i) => i !== index)
                                )
                              }
                              className="ml-1 text-red-500"
                            >
                              <X size={14} />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                    <div className="flex items-center">
                      <input
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Type a message..."
                        className="flex-1 px-3 py-2 border rounded-lg"
                        onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                      />
                      <button
                        onClick={sendMessage}
                        className="p-2 bg-blue-500 text-white rounded-full ml-2 hover:bg-blue-600 transition-colors"
                      >
                        <Send />
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <p className="text-gray-500">Select a chat or create a new one</p>
                </div>
              )}
            </div>
          </div>
        </div>
    </div>
  );
}

export default ChatApp;