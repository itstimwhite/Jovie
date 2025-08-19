import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase-server';
import { ArtistTheme } from '@/components/profile/ArtistThemeProvider';

export async function POST(request: NextRequest) {
  try {
    const { artistId, theme } = await request.json();

    if (!artistId || !theme) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate theme
    const validThemes: ArtistTheme[] = ['light', 'dark', 'auto'];
    if (!validThemes.includes(theme)) {
      return NextResponse.json(
        { error: 'Invalid theme value' },
        { status: 400 }
      );
    }

    try {
      const supabase = await createServerClient();

      if (!supabase) {
        return NextResponse.json(
          { error: 'Database connection failed' },
          { status: 500 }
        );
      }

      // Update the creator profile's theme preference
      const { error } = await supabase
        .from('creator_profiles')
        .update({
          theme: { mode: theme },
        })
        .eq('id', artistId);

      if (error) {
        console.error('Error updating artist theme:', error);
        return NextResponse.json(
          { error: 'Failed to update theme' },
          { status: 500 }
        );
      }

      return NextResponse.json({ success: true });
    } catch (dbError) {
      console.error('Database connection error:', dbError);
      return NextResponse.json(
        { error: 'Database connection failed' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error in theme API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
