"use client";

import { useState, useCallback } from "react";

export interface ContentBlock {
  id: string;
  type: "paragraph" | "heading" | "image" | "code" | "quote" | "list" | "divider" | "embed";
  data: any;
  order: number;
}

interface PostEditorProps {
  contentBlocks: ContentBlock[];
  onChange: (blocks: ContentBlock[]) => void;
  onContentChange?: (html: string) => void;
}

export function PostEditor({ contentBlocks, onChange, onContentChange }: PostEditorProps) {
  const [draggedBlock, setDraggedBlock] = useState<string | null>(null);

  const addBlock = useCallback((type: ContentBlock["type"], afterIndex?: number) => {
    const newBlock: ContentBlock = {
      id: Math.random().toString(36).substring(2, 15),
      type,
      data: getDefaultData(type),
      order: afterIndex !== undefined ? afterIndex + 1 : contentBlocks.length,
    };

    const updatedBlocks = [...contentBlocks];
    if (afterIndex !== undefined) {
      updatedBlocks.splice(afterIndex + 1, 0, newBlock);
      // Reorder all blocks
      updatedBlocks.forEach((block, idx) => {
        block.order = idx;
      });
    } else {
      updatedBlocks.push(newBlock);
    }

    onChange(updatedBlocks);
    updateHTMLContent(updatedBlocks);
  }, [contentBlocks, onChange]);

  const updateBlock = useCallback((id: string, data: any) => {
    const updatedBlocks = contentBlocks.map((block) =>
      block.id === id ? { ...block, data: { ...block.data, ...data } } : block
    );
    onChange(updatedBlocks);
    updateHTMLContent(updatedBlocks);
  }, [contentBlocks, onChange]);

  const deleteBlock = useCallback((id: string) => {
    const updatedBlocks = contentBlocks.filter((block) => block.id !== id);
    updatedBlocks.forEach((block, idx) => {
      block.order = idx;
    });
    onChange(updatedBlocks);
    updateHTMLContent(updatedBlocks);
  }, [contentBlocks, onChange]);

  const moveBlock = useCallback((fromIndex: number, toIndex: number) => {
    const updatedBlocks = [...contentBlocks];
    const [moved] = updatedBlocks.splice(fromIndex, 1);
    updatedBlocks.splice(toIndex, 0, moved);
    updatedBlocks.forEach((block, idx) => {
      block.order = idx;
    });
    onChange(updatedBlocks);
    updateHTMLContent(updatedBlocks);
  }, [contentBlocks, onChange]);

  const updateHTMLContent = (blocks: ContentBlock[]) => {
    if (!onContentChange) return;
    
    const html = blocks.map((block) => {
      switch (block.type) {
        case "heading":
          const level = block.data.level || 2;
          return `<h${level}>${block.data.text || ""}</h${level}>`;
        case "paragraph":
          return `<p>${block.data.text || ""}</p>`;
        case "image":
          return `<img src="${block.data.url || ""}" alt="${block.data.alt || ""}" />`;
        case "code":
          return `<pre><code>${block.data.code || ""}</code></pre>`;
        case "quote":
          return `<blockquote>${block.data.text || ""}</blockquote>`;
        case "list":
          const listTag = block.data.ordered ? "ol" : "ul";
          const items = (block.data.items || []).map((item: string) => `<li>${item}</li>`).join("");
          return `<${listTag}>${items}</${listTag}>`;
        case "divider":
          return `<hr />`;
        case "embed":
          return `<div class="embed">${block.data.html || ""}</div>`;
        default:
          return "";
      }
    }).join("\n");
    
    onContentChange(html);
  };

  const handleDragStart = (e: React.DragEvent, blockId: string) => {
    setDraggedBlock(blockId);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault();
    if (draggedBlock === null) return;

    const draggedIndex = contentBlocks.findIndex((b) => b.id === draggedBlock);
    if (draggedIndex !== -1 && draggedIndex !== targetIndex) {
      moveBlock(draggedIndex, targetIndex);
    }
    setDraggedBlock(null);
  };

  return (
    <div className="space-y-4">
      {contentBlocks.map((block, index) => (
        <div
          key={block.id}
          draggable
          onDragStart={(e) => handleDragStart(e, block.id)}
          onDragOver={handleDragOver}
          onDrop={(e) => handleDrop(e, index)}
          className="group relative rounded-lg border-2 border-transparent hover:border-slate-200 transition p-4"
        >
          {/* Block Toolbar */}
          <div className="absolute -left-12 top-0 opacity-0 group-hover:opacity-100 transition flex items-center gap-1">
            <button
              onClick={() => deleteBlock(block.id)}
              className="p-1.5 rounded text-red-600 hover:bg-red-50 transition"
              title="Delete block"
            >
              🗑️
            </button>
            <div className="w-2 h-2 rounded-full bg-slate-400 cursor-move" title="Drag to reorder" />
          </div>

          {/* Block Content */}
          <BlockRenderer
            block={block}
            onUpdate={(data) => updateBlock(block.id, data)}
          />

          {/* Add Block Button */}
          <div className="mt-2 flex justify-center">
            <button
              onClick={() => addBlock("paragraph", index)}
              className="px-3 py-1.5 text-sm text-slate-500 hover:text-slate-700 hover:bg-slate-50 rounded-lg transition opacity-0 group-hover:opacity-100"
            >
              + Add block
            </button>
          </div>
        </div>
      ))}

      {/* Add First Block */}
      {contentBlocks.length === 0 && (
        <div className="flex justify-center py-12 border-2 border-dashed border-slate-200 rounded-lg">
          <div className="text-center">
            <p className="text-sm text-slate-500 mb-4">Start writing your post</p>
            <div className="flex gap-2 flex-wrap justify-center">
              {[
                { type: "heading" as const, label: "Heading", icon: "📝" },
                { type: "paragraph" as const, label: "Text", icon: "📄" },
                { type: "image" as const, label: "Image", icon: "🖼️" },
                { type: "code" as const, label: "Code", icon: "💻" },
                { type: "quote" as const, label: "Quote", icon: "💬" },
              ].map((item) => (
                <button
                  key={item.type}
                  onClick={() => addBlock(item.type)}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white border border-slate-200 hover:bg-slate-50 transition text-sm font-medium"
                >
                  <span>{item.icon}</span>
                  <span>{item.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function BlockRenderer({ block, onUpdate }: { block: ContentBlock; onUpdate: (data: any) => void }) {
  switch (block.type) {
    case "heading":
      return (
        <HeadingBlock
          data={block.data}
          onUpdate={onUpdate}
        />
      );
    case "paragraph":
      return (
        <ParagraphBlock
          data={block.data}
          onUpdate={onUpdate}
        />
      );
    case "image":
      return (
        <ImageBlock
          data={block.data}
          onUpdate={onUpdate}
        />
      );
    case "code":
      return (
        <CodeBlock
          data={block.data}
          onUpdate={onUpdate}
        />
      );
    case "quote":
      return (
        <QuoteBlock
          data={block.data}
          onUpdate={onUpdate}
        />
      );
    case "list":
      return (
        <ListBlock
          data={block.data}
          onUpdate={onUpdate}
        />
      );
    case "divider":
      return <hr className="my-4 border-slate-200" />;
    case "embed":
      return (
        <EmbedBlock
          data={block.data}
          onUpdate={onUpdate}
        />
      );
    default:
      return null;
  }
}

function HeadingBlock({ data, onUpdate }: { data: any; onUpdate: (data: any) => void }) {
  const [text, setText] = useState(data.text || "");
  const [level, setLevel] = useState(data.level || 2);

  const handleChange = (newText: string) => {
    setText(newText);
    onUpdate({ text: newText, level });
  };

  const handleLevelChange = (newLevel: number) => {
    setLevel(newLevel);
    onUpdate({ text, level: newLevel });
  };

  const renderHeading = () => {
    const headingProps = {
      contentEditable: true,
      suppressContentEditableWarning: true,
      onBlur: (e: React.FocusEvent<HTMLHeadingElement>) => handleChange(e.currentTarget.textContent || ""),
      className: "outline-none font-bold text-slate-900",
      style: {
        fontSize: level === 1 ? "2rem" : level === 2 ? "1.75rem" : level === 3 ? "1.5rem" : "1.25rem",
      } as React.CSSProperties,
      children: text || "Heading",
    };

    switch (level) {
      case 1:
        return <h1 {...headingProps} />;
      case 2:
        return <h2 {...headingProps} />;
      case 3:
        return <h3 {...headingProps} />;
      case 4:
        return <h4 {...headingProps} />;
      default:
        return <h2 {...headingProps} />;
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <select
          value={level}
          onChange={(e: React.ChangeEvent<HTMLSelectElement>) => handleLevelChange(Number(e.target.value))}
          className="text-xs font-medium text-slate-600 border border-slate-200 rounded px-2 py-1"
        >
          <option value={1}>H1</option>
          <option value={2}>H2</option>
          <option value={3}>H3</option>
          <option value={4}>H4</option>
        </select>
      </div>
      {renderHeading()}
    </div>
  );
}

function ParagraphBlock({ data, onUpdate }: { data: any; onUpdate: (data: any) => void }) {
  const [text, setText] = useState(data.text || "");

  const handleChange = (newText: string) => {
    setText(newText);
    onUpdate({ text: newText });
  };

  return (
    <div className="relative">
      <p
        contentEditable
        suppressContentEditableWarning
        onBlur={(e: React.FocusEvent<HTMLParagraphElement>) => handleChange(e.currentTarget.textContent || "")}
        className="outline-none text-slate-700 leading-relaxed min-h-[1.5rem]"
      >
        {text || ""}
      </p>
      {!text && (
        <span className="absolute left-0 top-0 pointer-events-none text-slate-400 italic">
          Start typing...
        </span>
      )}
    </div>
  );
}

function ImageBlock({ data, onUpdate }: { data: any; onUpdate: (data: any) => void }) {
  const [url, setUrl] = useState(data.url || "");
  const [alt, setAlt] = useState(data.alt || "");
  const [caption, setCaption] = useState(data.caption || "");

  const handleUrlChange = (newUrl: string) => {
    setUrl(newUrl);
    onUpdate({ url: newUrl, alt, caption });
  };

  const handleAltChange = (newAlt: string) => {
    setAlt(newAlt);
    onUpdate({ url, alt: newAlt, caption });
  };

  const handleCaptionChange = (newCaption: string) => {
    setCaption(newCaption);
    onUpdate({ url, alt, caption: newCaption });
  };

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <input
          type="text"
          value={url}
          onChange={(e) => handleUrlChange(e.target.value)}
          placeholder="Image URL"
          className="flex-1 rounded-lg border border-slate-200 px-3 py-2 text-sm"
        />
        <input
          type="text"
          value={alt}
          onChange={(e) => handleAltChange(e.target.value)}
          placeholder="Alt text"
          className="flex-1 rounded-lg border border-slate-200 px-3 py-2 text-sm"
        />
      </div>
      {url && (
        <div className="relative w-full h-64 rounded-lg overflow-hidden bg-slate-100">
          <img
            src={url}
            alt={alt}
            className="w-full h-full object-contain"
            onError={(e) => {
              e.currentTarget.style.display = "none";
            }}
          />
        </div>
      )}
      {url && (
        <input
          type="text"
          value={caption}
          onChange={(e) => handleCaptionChange(e.target.value)}
          placeholder="Image caption (optional)"
          className="w-full text-sm text-slate-500 text-center border-none outline-none"
        />
      )}
    </div>
  );
}

function CodeBlock({ data, onUpdate }: { data: any; onUpdate: (data: any) => void }) {
  const [code, setCode] = useState(data.code || "");
  const [language, setLanguage] = useState(data.language || "javascript");

  const handleChange = (newCode: string) => {
    setCode(newCode);
    onUpdate({ code: newCode, language });
  };

  return (
    <div className="space-y-2">
      <select
        value={language}
        onChange={(e) => {
          setLanguage(e.target.value);
          onUpdate({ code, language: e.target.value });
        }}
        className="text-xs font-medium text-slate-600 border border-slate-200 rounded px-2 py-1"
      >
        <option value="javascript">JavaScript</option>
        <option value="typescript">TypeScript</option>
        <option value="python">Python</option>
        <option value="html">HTML</option>
        <option value="css">CSS</option>
        <option value="json">JSON</option>
        <option value="bash">Bash</option>
      </select>
      <pre className="bg-slate-900 text-slate-100 rounded-lg p-4 overflow-x-auto">
        <code
          contentEditable
          suppressContentEditableWarning
          onBlur={(e) => handleChange(e.currentTarget.textContent || "")}
          className="outline-none font-mono text-sm whitespace-pre"
        >
          {code || "// Enter your code here"}
        </code>
      </pre>
    </div>
  );
}

function QuoteBlock({ data, onUpdate }: { data: any; onUpdate: (data: any) => void }) {
  const [text, setText] = useState(data.text || "");
  const [author, setAuthor] = useState(data.author || "");

  const handleTextChange = (newText: string) => {
    setText(newText);
    onUpdate({ text: newText, author });
  };

  const handleAuthorChange = (newAuthor: string) => {
    setAuthor(newAuthor);
    onUpdate({ text, author: newAuthor });
  };

  return (
    <div className="border-l-4 border-blue-500 pl-4 py-2 space-y-2">
      <blockquote
        contentEditable
        suppressContentEditableWarning
        onBlur={(e) => handleTextChange(e.currentTarget.textContent || "")}
        className="outline-none text-slate-700 italic text-lg"
      >
        {text || "Quote text"}
      </blockquote>
      {author && (
        <p className="text-sm text-slate-500">— {author}</p>
      )}
      <input
        type="text"
        value={author}
        onChange={(e) => handleAuthorChange(e.target.value)}
        placeholder="Author (optional)"
        className="text-sm text-slate-500 border-none outline-none bg-transparent"
      />
    </div>
  );
}

function ListBlock({ data, onUpdate }: { data: any; onUpdate: (data: any) => void }) {
  const [items, setItems] = useState<string[]>(data.items || [""]);
  const [ordered, setOrdered] = useState(data.ordered || false);

  const handleItemChange = (index: number, value: string) => {
    const newItems = [...items];
    newItems[index] = value;
    setItems(newItems);
    onUpdate({ items: newItems, ordered });
  };

  const addItem = () => {
    const newItems = [...items, ""];
    setItems(newItems);
    onUpdate({ items: newItems, ordered });
  };

  const removeItem = (index: number) => {
    const newItems = items.filter((_, i) => i !== index);
    setItems(newItems);
    onUpdate({ items: newItems, ordered });
  };

  const ListTag = ordered ? "ol" : "ul";

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <button
          onClick={() => {
            setOrdered(!ordered);
            onUpdate({ items, ordered: !ordered });
          }}
          className="text-xs font-medium text-slate-600 border border-slate-200 rounded px-2 py-1 hover:bg-slate-50"
        >
          {ordered ? "Ordered" : "Unordered"}
        </button>
      </div>
      <ListTag className="list-disc list-inside space-y-1 ml-4">
        {items.map((item, index) => (
          <li key={index} className="flex items-center gap-2">
            <input
              type="text"
              value={item}
              onChange={(e) => handleItemChange(index, e.target.value)}
              placeholder={`Item ${index + 1}`}
              className="flex-1 border-none outline-none text-slate-700"
            />
            {items.length > 1 && (
              <button
                onClick={() => removeItem(index)}
                className="text-red-600 hover:text-red-700 text-sm"
              >
                ×
              </button>
            )}
          </li>
        ))}
      </ListTag>
      <button
        onClick={addItem}
        className="text-sm text-blue-600 hover:text-blue-700"
      >
        + Add item
      </button>
    </div>
  );
}

function EmbedBlock({ data, onUpdate }: { data: any; onUpdate: (data: any) => void }) {
  const [html, setHtml] = useState(data.html || "");
  const [url, setUrl] = useState(data.url || "");

  const handleChange = (newHtml: string) => {
    setHtml(newHtml);
    onUpdate({ html: newHtml, url });
  };

  return (
    <div className="space-y-2">
      <input
        type="text"
        value={url}
        onChange={(e) => {
          setUrl(e.target.value);
          onUpdate({ html, url: e.target.value });
        }}
        placeholder="Embed URL (YouTube, Twitter, etc.)"
        className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
      />
      <textarea
        value={html}
        onChange={(e) => handleChange(e.target.value)}
        placeholder="Or paste embed HTML code"
        className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm font-mono min-h-[100px]"
      />
      {html && (
        <div
          className="border border-slate-200 rounded-lg p-4"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      )}
    </div>
  );
}

function getDefaultData(type: ContentBlock["type"]): any {
  switch (type) {
    case "heading":
      return { text: "", level: 2 };
    case "paragraph":
      return { text: "" };
    case "image":
      return { url: "", alt: "", caption: "" };
    case "code":
      return { code: "", language: "javascript" };
    case "quote":
      return { text: "", author: "" };
    case "list":
      return { items: [""], ordered: false };
    case "divider":
      return {};
    case "embed":
      return { html: "", url: "" };
    default:
      return {};
  }
}

