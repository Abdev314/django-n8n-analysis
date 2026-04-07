interface MessageBubbleProps {
  content: string;
  isUser: boolean;
}

export const MessageBubble = ({ content, isUser }: MessageBubbleProps) => {
  return (
    <div
      className={`flex w-full ${isUser ? 'justify-end' : 'justify-start'} mb-3`}
    >
      <div
        className={`
          max-w-[80%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed
          transition-all duration-200
          ${
            isUser
              ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-br-md shadow-md hover:shadow-lg'
              : 'bg-gray-100 text-gray-800 rounded-bl-md shadow-sm hover:shadow-md border border-gray-200'
          }
        `}
      >
        {content}
      </div>
    </div>
  );
};