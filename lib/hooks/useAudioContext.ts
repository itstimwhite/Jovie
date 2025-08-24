'use client';

import { useState, useEffect, useCallback, useRef } from 'react';

interface AudioContextState {
  isMuted: boolean;
  isSupported: boolean;
  playSound: (soundUrl: string, volume?: number) => void;
}

/**
 * Hook to manage audio context and play sounds
 * @returns AudioContextState object with isMuted, isSupported, and playSound function
 */
export function useAudioContext(): AudioContextState {
  const [isMuted, setIsMuted] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);

  // Initialize audio context
  useEffect(() => {
    // Check if window is defined (client-side)
    if (typeof window === 'undefined') return;

    // Check if AudioContext is supported
    const isAudioSupported = typeof window.AudioContext !== 'undefined' || 
                            typeof (window as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext !== 'undefined';
    
    setIsSupported(isAudioSupported);

    if (isAudioSupported) {
      const AudioContextClass = window.AudioContext || (window as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      audioContextRef.current = new AudioContextClass();
    }

    // Check if audio is muted (system level)
    const checkMuteStatus = () => {
      // This is a simple heuristic - we create a temporary audio element
      // and check if it's muted by the browser
      const audio = new Audio();
      audio.volume = 0.01; // Very low volume
      const promise = audio.play();
      
      if (promise !== undefined) {
        promise
          .then(() => {
            // Audio playback started - not muted at system level
            setIsMuted(false);
            audio.pause();
          })
          .catch(() => {
            // Auto-play prevented - likely muted or user hasn't interacted
            // We'll assume it's muted for better UX
            setIsMuted(true);
          });
      }
    };

    // Check initial mute status
    checkMuteStatus();

    // Clean up
    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  // Function to play a sound
  const playSound = useCallback((soundUrl: string, volume = 0.3) => {
    if (!isSupported || isMuted || !audioContextRef.current) return;

    // Create audio element
    const audio = new Audio(soundUrl);
    audio.volume = volume;
    
    // Try to play the sound
    const promise = audio.play();
    
    if (promise !== undefined) {
      promise.catch((error) => {
        // If playback fails, update mute status
        if (error.name === 'NotAllowedError') {
          setIsMuted(true);
        }
      });
    }
  }, [isSupported, isMuted]);

  return { isMuted, isSupported, playSound };
}
