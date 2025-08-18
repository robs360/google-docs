"use client"

import * as React from "react"
import { EditorContent, EditorContext, useEditor } from "@tiptap/react"
import { StarterKit } from "@tiptap/starter-kit"
import { Image } from "@tiptap/extension-image"
import { TaskItem } from "@tiptap/extension-task-item"
import { TaskList } from "@tiptap/extension-task-list"
import { TextAlign } from "@tiptap/extension-text-align"
import { Typography } from "@tiptap/extension-typography"
import { Highlight } from "@tiptap/extension-highlight"
import { Subscript } from "@tiptap/extension-subscript"
import { Superscript } from "@tiptap/extension-superscript"
import { Underline } from "@tiptap/extension-underline"
import { useEffect, useState } from "react";
import { Link } from "@/components/tiptap-extension/link-extension"
import { Selection } from "@/components/tiptap-extension/selection-extension"
import { TrailingNode } from "@/components/tiptap-extension/trailing-node-extension"
import { Toolbar } from "@/components/tiptap-ui-primitive/toolbar"
import { ImageUploadNode } from "@/components/tiptap-node/image-upload-node/image-upload-node-extension"
import "@/components/tiptap-node/code-block-node/code-block-node.scss"
import "@/components/tiptap-node/list-node/list-node.scss"
import "@/components/tiptap-node/image-node/image-node.scss"
import "@/components/tiptap-node/paragraph-node/paragraph-node.scss"
import { useMobile } from "@/hooks/use-mobile"
import { useWindowSize } from "@/hooks/use-window-size"
import { useCursorVisibility } from "@/hooks/use-cursor-visibility"
import "@/components/tiptap-templates/simple/simple-editor.scss"
import axios from "axios"
import { saveDocs } from "@/utils/saveDocs"
import { getSocket } from "@/utils/socket"
import { OnlineUser } from "@/utils/types"
import { MainToolbarContent, MobileToolbarContent } from "@/components/MainToolbarContent"


export function SimpleEditor({ id }: { id: string }) {
  let saveTimeout: ReturnType<typeof setTimeout> | null = null
  const [content, setContent] = useState<any>(null);
  const isMobile = useMobile()
  const windowSize = useWindowSize()
  const [mobileView, setMobileView] = React.useState<
    "main" | "highlighter" | "link"
  >("main")
  const toolbarRef = React.useRef<HTMLDivElement>(null)
  const [token, setToken] = useState<string | null>(null);
  const [onlineUsers, setOnlineUsers] = useState<OnlineUser[]>([]);
  const [share,setShare]=useState<any>([])
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    setToken(storedToken);
  }, []);

  const editor = useEditor({
    immediatelyRender: false,
    editorProps: {
      attributes: {
        autocomplete: "off",
        autocorrect: "off",
        autocapitalize: "off",
        "aria-label": "Main content area, start typing to enter text.",
      },
    },
    extensions: [
      StarterKit, // 🔴 this is mandatory
      Image,
      TaskItem,
      TaskList,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Typography,
      Highlight,
      Subscript,
      Superscript,
      Underline,
      Link,
      Selection,
      TrailingNode,
      ImageUploadNode,
      // any others...
    ],
    content: content,
    onUpdate: ({ editor }) => {
      const updatedContent = editor.getJSON()
      setContent(updatedContent)

      const socket = getSocket()
      if (socket.connected) { 
        socket.emit('send-changes', {
          documentId: id,
          content: updatedContent
        })
      }

      if (saveTimeout) clearTimeout(saveTimeout)  // clear previous timeout
      saveTimeout = setTimeout(() => {
        if (token) {
          saveDocs({ id, content: updatedContent, token }).catch(console.error)
        }
      }, 1500)
    }
  })

  useEffect(() => {
    const storedToken = localStorage.getItem("token");

    if (!id || !storedToken) {
      return;
    }

    const fetchContent = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/document/${id}`,
          {
            headers: {
              Authorization: `Bearer ${storedToken}`,
            },
            timeout: 1500, // add a timeout to avoid silent hangs
          }
        );
        
        setContent(response.data.document.content);
        if (editor && response.data.document.content) {
          editor.commands.setContent(response.data.document.content, false)
        }

      } catch (error: any) {
        setContent({ type: "doc", content: [] });
      }
    };

    fetchContent();
  }, [id, token, editor]);

  useEffect(() => {
    if (!id || !editor) return;

    const socket = getSocket();

    let userInfo = {
      email: "Anonymous",
      image: "https://via.placeholder.com/150/cccccc/666666?text=A"
    };

    const userData = localStorage.getItem("user");

    if (userData) {
      try {
        const user = JSON.parse(userData);
        userInfo = {
          email: user.email || "Anonymous",
          image: user.image || "https://via.placeholder.com/150"
        };
       
      } catch (error) {
        console.error("Failed to parse user data:", error);
      }
    }

    const joinDocument = () => {
      socket.emit('join-document', { documentId: id, user: userInfo });
    };

    const handleDocumentUsers = (users: OnlineUser[]) => {
      setOnlineUsers(users);
    };

    const handleConnect = () => {
      joinDocument();
    };

    const handleDisconnect = () => {
      setOnlineUsers([]);
    };

   socket.on('receive-changes', (newContent: any) => {
    if (editor && JSON.stringify(editor.getJSON()) !== JSON.stringify(newContent)) {
      editor.commands.setContent(newContent, false); 
      console.log("frontend reciving changes ", newContent)
      setContent(newContent); 
    }
  })

    socket.on('connect', handleConnect);
    socket.on('disconnect', handleDisconnect);
    socket.on('document-users', handleDocumentUsers);

    if (socket.connected) {
      joinDocument();
    } else {
      console.log('🟡 Socket not connected, waiting for connection...');
    }

    return () => {

      socket.off('connect', handleConnect);
      socket.off('disconnect', handleDisconnect);
      socket.off('document-users', handleDocumentUsers);
      socket.off('receive-changes');
      if (socket.connected) {
        socket.emit('leave-document', { documentId: id, user: userInfo });
      }

    };
  }, [id, editor]);

  const bodyRect = useCursorVisibility({
    editor,
    overlayHeight: toolbarRef.current?.getBoundingClientRect().height ?? 0,
  })

  React.useEffect(() => {
    if (!isMobile && mobileView !== "main") {
      setMobileView("main")
    }
  }, [isMobile, mobileView])

  if (!content) return <p className="text-center">Loading.....</p>

  return (
    <div>
      {/* Online Users Display */}
      <div className="flex items-center gap-2 p-3">
        {onlineUsers.length > 0 && (
          <>

            {onlineUsers.map((user, index) => (
              <div key={`${user.socketId}-${user.email}`} className="relative group">
                <img
                  src={user.image}
                  className="rounded-full h-9 w-9 object-cover border-2 border-green-500 shadow-sm"
                  alt={user.email}
                  title={user.email}
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = "https://via.placeholder.com/36/cccccc/666666?text=" + user.email.charAt(0).toUpperCase();
                  }}
                />
                {/* Tooltip */}
                <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none z-10">
                  {user.email}
                </div>
                {/* Online indicator */}
                <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
              </div>
            ))}
          </>
        )}
      </div>

      <EditorContext.Provider value={{ editor }}>
        <Toolbar
          ref={toolbarRef}
          style={
            isMobile
              ? {
                bottom: `calc(100% - ${windowSize.height - bodyRect.y}px)`,
              }
              : {}
          }
        >
          {mobileView === "main" ? (
            <MainToolbarContent
              onHighlighterClick={() => setMobileView("highlighter")}
              onLinkClick={() => setMobileView("link")}
              isMobile={isMobile}
            />
          ) : (
            <MobileToolbarContent
              type={mobileView === "highlighter" ? "highlighter" : "link"}
              onBack={() => setMobileView("main")}
            />
          )}
        </Toolbar>

        <div className="content-wrapper">
          <EditorContent
            editor={editor}
            role="presentation"
            className="simple-editor-content"
          />
        </div>
      </EditorContext.Provider>
    </div>
  )
}