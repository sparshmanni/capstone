// "use client";
// import React, { useEffect, useRef } from "react";
// import ReactMarkdown from "react-markdown";

// export default function ChatWindow({ messages }) {
//   const endRef = useRef(null);

//   // Auto-scroll to the latest message
//   useEffect(() => {
//     endRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [messages]);

//   return (
//     <div
//       className="chat-messages"
//       style={{
//         display: "flex",
//         flexDirection: "column",
//         gap: "0.5rem",
//         padding: "1rem",
//         minHeight: "100%",
//         overflowY: "auto",
//       }}
//     >
//       {messages.map((msg) => (
//         <div
//           key={msg.id}
//           style={{
//             alignSelf: msg.role === "user" ? "flex-end" : "flex-start",
//             background: msg.role === "user" ? "#0078ff" : "#e5e5ea",
//             color: msg.role === "user" ? "#fff" : "#000",
//             padding: "0.6rem 1rem",
//             borderRadius: "15px",
//             maxWidth: "70%",
//             wordWrap: "break-word",
//             whiteSpace: "pre-wrap", // preserves line breaks
//           }}
//         >
//           <ReactMarkdown
//             components={{
//               // Optional: style links inside messages
//               a: ({ node, ...props }) => (
//                 <a
//                   {...props}
//                   style={{ color: msg.role === "user" ? "#fff" : "#0078ff" }}
//                   target="_blank"
//                   rel="noopener noreferrer"
//                 />
//               ),
//               // Optional: style code blocks
//               code: ({ node, ...props }) => (
//                 <code
//                   {...props}
//                   style={{
//                     background: "#f5f5f5",
//                     padding: "2px 4px",
//                     borderRadius: "4px",
//                     fontFamily: "monospace",
//                   }}
//                 />
//               ),
//             }}
//           >
//             {msg.text}
//           </ReactMarkdown>
//         </div>
//       ))}
//       <div ref={endRef} />
//     </div>
//   );
// }























"use client";
import React, { useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";

export default function ChatWindow({ messages }) {
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div
      className="chat-messages"
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
        padding: "1rem",
        minHeight: "100%",
        overflowY: "auto",
      }}
    >
      {messages.map((msg) => {
        const isUser = msg.role === "user";
        const isAI = msg.role === "assistant";

        return (
          <div
            key={msg.id}
            style={{
              alignSelf: isUser ? "flex-end" : "flex-start",
              background: isUser ? "#0078ff" : "#e5e5ea",
              color: isUser ? "#fff" : "#000",
              padding: "0.8rem 1rem",
              borderRadius: "15px",
              maxWidth: "70%",
              wordWrap: "break-word",
              whiteSpace: "pre-wrap",
              display: "flex",
              flexDirection: isUser ? "row-reverse" : "row",
              gap: "10px",
            }}
          >
            {/* ------- ICONS FOR BOTH SIDES ------- */}

            {isAI && (
              <div style={{ display: "flex", alignItems: "flex-start" }}>
                <lord-icon
                  src="https://cdn.lordicon.com/zvnxzuwv.json"
                  trigger="in"
                  delay="2000"
                  colors="primary:#000000,secondary:#000000"
                  style={{ width: "30px", height: "30px" }}
                ></lord-icon>
              </div>
            )}

            {isUser && (
              <div style={{ display: "flex", alignItems: "flex-start" }}>
                <lord-icon
                  src="https://cdn.lordicon.com/shcfcebj.json"
                  trigger="in"
                  delay="1500"
                  state="in-reveal"
                  colors="primary:#ffffff,secondary:#ffffff"
                  style={{ width: "30px", height: "30px" }}
                ></lord-icon>
              </div>
            )}

            {/* -------- TEXT ---------- */}
            <div style={{ flex: 1 }}>
              <ReactMarkdown
                components={{
                  a: ({ node, ...props }) => (
                    <a
                      {...props}
                      style={{
                        color: isUser ? "#fff" : "#0078ff",
                      }}
                      target="_blank"
                      rel="noopener noreferrer"
                    />
                  ),
                  code: ({ node, ...props }) => (
                    <code
                      {...props}
                      style={{
                        background: "#f5f5f5",
                        padding: "2px 4px",
                        borderRadius: "4px",
                        fontFamily: "monospace",
                      }}
                    />
                  ),
                }}
              >
                {msg.text}
              </ReactMarkdown>
            </div>
          </div>
        );
      })}

      <div ref={endRef} />
    </div>
  );
}
