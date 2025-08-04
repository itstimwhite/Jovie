'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Artist } from '@/types/db';

interface ProfileFormProps {
  artist: Artist;
  onUpdate: (artist: Artist) => void;
}

export function ProfileForm({ artist, onUpdate }: ProfileFormProps) {
  const [name, setName] = useState(artist.name || '');
  const [tagline, setTagline] = useState(artist.tagline || '');
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      const { data, error } = await supabase
        .from('artists')
        .update({
          name,
          tagline,
        })
        .eq('id', artist.id)
        .select('*')
        .single();

      if (error) {
        console.error('Error updating artist:', error);
      } else {
        onUpdate(data);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-white">Profile Information</h3>
      <div className="space-y-3">
        <div>
          <label className="block text-sm font-medium text-white/70 mb-1">
            Artist Name
          </label>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your artist name"
            className="w-full"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-white/70 mb-1">
            Tagline
          </label>
          <Textarea
            value={tagline}
            onChange={(e) => setTagline(e.target.value)}
            placeholder="A short description of your music..."
            className="w-full"
            rows={3}
          />
        </div>
        <Button onClick={handleSave} disabled={saving}>
          {saving ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>
    </div>
  );
}
