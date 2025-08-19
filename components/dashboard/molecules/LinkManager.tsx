'use client';

import React, { useState, useCallback } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
  restrictToVerticalAxis,
  restrictToParentElement,
} from '@dnd-kit/modifiers';

import { UniversalLinkInput } from '../atoms/UniversalLinkInput';
import { SortableLinkItem } from '../atoms/SortableLinkItem';
import type { DetectedLink } from '@/lib/utils/platform-detection';

interface LinkItem extends DetectedLink {
  id: string;
  title: string;
  isVisible: boolean;
  order: number;
}

interface LinkManagerProps {
  initialLinks?: LinkItem[];
  onLinksChange: (links: LinkItem[]) => void;
  disabled?: boolean;
  maxLinks?: number;
}

export const LinkManager: React.FC<LinkManagerProps> = ({
  initialLinks = [],
  onLinksChange,
  disabled = false,
  maxLinks = 20,
}) => {
  const [links, setLinks] = useState<LinkItem[]>(
    initialLinks.sort((a, b) => a.order - b.order)
  );
  const [deletedLinks, setDeletedLinks] = useState<
    { link: LinkItem; timeout: NodeJS.Timeout }[]
  >([]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Update parent when links change
  const updateLinks = useCallback(
    (newLinks: LinkItem[]) => {
      const sortedLinks = newLinks.map((link, index) => ({
        ...link,
        order: index,
      }));
      setLinks(sortedLinks);
      onLinksChange(sortedLinks);
    },
    [onLinksChange]
  );

  // Add new link
  const handleAddLink = useCallback(
    (detectedLink: DetectedLink) => {
      if (links.length >= maxLinks) {
        // TODO: Show toast notification about max links
        return;
      }

      const newLink: LinkItem = {
        ...detectedLink,
        id: `link_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        title: detectedLink.suggestedTitle,
        isVisible: true,
        order: links.length,
      };

      updateLinks([...links, newLink]);
    },
    [links, maxLinks, updateLinks]
  );

  // Update existing link
  const handleUpdateLink = useCallback(
    (id: string, updates: Partial<LinkItem>) => {
      const newLinks = links.map((link) =>
        link.id === id ? { ...link, ...updates } : link
      );
      updateLinks(newLinks);
    },
    [links, updateLinks]
  );

  // Delete link with undo functionality
  const handleDeleteLink = useCallback(
    (id: string) => {
      const linkToDelete = links.find((link) => link.id === id);
      if (!linkToDelete) return;

      // Remove from active links
      const newLinks = links.filter((link) => link.id !== id);
      updateLinks(newLinks);

      // Add to deleted links with 5-second undo timeout
      const timeout = setTimeout(() => {
        setDeletedLinks((prev) => prev.filter((item) => item.link.id !== id));
      }, 5000);

      setDeletedLinks((prev) => [...prev, { link: linkToDelete, timeout }]);

      // TODO: Show undo toast notification
    },
    [links, updateLinks]
  );

  // Undo delete
  const handleUndoDelete = useCallback(
    (linkId: string) => {
      const deletedItem = deletedLinks.find((item) => item.link.id === linkId);
      if (!deletedItem) return;

      // Clear the timeout
      clearTimeout(deletedItem.timeout);

      // Remove from deleted links
      setDeletedLinks((prev) => prev.filter((item) => item.link.id !== linkId));

      // Add back to active links at original position
      const newLinks = [...links];
      const insertIndex = Math.min(deletedItem.link.order, newLinks.length);
      newLinks.splice(insertIndex, 0, deletedItem.link);

      updateLinks(newLinks);
    },
    [deletedLinks, links, updateLinks]
  );

  // Handle drag end
  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;

      if (active.id !== over?.id) {
        const oldIndex = links.findIndex((link) => link.id === active.id);
        const newIndex = links.findIndex((link) => link.id === over?.id);

        const newLinks = arrayMove(links, oldIndex, newIndex);
        updateLinks(newLinks);
      }
    },
    [links, updateLinks]
  );

  return (
    <div className="space-y-6">
      {/* Add Link Input */}
      <UniversalLinkInput
        onAdd={handleAddLink}
        disabled={disabled || links.length >= maxLinks}
      />

      {/* Links Counter */}
      {links.length > 0 && (
        <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
          <span>
            {links.length} link{links.length === 1 ? '' : 's'}
          </span>
          {maxLinks && (
            <span>
              {links.length}/{maxLinks} max
            </span>
          )}
        </div>
      )}

      {/* Sortable Links List */}
      {links.length > 0 && (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
          modifiers={[restrictToVerticalAxis, restrictToParentElement]}
        >
          <SortableContext
            items={links.map((link) => link.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="space-y-2">
              {links.map((link) => (
                <SortableLinkItem
                  key={link.id}
                  link={link}
                  onUpdate={handleUpdateLink}
                  onDelete={handleDeleteLink}
                  disabled={disabled}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}

      {/* Empty State */}
      {links.length === 0 && (
        <div className="text-center py-12 px-4">
          <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              className="text-gray-400"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
              />
            </svg>
          </div>
          <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
            No links added yet
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 max-w-sm mx-auto">
            Paste any link from Spotify, Instagram, TikTok, YouTube, or other
            platforms to get started.
          </p>
        </div>
      )}

      {/* Undo Toasts for Deleted Links */}
      {deletedLinks.map((item) => (
        <div
          key={item.link.id}
          className="fixed bottom-4 right-4 bg-gray-900 text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-3 animate-in slide-in-from-bottom-2 z-50"
        >
          <span className="text-sm">
            Deleted &ldquo;{item.link.title}&rdquo;
          </span>
          <button
            onClick={() => handleUndoDelete(item.link.id)}
            className="text-sm text-blue-400 hover:text-blue-300 font-medium"
          >
            Undo
          </button>
        </div>
      ))}
    </div>
  );
};
