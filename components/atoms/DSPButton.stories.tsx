import type { Meta, StoryObj } from '@storybook/react';
import { DSPButton } from './DSPButton';

// Mock DSP configurations for stories
const spotifyConfig = {
  name: 'Spotify',
  dspKey: 'spotify',
  url: 'https://open.spotify.com/artist/example',
  backgroundColor: '#1DB954',
  textColor: 'white',
  logoSvg: `<svg role="img" viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><title>Spotify</title><path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.48.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.32 11.28-1.08 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/></svg>`,
};

const appleMusicConfig = {
  name: 'Apple Music',
  dspKey: 'apple_music',
  url: 'https://music.apple.com/artist/example',
  backgroundColor: '#FA243C',
  textColor: 'white',
  logoSvg: `<svg role="img" viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><title>Apple Music</title><path d="M23.997 6.124c0-.738-.065-1.47-.24-2.19-.317-1.31-1.062-2.31-2.18-3.043C21.003.517 20.373.285 19.7.164c-.517-.093-1.038-.135-1.564-.15-.04-.002-.083-.01-.124-.013H5.988c-.152.01-.303.017-.455.034C4.786.07 4.043.15 3.34.428 2.004.958 1.04 1.88.475 3.208c-.192.448-.292.925-.363 1.408-.056.392-.088.785-.097 1.18V17.22c.009.394.041.787.097 1.179.071.483.171.96.363 1.408.565 1.328 1.529 2.25 2.865 2.78.703.278 1.446.358 2.193.393.152.017.303.024.455.034h11.124c.041-.003.084-.011.124-.013.526-.015 1.047-.057 1.564-.15.673-.121 1.303-.353 1.877-.717 1.118-.733 1.863-1.733 2.18-3.043.175-.72.24-1.452.24-2.19V6.124zM9.455 15.054c-.474 0-.901-.142-1.278-.417a2.505 2.505 0 0 1-.835-1.166 2.654 2.654 0 0 1-.093-1.421c.14-.49.417-.912.83-1.267.413-.355.906-.532 1.48-.532.573 0 1.067.177 1.48.532.413.355.69.777.83 1.267.14.49.098.98-.093 1.421a2.505 2.505 0 0 1-.835 1.166c-.377.275-.804.417-1.278.417zm9.12-.139c0 .312-.102.578-.307.798-.205.22-.456.33-.752.33-.297 0-.547-.11-.752-.33-.205-.22-.307-.486-.307-.798V9.903c0-.312.102-.578.307-.798.205-.22.455-.33.752-.33.296 0 .547.11.752.33.205.22.307.486.307.798v5.012z"/></svg>`,
};

const youtubeConfig = {
  name: 'YouTube',
  dspKey: 'youtube',
  url: 'https://youtube.com/@example',
  backgroundColor: '#FF0000',
  textColor: 'white',
  logoSvg: `<svg role="img" viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><title>YouTube</title><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>`,
};

const meta: Meta<typeof DSPButton> = {
  title: 'Atoms/DSPButton',
  component: DSPButton,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: { type: 'select' },
      options: ['sm', 'md', 'lg'],
    },
    disabled: {
      control: { type: 'boolean' },
    },
    onClick: { action: 'clicked' },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Spotify: Story = {
  args: {
    ...spotifyConfig,
    size: 'md',
  },
};

export const AppleMusic: Story = {
  args: {
    ...appleMusicConfig,
    size: 'md',
  },
};

export const YouTube: Story = {
  args: {
    ...youtubeConfig,
    size: 'md',
  },
};

export const Small: Story = {
  args: {
    ...spotifyConfig,
    size: 'sm',
  },
};

export const Large: Story = {
  args: {
    ...appleMusicConfig,
    size: 'lg',
  },
};

export const Disabled: Story = {
  args: {
    ...spotifyConfig,
    disabled: true,
  },
};

export const AllSizes: Story = {
  render: () => (
    <div className='flex flex-col gap-4 w-full max-w-md'>
      <DSPButton {...spotifyConfig} size='sm' />
      <DSPButton {...appleMusicConfig} size='md' />
      <DSPButton {...youtubeConfig} size='lg' />
    </div>
  ),
};

export const AllPlatforms: Story = {
  render: () => (
    <div className='flex flex-col gap-3 w-full max-w-md'>
      <DSPButton {...spotifyConfig} />
      <DSPButton {...appleMusicConfig} />
      <DSPButton {...youtubeConfig} />
    </div>
  ),
};

export const Interactive: Story = {
  args: {
    ...spotifyConfig,
    onClick: (dspKey: string, url: string) => {
      alert(`Clicked ${dspKey}: ${url}`);
    },
  },
};

export const DisabledStates: Story = {
  render: () => (
    <div className='flex flex-col gap-3 w-full max-w-md'>
      <DSPButton {...spotifyConfig} disabled />
      <DSPButton {...appleMusicConfig} disabled />
      <DSPButton {...youtubeConfig} disabled />
    </div>
  ),
};
