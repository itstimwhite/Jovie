import type { Meta, StoryObj } from '@storybook/react';
import { FeaturedArtistsSection } from './FeaturedArtistsSection';

const meta: Meta<typeof FeaturedArtistsSection> = {
  title: 'Organisms/FeaturedArtistsSection',
  component: FeaturedArtistsSection,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

const mockArtists = [
  {
    id: '1',
    handle: 'arianagrande',
    name: 'Ariana Grande',
    src: 'https://i.scdn.co/image/ab6761610000e5ebcdce7620dc940db079bf4952',
  },
  {
    id: '2',
    handle: 'musicmaker',
    name: 'Music Maker',
    src: '/images/avatars/music-maker.jpg',
  },
  {
    id: '3',
    handle: 'popstar',
    name: 'Pop Star',
    src: '/images/avatars/pop-star.jpg',
  },
  {
    id: '4',
    handle: 'billieeilish',
    name: 'Billie Eilish',
    src: 'https://i.scdn.co/image/ab6761610000e5eb50defaf9fc059a1efc541f4c',
  },
];

export const Default: Story = {
  args: {
    artists: mockArtists,
    title: 'Featured Creators',
  },
};

export const CustomTitle: Story = {
  args: {
    artists: mockArtists,
    title: 'Popular Artists',
  },
};

export const SingleArtist: Story = {
  args: {
    artists: [mockArtists[0]],
    title: 'Featured Creator',
  },
};

export const ManyArtists: Story = {
  args: {
    artists: [
      ...mockArtists,
      ...mockArtists.map((artist, index) => ({
        ...artist,
        id: `${artist.id}-${index}`,
        handle: `${artist.handle}${index}`,
      })),
    ],
    title: 'All Creators',
  },
};
