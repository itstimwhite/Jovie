# Refresh Spotify Artists Edge Function

This edge function refreshes artist data from Spotify API and updates the database with the latest information.

## Features

- **Daily Cron Job**: Runs automatically at midnight UTC every day
- **Batch Processing**: Processes artists in batches of 10 to respect rate limits
- **Error Handling**: Comprehensive error handling with detailed logging
- **Rate Limiting**: 1-second delay between batches to respect Spotify API limits
- **Progress Logging**: Detailed console logs for monitoring execution

## Configuration

### Environment Variables

The following environment variables must be set in your Supabase project:

- `SPOTIFY_CLIENT_ID`: Your Spotify API client ID
- `SPOTIFY_CLIENT_SECRET`: Your Spotify API client secret
- `SUPABASE_URL`: Your Supabase project URL
- `SUPABASE_SERVICE_ROLE_KEY`: Your Supabase service role key

### Cron Schedule

The function runs automatically via Supabase's cron system:

- **Schedule**: `0 0 * * *` (daily at midnight UTC)
- **Configuration**: See `cron.json` for details

## What It Does

1. **Fetches Published Artists**: Retrieves all published artists from the database
2. **Gets Spotify Token**: Obtains a fresh access token from Spotify API
3. **Updates Artist Data**: For each artist:
   - Fetches current profile data from Spotify
   - Gets latest release information
   - Updates `image_url` and `tagline` in the database
4. **Handles Errors**: Logs failures and continues processing other artists
5. **Provides Summary**: Returns detailed execution results

## Manual Execution

You can also trigger the function manually via HTTP request:

```bash
curl -X POST "https://your-project.supabase.co/functions/v1/refresh-spotify-artists" \
  -H "Authorization: Bearer YOUR_ANON_KEY"
```

## Response Format

```json
{
  "processed": 10,
  "succeeded": 9,
  "failed": 1,
  "failures": [
    {
      "id": "artist-uuid",
      "error": "Failed to fetch artist from Spotify: 404"
    }
  ],
  "execution_time_ms": 15000
}
```

## Monitoring

- Check Supabase Edge Function logs in the dashboard
- Monitor execution times and failure rates
- Review failed artist updates for potential issues

## Rate Limits

- Spotify API: Respects rate limits with 1-second delays between batches
- Batch size: 10 artists per batch
- Maximum execution time: 5 minutes (Supabase limit)

## Troubleshooting

### Common Issues

1. **Spotify API Errors**: Check if artist Spotify IDs are still valid
2. **Database Errors**: Verify service role key has proper permissions
3. **Timeout Errors**: Reduce batch size if processing too many artists

### Debugging

- Enable detailed logging in Supabase dashboard
- Check function logs for specific error messages
- Verify environment variables are correctly set
