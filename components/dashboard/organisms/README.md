# Dashboard Form Components

This directory contains form components used in the dashboard section of the Jovie application, along with their Storybook stories.

## Components

### OnboardingForm

A form used during the onboarding process to set up a new user profile. It includes handle validation and artist selection.

**Stories:**
- Pristine: Initial state
- WithValues: Form with entered values
- WithValidationError: Shows validation error for taken handle
- WithFormatError: Shows format validation error
- Submitting: Loading/submitting state
- WithSelectedArtist: Shows selected artist information
- Mobile: Mobile viewport
- DarkMode: Dark theme

### ProfileForm

A form for updating artist profile information including name, tagline, and profile image.

**Stories:**
- Pristine: Initial state with default values
- WithDifferentValues: Form with different artist values
- WithoutImage: Form without a profile image
- WithBrandingHidden: Form with branding hidden
- Submitting: Loading/submitting state
- SuccessState: Shows success message after submission
- Mobile: Mobile viewport
- DarkMode: Dark theme

### ListenNowForm

A form for managing music streaming links (Spotify, Apple Music, YouTube).

**Stories:**
- Pristine: Initial state with all links
- WithSomeLinks: Form with only some links filled
- WithoutLinks: Form with no links
- Submitting: Loading/submitting state
- SuccessState: Shows success message after submission
- Mobile: Mobile viewport
- DarkMode: Dark theme

### SocialsForm

A form for managing social media links with dynamic add/remove functionality.

**Stories:**
- WithExistingLinks: Form with existing social links
- EmptyState: Form with no social links
- AddingNewLink: Shows adding a new social link
- RemovingLink: Shows removing a social link
- Submitting: Loading/submitting state
- SuccessState: Shows success message after submission
- Mobile: Mobile viewport
- DarkMode: Dark theme

## Usage

These stories demonstrate various states of the form components, including:
- Initial/pristine state
- Populated state with values
- Validation errors
- Loading/submitting states
- Success states
- Responsive design (mobile/desktop)
- Theme variations (light/dark)

## Testing

The stories include interaction tests using the Storybook Testing Library to simulate user interactions and verify component behavior.

