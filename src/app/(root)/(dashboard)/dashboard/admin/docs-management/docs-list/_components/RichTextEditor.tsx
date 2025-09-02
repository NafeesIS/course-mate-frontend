'use client';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import { Color } from '@tiptap/extension-color';
import FontFamily from '@tiptap/extension-font-family';
import Highlight from '@tiptap/extension-highlight';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import Subscript from '@tiptap/extension-subscript';
import Superscript from '@tiptap/extension-superscript';
import { Table } from '@tiptap/extension-table';
import TableCell from '@tiptap/extension-table-cell';
import TableHeader from '@tiptap/extension-table-header';
import TableRow from '@tiptap/extension-table-row';
import TextAlign from '@tiptap/extension-text-align';
import { TextStyle } from '@tiptap/extension-text-style';
import Underline from '@tiptap/extension-underline';
import { Editor, EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import {
  AlignCenter,
  AlignJustify,
  AlignLeft,
  AlignRight,
  Bold,
  ChevronDown,
  Code,
  Download,
  Eye,
  EyeOff,
  Heading1,
  Heading2,
  Heading3,
  Highlighter,
  Italic,
  Link as LinkIcon,
  List,
  ListOrdered,
  Maximize,
  Minimize,
  Minus,
  Palette,
  Quote,
  Redo,
  Strikethrough,
  Subscript as SubscriptIcon,
  Superscript as SuperscriptIcon,
  Table as TableIcon,
  Underline as UnderlineIcon,
  Undo,
  Upload,
  X,
} from 'lucide-react';
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import { RiIndentDecrease, RiIndentIncrease } from 'react-icons/ri';

interface RichTextEditorProps {
  value?: string;
  // eslint-disable-next-line no-unused-vars
  onChange?: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  minHeight?: string;
  error?: boolean;
  isFullScreen: boolean;
  setIsFullScreen: any;
}

interface MenuBarProps {
  editor: Editor;
  disabled?: boolean;
  isPreviewMode: boolean;
  isFullScreen: boolean;
  onTogglePreview: () => void;
  onToggleFullScreen: () => void;
}
interface PreviewContentProps {
  open?: boolean;
  // eslint-disable-next-line no-unused-vars
  onOpenChange?: (open: boolean) => void;
  content: string;
}

// Custom font size extension
// const FontSize = TextStyle.extend({
//   addAttributes() {
//     return {
//       fontSize: {
//         default: null,
//         parseHTML: (element: any) => element.style.fontSize.replace('px', ''),
//         renderHTML: (attributes: any) => {
//           if (!attributes.fontSize) return {};
//           return { style: `font-size: ${attributes.fontSize}px` };
//         },
//       },
//     };
//   },
// });

// // Line height extension
// const LineHeight = TextStyle.extend({
//   addAttributes() {
//     return {
//       lineHeight: {
//         default: null,
//         parseHTML: (element: any) => element.style.lineHeight,
//         renderHTML: (attributes: any) => {
//           if (!attributes.lineHeight) return {};
//           return { style: `line-height: ${attributes.lineHeight}` };
//         },
//       },
//     };
//   },
// });

const MenuBar: React.FC<MenuBarProps> = ({
  editor,
  disabled,
  isPreviewMode,
  isFullScreen,
  onTogglePreview,
  onToggleFullScreen,
}) => {
  const [linkUrl, setLinkUrl] = useState('');
  const [isLinkDialogOpen, setIsLinkDialogOpen] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showHighlightPicker, setShowHighlightPicker] = useState(false);
  // const [showFontPicker, setShowFontPicker] = useState(false);
  const [showFontSizePicker, setShowFontSizePicker] = useState(false);
  const [customFontSize, setCustomFontSize] = useState('');
  const [showTableMenu, setShowTableMenu] = useState(false);

  const colorPickerRef = useRef<HTMLDivElement>(null);
  const highlightPickerRef = useRef<HTMLDivElement>(null);
  // const fontPickerRef = useRef<HTMLDivElement>(null);
  const fontSizePickerRef = useRef<HTMLDivElement>(null);
  const tableMenuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const bgColorButtonRef = useRef<HTMLButtonElement>(null);
  const textColorButtonRef = useRef<HTMLButtonElement>(null);
  const fontSizeButtonRef = useRef<HTMLButtonElement>(null);
  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        colorPickerRef.current &&
        !colorPickerRef.current.contains(event.target as Node)
      ) {
        setShowColorPicker(false);
      }
      if (
        highlightPickerRef.current &&
        !highlightPickerRef.current.contains(event.target as Node)
      ) {
        setShowHighlightPicker(false);
      }
      // if (
      //   fontPickerRef.current &&
      //   !fontPickerRef.current.contains(event.target as Node)
      // ) {
      //   setShowFontPicker(false);
      // }
      if (
        fontSizePickerRef.current &&
        !fontSizePickerRef.current.contains(event.target as Node)
      ) {
        setShowFontSizePicker(false);
      }
      if (
        tableMenuRef.current &&
        !tableMenuRef.current.contains(event.target as Node)
      ) {
        setShowTableMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const addLink = useCallback(() => {
    if (linkUrl) {
      editor
        .chain()
        .focus()
        .extendMarkRange('link')
        .setLink({ href: linkUrl })
        .run();
      setLinkUrl('');
      setIsLinkDialogOpen(false);
    }
  }, [editor, linkUrl]);

  const removeLink = useCallback(() => {
    editor.chain().focus().extendMarkRange('link').unsetLink().run();
  }, [editor]);

  const toggleLink = useCallback(() => {
    const previousUrl = editor.getAttributes('link').href;
    if (previousUrl) {
      removeLink();
    } else {
      setIsLinkDialogOpen(true);
    }
  }, [editor, removeLink]);

  const colors = [
    '#000000',
    '#e60000',
    '#ff9900',
    '#ffff00',
    '#008a00',
    '#0066cc',
    '#9933ff',
    '#ffffff',
    '#facccc',
    '#ffebcc',
    '#ffffcc',
    '#cce8cc',
    '#cce0f5',
    '#ebd6ff',
    '#bbbbbb',
    '#f06666',
    '#ffc266',
    '#ffff66',
    '#66b266',
    '#66a3e0',
    '#c285ff',
    '#888888',
    '#a10000',
    '#b26b00',
    '#b2b200',
    '#006100',
    '#0047b2',
    '#6b24b2',
    '#444444',
    '#5c0000',
    '#663d00',
    '#666600',
    '#003700',
    '#002966',
    '#3d1466',
  ];

  // const fonts = [
  //   'Arial',
  //   'Arial Black',
  //   'Comic Sans MS',
  //   'Courier New',
  //   'Georgia',
  //   'Helvetica',
  //   'Impact',
  //   'Times New Roman',
  //   'Trebuchet MS',
  //   'Verdana',
  //   'Roboto',
  //   'Open Sans',
  //   'Lato',
  //   'Montserrat',
  //   'Source Sans Pro',
  //   'Inter',
  // ];

  const fontSizes = [
    8, 9, 10, 11, 12, 14, 16, 18, 20, 22, 24, 26, 28, 36, 48, 72,
  ];

  const lineHeights = ['1.5', '2', '2.5', '3', '3.5', '4'];

  const setFontSize = (size: string) => {
    editor.chain().focus().setMark('textStyle', { fontSize: size }).run();
    setShowFontSizePicker(false);
  };

  const setLineHeight = (height: string) => {
    editor.chain().focus().setMark('textStyle', { lineHeight: height }).run();
  };

  const insertTable = (rows: number, cols: number) => {
    editor
      .chain()
      .focus()
      .insertTable({ rows, cols, withHeaderRow: true })
      .run();
    setShowTableMenu(false);
  };

  const exportContent = () => {
    const content = editor.getHTML();
    const blob = new Blob([content], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'document.html';
    a.click();
    URL.revokeObjectURL(url);
  };

  const importContent = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        editor.commands.setContent(content);
      };
      reader.readAsText(file);
    }
  };

  function getDropdownPosition(
    triggerEl: HTMLElement,
    dropdownEl: HTMLElement
  ) {
    const rect = triggerEl.getBoundingClientRect();
    const { innerHeight, innerWidth } = window;
    const padding = 8; // small viewport padding

    let top = rect.bottom;
    let left = rect.left;

    // place above if not enough space below
    if (rect.bottom + dropdownEl.offsetHeight + padding > innerHeight) {
      top = rect.top - dropdownEl.offsetHeight;
    }

    // align right edge if overflowing on the right
    if (rect.left + dropdownEl.offsetWidth + padding > innerWidth) {
      left = rect.right - dropdownEl.offsetWidth;
    }

    // clamp into viewport with padding
    top = Math.max(
      padding,
      Math.min(top, innerHeight - dropdownEl.offsetHeight - padding)
    );
    left = Math.max(
      padding,
      Math.min(left, innerWidth - dropdownEl.offsetWidth - padding)
    );

    return { top, left };
  }

  const renderDropdown = (
    isOpen: boolean,
    triggerRef: React.RefObject<HTMLElement>,
    dropdownRef: React.RefObject<HTMLDivElement>,
    children: React.ReactNode
  ) => {
    if (!isOpen) return null;

    // Inline component to allow hooks
    const DropdownFloating = () => {
      const [pos, setPos] = useState<{ top: number; left: number }>({
        top: 0,
        left: 0,
      });
      const rafRef = useRef<number | null>(null);

      const updatePosition = () => {
        if (!triggerRef.current || !dropdownRef.current) return;
        const next = getDropdownPosition(
          triggerRef.current,
          dropdownRef.current
        );
        setPos(next);
      };

      useLayoutEffect(() => {
        if (!isOpen) return;

        // measure right after paint
        rafRef.current = requestAnimationFrame(updatePosition);

        // recalc on scroll/resize
        const handle = () => updatePosition();
        window.addEventListener('scroll', handle, true);
        window.addEventListener('resize', handle);

        // recalc if dropdown size changes
        const ro = new ResizeObserver(() => updatePosition());
        if (dropdownRef.current) ro.observe(dropdownRef.current);

        return () => {
          if (rafRef.current) cancelAnimationFrame(rafRef.current);
          window.removeEventListener('scroll', handle, true);
          window.removeEventListener('resize', handle);
          ro.disconnect();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
      }, [isOpen]);

      return (
        <div
          ref={dropdownRef}
          style={{ position: 'fixed', top: pos.top, left: pos.left }}
          className='min-w-none z-50 rounded-md border border-gray-200 bg-white shadow-lg'
        >
          {children}
        </div>
      );
    };

    return <DropdownFloating />;
  };

  return (
    <>
      <div
        className={`flex flex-wrap items-center gap-1 border-b border-border p-2 ${isFullScreen ? 'sticky -top-8 z-20 bg-white' : ''}`}
      >
        {/* Preview and Full Screen Controls */}
        <div className='flex items-center gap-1'>
          <Button
            variant={isPreviewMode ? 'secondary' : 'ghost'}
            size='sm'
            className='h-8 bg-slate-100 px-2 text-sm'
            onClick={onTogglePreview}
            title={isPreviewMode ? 'Edit Mode' : 'Preview Mode'}
            type='button'
          >
            {isPreviewMode ? (
              <EyeOff className='mr-1 h-4 w-4' />
            ) : (
              <Eye className='mr-1 h-4 w-4' />
            )}
            {isPreviewMode ? 'Edit' : 'Preview'}
          </Button>
        </div>

        <div className='mx-1 h-6 w-px bg-border' />

        {/* Only show editing tools in edit mode */}
        {!isPreviewMode && (
          <>
            {/* File Operations */}
            <div className='flex items-center gap-1'>
              <input
                type='file'
                accept='.html,.txt'
                onChange={importContent}
                className='hidden'
                id='import-file'
              />
              <Button
                variant='ghost'
                size='sm'
                className='h-8 w-8 p-0'
                onClick={() => document.getElementById('import-file')?.click()}
                title='Import document'
                type='button'
              >
                <Upload className='h-4 w-4' />
              </Button>
              <Button
                variant='ghost'
                size='sm'
                className='h-8 w-8 p-0'
                onClick={exportContent}
                title='Export document'
                type='button'
              >
                <Download className='h-4 w-4' />
              </Button>
            </div>

            <div className='mx-1 h-6 w-px bg-border' />

            {/* History */}
            <div className='flex items-center gap-1'>
              <Button
                variant='ghost'
                size='sm'
                className='h-8 w-8 p-0'
                onClick={() => editor.chain().focus().undo().run()}
                disabled={disabled || !editor.can().undo()}
                title='Undo'
                type='button'
              >
                <Undo className='h-4 w-4' />
              </Button>
              <Button
                variant='ghost'
                size='sm'
                className='h-8 w-8 p-0'
                onClick={() => editor.chain().focus().redo().run()}
                disabled={disabled || !editor.can().redo()}
                title='Redo'
                type='button'
              >
                <Redo className='h-4 w-4' />
              </Button>
            </div>

            <div className='mx-1 h-6 w-px bg-border' />

            {/* Font Family */}
            {/* <div className='relative'>
              <Button
                variant='ghost'
                size='sm'
                className='h-8 px-2 text-sm'
                onClick={() => setShowFontPicker(!showFontPicker)}
                disabled={disabled}
                type='button'
              >
                <Type className='mr-1 h-4 w-4' />
                Font
                <ChevronDown className='ml-1 h-3 w-3' />
              </Button>
              {renderDropdown(
                showFontPicker,
                fontPickerRef,
                <div className='p-2'>
                  {fonts.map((font) => (
                    <button
                      key={font}
                      className='w-full rounded px-2 py-1 text-left text-sm hover:bg-gray-100'
                      style={{ fontFamily: font }}
                      onClick={() => {
                        editor.chain().focus().setFontFamily(font).run();
                        setShowFontPicker(false);
                      }}
                    >
                      {font}
                    </button>
                  ))}
                </div>
              )}
            </div> */}

            {/* Font Size */}
            <div className='relative'>
              <Button
                ref={fontSizeButtonRef}
                variant='ghost'
                size='sm'
                className='h-8 px-2 text-sm'
                onClick={() => setShowFontSizePicker(!showFontSizePicker)}
                disabled={disabled}
                type='button'
              >
                Size
                <ChevronDown className='ml-1 h-3 w-3' />
              </Button>
              {renderDropdown(
                showFontSizePicker,
                fontSizeButtonRef,
                fontSizePickerRef,
                <div className='max-h-48 max-w-44 overflow-y-auto p-2'>
                  <div className='mb-2'>
                    <input
                      type='number'
                      placeholder='Custom size'
                      value={customFontSize}
                      onChange={(e) => setCustomFontSize(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && customFontSize) {
                          setFontSize(customFontSize);
                          setCustomFontSize('');
                        }
                      }}
                      className='w-full rounded border border-gray-300 px-2 py-1 text-sm'
                    />
                  </div>
                  {fontSizes.map((size) => (
                    <button
                      type='button'
                      onMouseDown={(e) => e.preventDefault()}
                      key={size}
                      className='w-full rounded px-2 py-1 text-left text-sm hover:bg-gray-100'
                      onClick={() => setFontSize(size.toString())}
                    >
                      {size}px
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className='mx-1 h-6 w-px bg-border' />

            {/* Text Formatting */}
            <div className='flex items-center gap-1'>
              <Button
                variant={editor.isActive('bold') ? 'secondary' : 'ghost'}
                size='sm'
                className='h-8 w-8 p-0'
                onClick={() => editor.chain().focus().toggleBold().run()}
                disabled={disabled}
                title='Bold (⌘B)'
                type='button'
              >
                <Bold className='h-4 w-4' />
              </Button>
              <Button
                variant={editor.isActive('italic') ? 'secondary' : 'ghost'}
                size='sm'
                className='h-8 w-8 p-0'
                onClick={() => editor.chain().focus().toggleItalic().run()}
                disabled={disabled}
                title='Italic (⌘I)'
                type='button'
              >
                <Italic className='h-4 w-4' />
              </Button>
              <Button
                variant={editor.isActive('underline') ? 'secondary' : 'ghost'}
                size='sm'
                className='h-8 w-8 p-0'
                onClick={() => editor.chain().focus().toggleUnderline().run()}
                disabled={disabled}
                title='Underline (⌘U)'
                type='button'
              >
                <UnderlineIcon className='h-4 w-4' />
              </Button>
              <Button
                variant={editor.isActive('strike') ? 'secondary' : 'ghost'}
                size='sm'
                className='h-8 w-8 p-0'
                onClick={() => editor.chain().focus().toggleStrike().run()}
                disabled={disabled}
                title='Strikethrough'
                type='button'
              >
                <Strikethrough className='h-4 w-4' />
              </Button>
            </div>

            {/* Text Color */}
            <div className='relative'>
              <Button
                ref={textColorButtonRef}
                variant='ghost'
                size='sm'
                className='h-8 w-8 p-0'
                onClick={() => setShowColorPicker(!showColorPicker)}
                disabled={disabled}
                title='Text color'
                type='button'
              >
                <Palette className='h-4 w-4' />
              </Button>
              {renderDropdown(
                showColorPicker,
                textColorButtonRef,
                colorPickerRef,
                <div className='p-2'>
                  <div className='mb-2 grid grid-cols-7 gap-1'>
                    {colors.map((color) => (
                      <button
                        type='button'
                        onMouseDown={(e) => e.preventDefault()}
                        key={color}
                        className='h-6 w-6 rounded border border-gray-300 transition-transform hover:scale-110'
                        style={{ backgroundColor: color }}
                        onClick={() => {
                          editor.chain().focus().setColor(color).run();
                          setShowColorPicker(false);
                        }}
                      />
                    ))}
                  </div>
                  <button
                    type='button'
                    onMouseDown={(e) => e.preventDefault()}
                    className='w-full rounded px-2 py-1 text-left text-sm hover:bg-gray-100'
                    onClick={() => {
                      editor.chain().focus().unsetColor().run();
                      setShowColorPicker(false);
                    }}
                  >
                    Remove color
                  </button>
                </div>
              )}
            </div>

            {/* Highlight Color */}
            <div className='relative'>
              <Button
                ref={bgColorButtonRef}
                variant='ghost'
                size='sm'
                className='h-8 w-8 p-0'
                onClick={() => setShowHighlightPicker(!showHighlightPicker)}
                disabled={disabled}
                title='Highlight color'
                type='button'
              >
                <Highlighter className='h-4 w-4' />
              </Button>
              {renderDropdown(
                showHighlightPicker,
                bgColorButtonRef,
                highlightPickerRef,
                <div className='p-2'>
                  <div className='mb-2 grid grid-cols-7 gap-1'>
                    {colors
                      .filter((c) => c !== '#000000')
                      .map((color) => (
                        <button
                          type='button'
                          onMouseDown={(e) => e.preventDefault()}
                          key={color}
                          className='h-6 w-6 rounded border border-gray-300 transition-transform hover:scale-110'
                          style={{ backgroundColor: color }}
                          onClick={() => {
                            editor
                              .chain()
                              .focus()
                              .setHighlight({ color })
                              .run();
                            setShowHighlightPicker(false);
                          }}
                        />
                      ))}
                  </div>
                  <button
                    type='button'
                    onMouseDown={(e) => e.preventDefault()}
                    className='w-full rounded px-2 py-1 text-left text-sm hover:bg-gray-100'
                    onClick={() => {
                      editor.chain().focus().unsetHighlight().run();
                      setShowHighlightPicker(false);
                    }}
                  >
                    Remove highlight
                  </button>
                </div>
              )}
            </div>

            <div className='mx-1 h-6 w-px bg-border' />

            {/* Subscript/Superscript */}
            <div className='flex items-center gap-1'>
              <Button
                variant={editor.isActive('subscript') ? 'secondary' : 'ghost'}
                size='sm'
                className='h-8 w-8 p-0'
                onClick={() => editor.chain().focus().toggleSubscript().run()}
                disabled={disabled}
                title='Subscript'
                type='button'
              >
                <SubscriptIcon className='h-4 w-4' />
              </Button>
              <Button
                variant={editor.isActive('superscript') ? 'secondary' : 'ghost'}
                size='sm'
                className='h-8 w-8 p-0'
                onClick={() => editor.chain().focus().toggleSuperscript().run()}
                disabled={disabled}
                title='Superscript'
                type='button'
              >
                <SuperscriptIcon className='h-4 w-4' />
              </Button>
            </div>

            <div className='mx-1 h-6 w-px bg-border' />

            {/* Headings */}
            <div className='flex items-center gap-1'>
              <Button
                variant={
                  editor.isActive('heading', { level: 1 })
                    ? 'secondary'
                    : 'ghost'
                }
                size='sm'
                className='h-8 w-8 p-0'
                onClick={() =>
                  editor.chain().focus().toggleHeading({ level: 1 }).run()
                }
                disabled={disabled}
                title='Heading 1'
                type='button'
              >
                <Heading1 className='h-4 w-4' />
              </Button>
              <Button
                variant={
                  editor.isActive('heading', { level: 2 })
                    ? 'secondary'
                    : 'ghost'
                }
                size='sm'
                className='h-8 w-8 p-0'
                onClick={() =>
                  editor.chain().focus().toggleHeading({ level: 2 }).run()
                }
                disabled={disabled}
                title='Heading 2'
                type='button'
              >
                <Heading2 className='h-4 w-4' />
              </Button>
              <Button
                variant={
                  editor.isActive('heading', { level: 3 })
                    ? 'secondary'
                    : 'ghost'
                }
                size='sm'
                className='h-8 w-8 p-0'
                onClick={() =>
                  editor.chain().focus().toggleHeading({ level: 3 }).run()
                }
                disabled={disabled}
                title='Heading 3'
                type='button'
              >
                <Heading3 className='h-4 w-4' />
              </Button>
            </div>

            <div className='mx-1 h-6 w-px bg-border' />

            {/* Lists */}
            <div className='flex items-center gap-1'>
              <Button
                variant={editor.isActive('bulletList') ? 'secondary' : 'ghost'}
                size='sm'
                className='h-8 w-8 p-0'
                onClick={() => editor.chain().focus().toggleBulletList().run()}
                disabled={disabled}
                title='Bullet List'
                type='button'
              >
                <List className='h-4 w-4' />
              </Button>
              <Button
                variant={editor.isActive('orderedList') ? 'secondary' : 'ghost'}
                size='sm'
                className='h-8 w-8 p-0'
                onClick={() => editor.chain().focus().toggleOrderedList().run()}
                disabled={disabled}
                title='Numbered List'
                type='button'
              >
                <ListOrdered className='h-4 w-4' />
              </Button>
            </div>

            {/* Indent */}
            <div className='flex items-center gap-1'>
              <Button
                variant='ghost'
                size='sm'
                className='h-8 w-8 p-0'
                onClick={() =>
                  editor.chain().focus().sinkListItem('listItem').run()
                }
                disabled={disabled || !editor.can().sinkListItem('listItem')}
                title='Increase indent'
                type='button'
              >
                <RiIndentIncrease className='h-4 w-4' />
              </Button>
              <Button
                variant='ghost'
                size='sm'
                className='h-8 w-8 p-0'
                onClick={() =>
                  editor.chain().focus().liftListItem('listItem').run()
                }
                disabled={disabled || !editor.can().liftListItem('listItem')}
                title='Decrease indent'
                type='button'
              >
                <RiIndentDecrease className='h-4 w-4' />
              </Button>
            </div>

            <div className='mx-1 h-6 w-px bg-border' />

            {/* Alignment */}
            <div className='flex items-center gap-1'>
              <Button
                variant={
                  editor.isActive({ textAlign: 'left' }) ? 'secondary' : 'ghost'
                }
                size='sm'
                className='h-8 w-8 p-0'
                onClick={() =>
                  editor.chain().focus().setTextAlign('left').run()
                }
                disabled={disabled}
                title='Align Left'
                type='button'
              >
                <AlignLeft className='h-4 w-4' />
              </Button>
              <Button
                variant={
                  editor.isActive({ textAlign: 'center' })
                    ? 'secondary'
                    : 'ghost'
                }
                size='sm'
                className='h-8 w-8 p-0'
                onClick={() =>
                  editor.chain().focus().setTextAlign('center').run()
                }
                disabled={disabled}
                title='Align Center'
                type='button'
              >
                <AlignCenter className='h-4 w-4' />
              </Button>
              <Button
                variant={
                  editor.isActive({ textAlign: 'right' })
                    ? 'secondary'
                    : 'ghost'
                }
                size='sm'
                className='h-8 w-8 p-0'
                onClick={() =>
                  editor.chain().focus().setTextAlign('right').run()
                }
                disabled={disabled}
                title='Align Right'
                type='button'
              >
                <AlignRight className='h-4 w-4' />
              </Button>
              <Button
                variant={
                  editor.isActive({ textAlign: 'justify' })
                    ? 'secondary'
                    : 'ghost'
                }
                size='sm'
                className='h-8 w-8 p-0'
                onClick={() =>
                  editor.chain().focus().setTextAlign('justify').run()
                }
                disabled={disabled}
                title='Justify'
                type='button'
              >
                <AlignJustify className='h-4 w-4' />
              </Button>
            </div>

            <div className='mx-1 h-6 w-px bg-border' />

            {/* Line Height */}
            <div className='relative'>
              <select
                className='h-8 rounded border border-gray-300 bg-white px-2 text-sm'
                onChange={(e) => setLineHeight(e.target.value)}
                disabled={disabled}
                title='Line height'
              >
                <option value=''>Line height</option>
                {lineHeights.map((height) => (
                  <option key={height} value={height}>
                    {height}
                  </option>
                ))}
              </select>
            </div>

            <div className='mx-1 h-6 w-px bg-border' />

            {/* Table */}
            <div className='relative'>
              <Button
                ref={buttonRef}
                variant='ghost'
                size='sm'
                className='h-8 w-8 p-0'
                onClick={() => setShowTableMenu(!showTableMenu)}
                disabled={disabled}
                title='Insert table'
                type='button'
              >
                <TableIcon className='h-4 w-4' />
              </Button>
              {renderDropdown(
                showTableMenu,
                buttonRef,
                tableMenuRef,
                <div className='max-w-40'>
                  <div className='mb-2 p-2'>
                    <div className='mb-1 text-sm font-medium'>Insert Table</div>
                    <div className='grid grid-cols-5 gap-1'>
                      {Array.from({ length: 25 }, (_, i) => {
                        const row = Math.floor(i / 5) + 1;
                        const col = (i % 5) + 1;
                        return (
                          <button
                            key={i}
                            type='button'
                            onMouseDown={(e) => e.preventDefault()}
                            className='flex max-h-5 max-w-5 items-center justify-center space-x-2 rounded border border-gray-300 bg-white px-1 py-0.5 text-sm hover:bg-blue-100'
                            onClick={() => insertTable(row, col)}
                            title={`Insert ${row}x${col} Table`}
                          >
                            {/* <TableIcon className='h-2 w-2' /> */}
                            <span className='text-[8px]'>
                              {row}×{col}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                  {editor.isActive('table') && (
                    <>
                      <div className='mt-1 w-full border-t pt-1'>
                        <button
                          type='button'
                          onMouseDown={(e) => e.preventDefault()}
                          className='w-full rounded px-2 py-1 text-left text-sm hover:bg-gray-100'
                          onClick={() =>
                            editor.chain().focus().addRowBefore().run()
                          }
                        >
                          Add row above
                        </button>
                        <button
                          type='button'
                          onMouseDown={(e) => e.preventDefault()}
                          className='w-full rounded px-2 py-1 text-left text-sm hover:bg-gray-100'
                          onClick={() =>
                            editor.chain().focus().addRowAfter().run()
                          }
                        >
                          Add row below
                        </button>
                        <button
                          type='button'
                          onMouseDown={(e) => e.preventDefault()}
                          className='w-full rounded px-2 py-1 text-left text-sm hover:bg-gray-100'
                          onClick={() =>
                            editor.chain().focus().addColumnBefore().run()
                          }
                        >
                          Add column left
                        </button>
                        <button
                          type='button'
                          onMouseDown={(e) => e.preventDefault()}
                          className='w-full rounded px-2 py-1 text-left text-sm hover:bg-gray-100'
                          onClick={() =>
                            editor.chain().focus().addColumnAfter().run()
                          }
                        >
                          Add column right
                        </button>
                        <button
                          type='button'
                          onMouseDown={(e) => e.preventDefault()}
                          className='w-full rounded px-2 py-1 text-left text-sm hover:bg-gray-100'
                          onClick={() =>
                            editor.chain().focus().deleteRow().run()
                          }
                        >
                          Delete row
                        </button>
                        <button
                          type='button'
                          onMouseDown={(e) => e.preventDefault()}
                          className='w-full rounded px-2 py-1 text-left text-sm hover:bg-gray-100'
                          onClick={() =>
                            editor.chain().focus().deleteColumn().run()
                          }
                        >
                          Delete column
                        </button>
                        <button
                          type='button'
                          onMouseDown={(e) => e.preventDefault()}
                          className='w-full rounded px-2 py-1 text-left text-sm hover:bg-gray-100'
                          onClick={() =>
                            editor.chain().focus().deleteTable().run()
                          }
                        >
                          Delete table
                        </button>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Other Actions */}
            <div className='flex items-center gap-1'>
              <Button
                variant={editor.isActive('blockquote') ? 'secondary' : 'ghost'}
                size='sm'
                className='h-8 w-8 p-0'
                onClick={() => editor.chain().focus().toggleBlockquote().run()}
                disabled={disabled}
                title='Quote'
                type='button'
              >
                <Quote className='h-4 w-4' />
              </Button>
              <Button
                variant={editor.isActive('code') ? 'secondary' : 'ghost'}
                size='sm'
                className='h-8 w-8 p-0'
                onClick={() => editor.chain().focus().toggleCode().run()}
                disabled={disabled}
                title='Code'
                type='button'
              >
                <Code className='h-4 w-4' />
              </Button>
              <Button
                variant={editor.isActive('link') ? 'secondary' : 'ghost'}
                size='sm'
                className='h-8 w-8 p-0'
                onClick={toggleLink}
                disabled={disabled}
                title={editor.isActive('link') ? 'Remove Link' : 'Add Link'}
                type='button'
              >
                <LinkIcon className='h-4 w-4' />
              </Button>
            </div>

            <div className='mx-1 h-6 w-px bg-border' />

            {/* Horizontal Rule */}
            <Button
              variant='ghost'
              size='sm'
              className='h-8 w-8 p-0'
              onClick={() => editor.chain().focus().setHorizontalRule().run()}
              disabled={disabled}
              title='Insert horizontal line'
              type='button'
            >
              <Minus className='h-4 w-4' />
            </Button>
            <Button
              variant={isFullScreen ? 'secondary' : 'ghost'}
              className='hidden bg-slate-100 lg:block'
              size='sm'
              onClick={onToggleFullScreen}
              title={isFullScreen ? 'Exit Full Screen' : 'Full Screen'}
              type='button'
            >
              {isFullScreen ? (
                <span className='flex items-center gap-2'>
                  {' '}
                  <Minimize className='h-4 w-4' /> Minimize
                </span>
              ) : (
                <span className='flex items-center gap-2'>
                  {' '}
                  <Maximize className='h-4 w-4' /> Fullscreen
                </span>
              )}
            </Button>
          </>
        )}
      </div>

      {/* Link Dialog */}
      {isLinkDialogOpen && !isPreviewMode && (
        <div className='border-b border-border bg-muted/30 p-2'>
          <div className='flex items-center gap-2'>
            <input
              type='url'
              placeholder='Enter URL...'
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
              className='flex-1 rounded border border-border px-2 py-1 text-sm'
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  addLink();
                } else if (e.key === 'Escape') {
                  setIsLinkDialogOpen(false);
                  setLinkUrl('');
                }
              }}
              autoFocus
            />
            <Button size='sm' onClick={addLink} disabled={!linkUrl.trim()}>
              Add
            </Button>
            <Button
              size='sm'
              variant='outline'
              onClick={() => {
                setIsLinkDialogOpen(false);
                setLinkUrl('');
              }}
            >
              Cancel
            </Button>
          </div>
        </div>
      )}
    </>
  );
};

const PreviewContent: React.FC<PreviewContentProps> = ({
  open,
  onOpenChange,
  content,
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>preview</DialogTrigger>
      <DialogContent className='max-h-[90vh] w-[90vw] max-w-none overflow-auto'>
        <div
          className={cn(
            'prose prose-sm sm:prose lg:prose-lg xl:prose-xl mx-auto h-[calc(90vh-120px)] w-full max-w-none overflow-y-auto p-4',
            // Prose styling
            '[&_h1]:mb-4 [&_h1]:mt-6 [&_h1]:text-3xl [&_h1]:font-semibold',
            '[&_h2]:mb-3 [&_h2]:mt-5 [&_h2]:text-2xl [&_h2]:font-semibold',
            '[&_h3]:mb-2 [&_h3]:mt-4 [&_h3]:text-xl [&_h3]:font-medium',
            '[&_p]:my-2  [&_p]:leading-normal',
            '[&_p]:text-sm md:[&_p]:text-base',
            '[&_ul]:my-3 [&_ul]:list-disc [&_ul]:pl-6',
            '[&_ol]:my-3 [&_ol]:list-decimal [&_ol]:pl-6',
            '[&_li]:my-1',
            '[&_blockquote]:my-4 [&_blockquote]:border-l-4 [&_blockquote]:border-gray-300 [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-gray-700',
            '[&_code]:rounded [&_code]:bg-gray-100 [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:font-mono [&_code]:text-sm',
            '[&_pre]:my-4 [&_pre]:rounded [&_pre]:bg-gray-100 [&_pre]:p-4 [&_pre]:font-mono [&_pre]:text-sm',
            '[&_hr]:my-6 [&_hr]:border-t-2 [&_hr]:border-gray-300',
            '[&_table]:my-4',
            '[&_table_td]:min-w-[100px]',
            '[&_table_th]:min-w-[100px]',
            '[&_td]:px-2 [&_td]:py-2 [&_th]:px-2 [&_th]:py-2',
            '[&_.highlight]:rounded [&_.highlight]:px-0.5 [&_.highlight]:py-0.5',
            '[&_sub]:align-sub [&_sub]:text-xs',
            '[&_sup]:align-super [&_sup]:text-xs',
            '[&_a]:text-blue-500 [&_a]:underline hover:[&_a]:text-blue-600'
          )}
          dangerouslySetInnerHTML={{
            __html: content || '<p>No content to preview...</p>',
          }}
        />
      </DialogContent>
    </Dialog>
  );
};

// Internal editor component that only renders on client
const TiptapEditor: React.FC<RichTextEditorProps> = ({
  value = '',
  onChange,
  placeholder = 'Start writing...',
  disabled = false,
  className,
  minHeight = '400px',
  error = false,
  isFullScreen = false,
  setIsFullScreen,
}) => {
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  // replace FontSize + LineHeight + TextStyle with this single extension
  const TextStyleExtended = TextStyle.extend({
    addAttributes() {
      return {
        fontSize: {
          default: null,
          parseHTML: (el: any) => el.style.fontSize?.replace('px', ''),
          renderHTML: (attrs: any) =>
            attrs.fontSize ? { style: `font-size: ${attrs.fontSize}px` } : {},
        },
        lineHeight: {
          default: null,
          parseHTML: (el: any) => el.style.lineHeight,
          renderHTML: (attrs: any) =>
            attrs.lineHeight
              ? { style: `line-height: ${attrs.lineHeight}` }
              : {},
        },
      };
    },
  });

  const editor = useEditor(
    {
      extensions: [
        StarterKit.configure({
          bulletList: {
            keepMarks: true,
            keepAttributes: false,
          },
          orderedList: {
            keepMarks: true,
            keepAttributes: false,
          },
          link: false,
          underline: false,
        }),
        Link.configure({
          openOnClick: false,
          HTMLAttributes: {
            class: 'text-blue-500 underline hover:text-blue-600 cursor-pointer',
          },
        }),
        Underline,
        // TextStyle,
        TextStyleExtended,
        // FontSize,
        // LineHeight,
        Color,
        Highlight.configure({
          multicolor: true,
          HTMLAttributes: {
            class: 'highlight',
          },
        }),
        FontFamily.configure({
          types: ['textStyle'],
        }),
        Subscript,
        Superscript,
        TextAlign.configure({
          types: ['heading', 'paragraph'],
        }),
        Table.configure({
          resizable: true,
          HTMLAttributes: {
            class: 'table-auto w-full',
          },
        }),
        TableRow.configure({
          HTMLAttributes: {
            class: 'border border-gray-300',
          },
        }),
        TableHeader.configure({
          HTMLAttributes: {
            class:
              'border border-gray-300 bg-gray-100 font-semibold px-3 text-left',
          },
        }),
        TableCell.configure({
          HTMLAttributes: {
            class: 'border border-gray-300 px-3',
          },
        }),
        Placeholder.configure({
          placeholder,
        }),
      ],
      content: value,
      editable: !disabled && !isPreviewMode,
      immediatelyRender: false,
      onUpdate: ({ editor }) => {
        const html = editor.getHTML();
        onChange?.(html === '<p></p>' ? '' : html);
      },
    },
    []
  );

  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value);
    }
  }, [value, editor]);

  useEffect(() => {
    if (editor) {
      editor.setEditable(!disabled && !isPreviewMode);
    }
  }, [disabled, editor, isPreviewMode]);

  // Handle Escape key to exit full screen
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isFullScreen) {
        setIsFullScreen(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFullScreen]);

  // Prevent body scroll when in full screen
  useEffect(() => {
    if (isFullScreen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isFullScreen]);

  const togglePreview = () => {
    setIsPreviewMode(!isPreviewMode);
  };

  const toggleFullScreen = () => {
    setIsFullScreen(!isFullScreen);
  };

  if (!editor) {
    return (
      <div
        className={cn(
          'animate-pulse rounded-md border border-input bg-background',
          error && 'border-destructive',
          className
        )}
        style={{ minHeight }}
      >
        <div className='flex items-center justify-center p-8 text-muted-foreground'>
          <div className='text-sm'>Loading editor...</div>
        </div>
      </div>
    );
  }

  const editorContent = editor.getHTML();

  return (
    <div
      className={cn(
        'rounded-md border border-input bg-background',
        error && 'border-destructive',
        disabled && 'cursor-not-allowed opacity-50',
        isFullScreen && 'fixed inset-0 -top-2 z-50 rounded-none border-0',
        !isFullScreen &&
          'focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2',
        className
      )}
    >
      <MenuBar
        editor={editor}
        disabled={disabled}
        isPreviewMode={isPreviewMode}
        isFullScreen={isFullScreen}
        onTogglePreview={togglePreview}
        onToggleFullScreen={toggleFullScreen}
      />

      {/* Full Screen Header */}
      {isFullScreen && (
        <div className='flex items-center justify-between border-b bg-gray-50 px-4 py-2'>
          <h2 className='text-lg font-semibold'>
            {isPreviewMode ? 'Document Preview' : 'Document Editor'}
          </h2>
          <Button
            variant='ghost'
            size='sm'
            onClick={() => setIsFullScreen(false)}
            className='h-8 w-8 p-0'
          >
            <X className='h-4 w-4' />
          </Button>
        </div>
      )}

      {isPreviewMode ? (
        <PreviewContent
          open={isPreviewMode}
          onOpenChange={setIsPreviewMode}
          content={editorContent}
        />
      ) : (
        <div
          className={cn(
            'prose prose-sm sm:prose lg:prose-lg xl:prose-xl mx-auto w-full max-w-none'
          )}
        >
          <EditorContent
            editor={editor}
            className={cn(
              'px-4 py-3 focus:outline-none',
              '[&_.ProseMirror]:outline-none',
              '[&_p]:text-sm md:[&_p]:text-base',
              '[&_.ProseMirror]:prose [&_.ProseMirror]:prose-sm [&_.ProseMirror]:max-w-none',
              '[&_.ProseMirror_h1]:mb-4 [&_.ProseMirror_h1]:mt-6 [&_.ProseMirror_h1]:text-3xl [&_.ProseMirror_h1]:font-semibold',
              '[&_.ProseMirror_h2]:mb-3 [&_.ProseMirror_h2]:mt-5 [&_.ProseMirror_h2]:text-2xl [&_.ProseMirror_h2]:font-semibold',
              '[&_.ProseMirror_h3]:mb-2 [&_.ProseMirror_h3]:mt-4 [&_.ProseMirror_h3]:text-xl [&_.ProseMirror_h3]:font-medium',
              '[&_.ProseMirror_p]:my-3 [&_.ProseMirror_p]:leading-normal',
              '[&_.ProseMirror_ul]:my-3 [&_.ProseMirror_ul]:list-disc [&_.ProseMirror_ul]:pl-6',
              '[&_.ProseMirror_ol]:my-3 [&_.ProseMirror_ol]:list-decimal [&_.ProseMirror_ol]:pl-6',
              '[&_.ProseMirror_li]:my-1',
              '[&_.ProseMirror_blockquote]:my-4 [&_.ProseMirror_blockquote]:border-l-4 [&_.ProseMirror_blockquote]:border-gray-300 [&_.ProseMirror_blockquote]:pl-4 [&_.ProseMirror_blockquote]:italic [&_.ProseMirror_blockquote]:text-gray-700',
              '[&_.ProseMirror_code]:rounded [&_.ProseMirror_code]:bg-gray-100 [&_.ProseMirror_code]:px-1.5 [&_.ProseMirror_code]:py-0.5 [&_.ProseMirror_code]:font-mono [&_.ProseMirror_code]:text-sm',
              '[&_.ProseMirror_pre]:my-4 [&_.ProseMirror_pre]:rounded [&_.ProseMirror_pre]:bg-gray-100 [&_.ProseMirror_pre]:p-4 [&_.ProseMirror_pre]:font-mono [&_.ProseMirror_pre]:text-sm',
              '[&_.ProseMirror_hr]:my-6 [&_.ProseMirror_hr]:border-t-2 [&_.ProseMirror_hr]:border-gray-300',
              '[&_.ProseMirror_table]:my-3',
              '[&_.ProseMirror_table_td]:min-w-[100px]',
              '[&_.ProseMirror_table_th]:min-w-[100px]',
              '[&_.ProseMirror_.highlight]:rounded [&_.ProseMirror_.highlight]:px-0.5 [&_.ProseMirror_.highlight]:py-0.5',
              '[&_.ProseMirror_sub]:align-sub [&_.ProseMirror_sub]:text-xs',
              '[&_.ProseMirror_sup]:align-super [&_.ProseMirror_sup]:text-xs',
              '[&_.ProseMirror]:placeholder-gray-400',
              '[&_.ProseMirror_strong]:font-semibold',
              '[&_.ProseMirror_.selectedCell]:bg-blue-100 [&_.ProseMirror_.selectedCell]:outline [&_.ProseMirror_.selectedCell]:outline-2 [&_.ProseMirror_.selectedCell]:outline-blue-400',
              '[&_.ProseMirror_.column-selected]:bg-blue-50 [&_.ProseMirror_.row-selected]:bg-blue-50',
              `h-[calc(90vh-120px)] overflow-y-auto [&_.ProseMirror]:min-h-[300px]`
            )}
          />
        </div>
      )}
    </div>
  );
};

// Main component with client-only rendering
const RichTextEditor: React.FC<RichTextEditorProps> = (props) => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return (
      <div
        className={cn(
          'animate-pulse rounded-md border border-input bg-background',
          props.error && 'border-destructive',
          props.className
        )}
        style={{ minHeight: props.minHeight || '400px' }}
      >
        <div className='flex items-center justify-center p-8 text-muted-foreground'>
          <div className='text-sm'>Loading editor...</div>
        </div>
      </div>
    );
  }

  return <TiptapEditor {...props} />;
};

export default RichTextEditor;
