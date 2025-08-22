# Marketing/Home Components Storybook Coverage

This directory contains Storybook stories for the key marketing and home page components of the Jovie application.

## Components Covered

### 1. HomeHero

- **File**: `HomeHero.tsx`
- **Stories**: `HomeHero.stories.tsx`
- **Scenarios**:
  - Default state
  - Custom subtitle
  - JSX subtitle
  - Long subtitle
  - Loading state
  - With claim handle form
  - Dark mode

### 2. BenefitsSection

- **File**: `BenefitsSection.tsx`
- **Stories**: `BenefitsSection.stories.tsx`
- **Scenarios**:
  - Default state
  - Dark mode

### 3. FeaturedArtists

- **File**: `FeaturedArtists.tsx`
- **Stories**: `FeaturedArtists.stories.tsx`
- **Scenarios**:
  - With data
  - Empty state
  - With long names
  - With many artists
  - Dark mode

### 4. ArtistCarousel

- **File**: `ArtistCarousel.tsx`
- **Stories**: `ArtistCarousel.stories.tsx`
- **Scenarios**:
  - With data
  - Empty state
  - With long names
  - With many artists
  - With missing images
  - Dark mode

### 5. ArtistSearch

- **File**: `ArtistSearch.tsx`
- **Stories**: `ArtistSearch.stories.tsx`
- **Scenarios**:
  - Default state
  - Focused state
  - With input
  - Searching state
  - Dark mode

### 6. ClaimHandleForm

- **File**: `ClaimHandleForm.tsx`
- **Stories**: `ClaimHandleForm.stories.tsx`
- **Scenarios**:
  - Empty state
  - Focused state
  - With valid input
  - With invalid input
  - With taken handle
  - With server error
  - With long handle
  - Dark mode

## Testing Scenarios

All components have been tested with the following scenarios where applicable:

1. **Loading States**: Components that have loading states are tested with simulated loading.
2. **Empty States**: Components that can be empty are tested with no data.
3. **With Data**: Components are tested with realistic mock data.
4. **Long Text**: Components are tested with long text to ensure proper handling of overflow.
5. **Dark Mode**: All components are tested in dark mode to ensure proper styling.

## Running Storybook

To view these stories in Storybook:

```bash
npm run storybook
```

## Chromatic Snapshots

Chromatic snapshots are automatically generated for all stories to prevent regressions.
