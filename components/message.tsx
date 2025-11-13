
'use client'

import React from 'react';

interface MessageProps {
  children: string;
  sender: string;

}

const Message: React.FC<MessageProps> = ({ children, sender}) => {
  if (sender=='sender'){
  return (
      <div className="bg-gray-500 text-white border p-1 max-w-2/3 w-fit ms-auto my-2 p-2 rounded-l-lg">
        {children}
    </div>
  )
  } if (sender=='receiver'){
    return (
     <div className="bg-gray-200 border p-1 max-w-2/3 w-fit my-2 p-2 rounded-r-lg">
        {children}
    </div>
    )
  }
};

export default Message;