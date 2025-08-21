'use client';

import React, { useState, useCallback } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { SocialIcon } from '@/components/atoms/SocialIcon';
import { Input } from '@/components/ui/Input';
import type { DetectedLink } from '@/lib/utils/platform-detection';

interface LinkItem extends DetectedLink {
  id: string;
  title: string;
  isVisible: boolean;
  order: number;
}

interface SortableLinkItemProps {
  link: LinkItem;
  onUpdate: (id: string, updates: Partial<LinkItem>) => void;
  onDelete: (id: string) => void;
  disabled?: boolean;
}

export const SortableLinkItem: React.FC<SortableLinkItemProps> = ({
  link,
  onUpdate,
  onDelete,
  disabled = false,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(link.title);
  const [isHovered, setIsHovered] = useState(false);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: link.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const brandColor = `#${link.platform.color}`;

  // Handle title editing
  const handleTitleClick = useCallback(() => {
    if (!disabled) {
      setIsEditing(true);
    }
  }, [disabled]);

  const handleTitleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setEditTitle(e.target.value);
    },
    []
  );

  const handleTitleSubmit = useCallback(() => {
    onUpdate(link.id, { title: editTitle.trim() || link.suggestedTitle });
    setIsEditing(false);
  }, [link.id, link.suggestedTitle, editTitle, onUpdate]);

  const handleTitleKeyPress = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter') {
        handleTitleSubmit();
      } else if (e.key === 'Escape') {
        setEditTitle(link.title);
        setIsEditing(false);
      }
    },
    [handleTitleSubmit, link.title]
  );

  // Handle visibility toggle
  const handleVisibilityToggle = useCallback(() => {
    onUpdate(link.id, { isVisible: !link.isVisible });
  }, [link.id, link.isVisible, onUpdate]);

  // Handle delete with undo capability
  const handleDelete = useCallback(() => {
    onDelete(link.id);
  }, [link.id, onDelete]);

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`
        group relative bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 
        transition-all duration-200 hover:border-gray-300 dark:hover:border-gray-600
        ${isDragging ? 'shadow-lg z-50 rotate-1' : 'hover:shadow-sm'}
        ${!link.isVisible ? 'opacity-60' : ''}
      `}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex items-center gap-3 p-3">
        {/* Drag handle */}
        <button
          {...attributes}
          {...listeners}
          disabled={disabled}
          className={`
            cursor-grab active:cursor-grabbing flex items-center justify-center
            w-6 h-6 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300
            transition-opacity duration-200
            ${isHovered ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}
          `}
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
            <circle cx="3" cy="3" r="1" />
            <circle cx="9" cy="3" r="1" />
            <circle cx="3" cy="9" r="1" />
            <circle cx="9" cy="9" r="1" />
          </svg>
        </button>

        {/* Platform icon */}
        <div
          className="flex items-center justify-center w-8 h-8 rounded-lg shrink-0"
          style={{
            backgroundColor: `${brandColor}15`,
            color: brandColor,
          }}
        >
          <SocialIcon platform={link.platform.icon} className="w-4 h-4" />
        </div>

        {/* Link content */}
        <div className="flex-1 min-w-0">
          {/* Title (editable) */}
          {isEditing ? (
            <Input
              type="text"
              value={editTitle}
              onChange={handleTitleChange}
              onBlur={handleTitleSubmit}
              onKeyDown={handleTitleKeyPress}
              inputMode="text"
              autoCapitalize="words"
              autoCorrect="on"
              autoComplete="off"
              className="text-sm font-medium -my-1"
              autoFocus
            />
          ) : (
            <button
              onClick={handleTitleClick}
              disabled={disabled}
              className="text-left text-sm font-medium text-gray-900 dark:text-gray-100 hover:text-gray-700 dark:hover:text-gray-300 transition-colors truncate w-full"
            >
              {link.title}
            </button>
          )}

          {/* Platform and URL */}
          <div className="flex items-center gap-2 mt-1">
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {link.platform.name}
            </span>
            <span className="text-xs text-gray-400 dark:text-gray-500">•</span>
            <span className="text-xs text-gray-400 dark:text-gray-500 truncate">
              {link.normalizedUrl.replace(/^https?:\/\//, '')}
            </span>
          </div>
        </div>

        {/* Controls */}
        <div
          className={`
            flex items-center gap-1 transition-opacity duration-200
            ${isHovered ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}
          `}
        >
          {/* Visibility toggle */}
          <button
            onClick={handleVisibilityToggle}
            disabled={disabled}
            className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            title={link.isVisible ? 'Hide link' : 'Show link'}
          >
            {link.isVisible ? (
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
              >
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            ) : (
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
              >
                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                <line x1="1" y1="1" x2="23" y2="23" />
              </svg>
            )}
          </button>

          {/* Delete button */}
          <button
            onClick={handleDelete}
            disabled={disabled}
            className="p-1.5 text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
            title="Delete link"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
            >
              <path d="M3 6h18" />
              <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
              <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
            </svg>
          </button>
        </div>
      </div>

      {/* Hover indicator */}
      <div
        className="absolute inset-0 rounded-lg pointer-events-none transition-all duration-200"
        style={{
          boxShadow:
            isHovered && !isDragging ? `0 0 0 1px ${brandColor}30` : 'none',
        }}
      />
    </div>
  );
};
