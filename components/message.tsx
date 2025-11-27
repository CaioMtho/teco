
'use client'

import React from 'react';

interface MessageProps {
  children: React.ReactNode;
  sender: 'sender' | 'receiver';
  isProposal?: boolean;
}

const Message: React.FC<MessageProps> = ({ children, sender, isProposal }) => {
  if (isProposal) {
    return (
      <div className="border p-2 max-w-[70%] w-fit my-2 rounded-lg bg-white shadow-sm">
        <div className="text-sm text-neutral-700">{children}</div>
      </div>
    )
  }

  if (sender === 'sender') {
    return (
      <div className="bg-gray-500 text-white border p-1 max-w-2/3 w-fit ms-auto my-2 p-2 rounded-l-lg">
        {children}
      </div>
    )
  }

  if (sender === 'receiver') {
    return (
      <div className="bg-gray-200 border p-1 max-w-2/3 w-fit my-2 p-2 rounded-r-lg">
        {children}
      </div>
    )
  }

  return null
}

export default Message;