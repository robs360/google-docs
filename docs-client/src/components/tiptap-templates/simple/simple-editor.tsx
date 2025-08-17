"use client"

import * as React from "react"
import { EditorContent, EditorContext, useEditor } from "@tiptap/react"

// --- Tiptap Core Extensions ---
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
// --- Custom Extensions ---
import { Link } from "@/components/tiptap-extension/link-extension"
import { Selection } from "@/components/tiptap-extension/selection-extension"
import { TrailingNode } from "@/components/tiptap-extension/trailing-node-extension"

// --- UI Primitives ---
import { Button } from "@/components/tiptap-ui-primitive/button"
import { Spacer } from "@/components/tiptap-ui-primitive/spacer"
import {
  Toolbar,
  ToolbarGroup,
  ToolbarSeparator,
} from "@/components/tiptap-ui-primitive/toolbar"

// --- Tiptap Node ---
import { ImageUploadNode } from "@/components/tiptap-node/image-upload-node/image-upload-node-extension"
import "@/components/tiptap-node/code-block-node/code-block-node.scss"
import "@/components/tiptap-node/list-node/list-node.scss"
import "@/components/tiptap-node/image-node/image-node.scss"
import "@/components/tiptap-node/paragraph-node/paragraph-node.scss"

// --- Tiptap UI ---
import { HeadingDropdownMenu } from "@/components/tiptap-ui/heading-dropdown-menu"
import { ImageUploadButton } from "@/components/tiptap-ui/image-upload-button"
import { ListDropdownMenu } from "@/components/tiptap-ui/list-dropdown-menu"
import { BlockquoteButton } from "@/components/tiptap-ui/blockquote-button"
import { CodeBlockButton } from "@/components/tiptap-ui/code-block-button"
import {
  ColorHighlightPopover,
  ColorHighlightPopoverContent,
  ColorHighlightPopoverButton,
} from "@/components/tiptap-ui/color-highlight-popover"
import {
  LinkPopover,
  LinkContent,
  LinkButton,
} from "@/components/tiptap-ui/link-popover"
import { MarkButton } from "@/components/tiptap-ui/mark-button"
import { TextAlignButton } from "@/components/tiptap-ui/text-align-button"
import { UndoRedoButton } from "@/components/tiptap-ui/undo-redo-button"

// --- Icons ---
import { ArrowLeftIcon } from "@/components/tiptap-icons/arrow-left-icon"
import { HighlighterIcon } from "@/components/tiptap-icons/highlighter-icon"
import { LinkIcon } from "@/components/tiptap-icons/link-icon"

// --- Hooks ---
import { useMobile } from "@/hooks/use-mobile"
import { useWindowSize } from "@/hooks/use-window-size"
import { useCursorVisibility } from "@/hooks/use-cursor-visibility"


// --- Styles ---
import "@/components/tiptap-templates/simple/simple-editor.scss"
import axios from "axios"
import { saveDocs } from "@/utils/saveDocs"
import { getSocket } from "@/utils/socket"



const MainToolbarContent = ({
  onHighlighterClick,
  onLinkClick,
  isMobile,
}: {
  onHighlighterClick: () => void
  onLinkClick: () => void
  isMobile: boolean
}) => {
  return (
    <>
      <Spacer />

      <ToolbarSeparator />

      <ToolbarGroup>
        <HeadingDropdownMenu levels={[1, 2, 3, 4]} />
        <ListDropdownMenu types={["bulletList", "orderedList", "taskList"]} />
        <BlockquoteButton />
        <CodeBlockButton />
      </ToolbarGroup>

      <ToolbarSeparator />

      <ToolbarGroup>
        <MarkButton type="bold" />
        <MarkButton type="italic" />

        <MarkButton type="code" />
        <MarkButton type="underline" />
        {!isMobile ? (
          <ColorHighlightPopover />
        ) : (
          <ColorHighlightPopoverButton onClick={onHighlighterClick} />
        )}
        {!isMobile ? <LinkPopover /> : <LinkButton onClick={onLinkClick} />}
      </ToolbarGroup>



      <ToolbarSeparator />

      <ToolbarGroup>
        <TextAlignButton align="left" />
        <TextAlignButton align="center" />
        <TextAlignButton align="right" />
        <TextAlignButton align="justify" />
      </ToolbarGroup>

      <ToolbarSeparator />

      <ToolbarGroup>
        <ImageUploadButton text="Add" />
      </ToolbarGroup>

      <Spacer />

      {isMobile && <ToolbarSeparator />}


    </>
  )
}

const MobileToolbarContent = ({
  type,
  onBack,
}: {
  type: "highlighter" | "link"
  onBack: () => void
}) => (
  <>
    <ToolbarGroup>
      <Button data-style="ghost" onClick={onBack}>
        <ArrowLeftIcon className="tiptap-button-icon" />
        {type === "highlighter" ? (
          <HighlighterIcon className="tiptap-button-icon" />
        ) : (
          <LinkIcon className="tiptap-button-icon" />
        )}
      </Button>
    </ToolbarGroup>

    <ToolbarSeparator />

    {type === "highlighter" ? (
      <ColorHighlightPopoverContent />
    ) : (
      <LinkContent />
    )}
  </>
)
interface OnlineUser {
  socketId: string;
  email: string;
  image: string;
}
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
  }, [id, token]);

  useEffect(() => {
    if (!id) return;

    const socket = getSocket();

    let userInfo = { name: "Anonymous", image: "https://via.placeholder.com/150" };
    const userData = localStorage.getItem("user");

    if (userData) {
      try {
        const user = JSON.parse(userData);
        userInfo = { name: user.email || "Anonymous", image: user.image || "https://via.placeholder.com/150" };
      } catch (error) {
        console.error("Failed to parse user data:", error);
      }
    }
    socket.emit('join-document', { documentId: id, user: userInfo });

    socket.on('document-users', (users: OnlineUser[]) => {
      setOnlineUsers(users);
    });
    return () => {
      socket.disconnect();
    };
  }, [id]);
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
      <div>
        {
          onlineUsers.map((user) => (
            <img
              key={user.email} // It's good practice to use a unique key, like the user's email
              src={user.image}
              className="rounded-full h-8 w-8 object-cover"
              alt={user.email}
              title={user.email}
            />
          ))
        }
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
