'use client';

import React, {
  useState,
  useCallback,
  useRef,
  useEffect,
  KeyboardEvent,
} from 'react';
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
import { useToast } from '@/components/ui/ToastContainer';
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
  allowedCategory?: 'dsp' | 'social' | 'custom' | 'all';
  title?: string;
  description?: string;
}

export const LinkManager: React.FC<LinkManagerProps> = ({
  initialLinks = [],
  onLinksChange,
  disabled = false,
  maxLinks = 20,
  allowedCategory = 'all',
  title: _title = 'Manage Links', // eslint-disable-line @typescript-eslint/no-unused-vars
  description:
    _description = 'Add and organize your links. Changes save automatically.', // eslint-disable-line @typescript-eslint/no-unused-vars
}) => {
  const [links, setLinks] = useState<LinkItem[]>(
    initialLinks.sort((a, b) => a.order - b.order)
  );
  const [deletedLinks, setDeletedLinks] = useState<
    { link: LinkItem; timeout: NodeJS.Timeout }[]
  >([]);
  const [focusedLinkIndex, setFocusedLinkIndex] = useState<number>(-1);
  const { showToast } = useToast();
  const linksContainerRef = useRef<HTMLDivElement>(null);
  const linkItemRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Update refs array when links change
  useEffect(() => {
    linkItemRefs.current = linkItemRefs.current.slice(0, links.length);
  }, [links.length]);

  // Enhanced keyboard sensor with better accessibility
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

  // Handle keyboard navigation for the links list
  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLDivElement>) => {
      if (disabled || links.length === 0) return;

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setFocusedLinkIndex((prev) => {
            const newIndex = prev < links.length - 1 ? prev + 1 : 0;
            linkItemRefs.current[newIndex]?.focus();
            return newIndex;
          });
          break;
        case 'ArrowUp':
          e.preventDefault();
          setFocusedLinkIndex((prev) => {
            const newIndex = prev > 0 ? prev - 1 : links.length - 1;
            linkItemRefs.current[newIndex]?.focus();
            return newIndex;
          });
          break;
        case 'Home':
          e.preventDefault();
          setFocusedLinkIndex(0);
          linkItemRefs.current[0]?.focus();
          break;
        case 'End':
          e.preventDefault();
          setFocusedLinkIndex(links.length - 1);
          linkItemRefs.current[links.length - 1]?.focus();
          break;
      }
    },
    [disabled, links.length]
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

      // Show confirmation toast
      showToast({
        message: `Restored "${deletedItem.link.title}"`,
        type: 'success',
        duration: 2000,
      });
    },
    [deletedLinks, links, updateLinks, showToast]
  );

  // Add new link
  const handleAddLink = useCallback(
    (detectedLink: DetectedLink) => {
      if (links.length >= maxLinks) {
        showToast({
          message: `Maximum of ${maxLinks} links allowed`,
          type: 'warning',
          duration: 3000,
        });
        return;
      }

      // Validate platform category
      if (
        allowedCategory !== 'all' &&
        detectedLink.platform.category !== allowedCategory
      ) {
        showToast({
          message: `${detectedLink.platform.name} links are not allowed in this section`,
          type: 'error',
          duration: 3000,
        });
        console.warn(
          `Platform ${detectedLink.platform.name} (${detectedLink.platform.category}) not allowed in ${allowedCategory} link manager`
        );
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
    [links, maxLinks, updateLinks, allowedCategory, showToast]
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

      // Show undo toast notification
      showToast({
        message: `Deleted "${linkToDelete.title}"`,
        type: 'info',
        duration: 5000,
        action: {
          label: 'Undo',
          onClick: () => handleUndoDelete(id),
        },
      });
    },
    [links, updateLinks, showToast, handleUndoDelete]
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
        <div
          className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400"
          aria-live="polite"
        >
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
          accessibility={{
            announcements: {
              onDragStart: ({ active }) =>
                `Picked up ${links.find((link) => link.id === active.id)?.title || 'link'}. Use arrow keys to move, space to drop.`,
              onDragOver: ({ active, over }) => {
                if (!over) return '';
                const activeLink = links.find((link) => link.id === active.id);
                const overLink = links.find((link) => link.id === over.id);
                return `${activeLink?.title || 'Link'} is over ${overLink?.title || 'position'}.`;
              },
              onDragEnd: ({ active, over }) => {
                if (!over) return 'Cancelled sorting.';
                const activeLink = links.find((link) => link.id === active.id);
                const overLink = links.find((link) => link.id === over.id);
                return `Dropped ${activeLink?.title || 'link'} at position of ${overLink?.title || 'link'}.`;
              },
              onDragCancel: () => 'Sorting cancelled.',
            },
          }}
        >
          <SortableContext
            items={links.map((link) => link.id)}
            strategy={verticalListSortingStrategy}
          >
            <div
              className="space-y-2"
              ref={linksContainerRef}
              onKeyDown={handleKeyDown}
              role="list"
              aria-label="Sortable links list"
              tabIndex={links.length > 0 ? 0 : -1}
            >
              {links.map((link, index) => (
                <SortableLinkItem
                  key={link.id}
                  link={link}
                  onUpdate={handleUpdateLink}
                  onDelete={handleDeleteLink}
                  disabled={disabled}
                  ref={(el) => {
                    linkItemRefs.current[index] = el;
                  }}
                  isFocused={focusedLinkIndex === index}
                  index={index}
                  totalItems={links.length}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}

      {/* Empty State */}
      {links.length === 0 && (
        <div
          className="text-center py-12 px-4"
          role="status"
          aria-live="polite"
        >
          <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              className="text-gray-400"
              aria-hidden="true"
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

      {/* Screen reader announcements */}
      <div aria-live="assertive" className="sr-only">
        {deletedLinks.length > 0 &&
          `Link deleted. ${deletedLinks.length} undo action available.`}
      </div>
    </div>
  );
};
