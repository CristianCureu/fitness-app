# Authentication System Documentation

This document explains the complete authentication setup for the Fitness App mobile application.

## Architecture Overview

The authentication system uses:
- **Supabase** for authentication (email/password, OAuth)
- **Zustand** for global state management
- **React Query** for server state and data fetching
- **React Hook Form** for form validation
- **Native Fetch API** for HTTP requests with JWT token injection

## Directory Structure

```
lib/
├── api/
│   ├── client.ts           # Fetch wrapper with JWT injection
│   ├── endpoints.ts        # Type-safe API endpoint functions
│   └── query-keys.ts       # Centralized React Query keys
├── hooks/
│   ├── use-auth.ts         # Authentication hooks
│   └── queries/
│       ├── use-today.ts
│       ├── use-checkins.ts
│       ├── use-sessions.ts
│       ├── use-clients.ts
│       ├── use-recommendations.ts
│       └── use-nutrition.ts
├── providers/
│   └── react-query-provider.tsx
├── stores/
│   └── auth-store.ts       # Zustand auth store
├── types/
│   └── api.ts              # TypeScript types
└── supabase.ts             # Supabase client config

app/
├── _layout.tsx             # Root layout with providers & route protection
├── auth/
│   ├── _layout.tsx
│   ├── sign-in.tsx
│   └── sign-up.tsx
└── (tabs)/
    └── ...
```

## Setup Instructions

### 1. Environment Variables

Create a `.env` file in the project root:

```bash
# Supabase Configuration
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# Backend API
EXPO_PUBLIC_API_URL=http://localhost:3000
```

### 2. Supabase Setup

1. Create a Supabase project at [supabase.com](https://supabase.com)
2. Enable Email authentication in Authentication > Providers
3. (Optional) Enable Google OAuth in Authentication > Providers
4. Copy your project URL and anon key to `.env`

### 3. Backend Requirements

Your NestJS backend must:
- Use Supabase Auth for JWT validation
- Implement the endpoints defined in `lib/api/endpoints.ts`
- Return responses in the format:
  ```typescript
  // Success
  { success: true, data: {...} }

  // Error
  { success: false, error: { statusCode: number, message: string, details?: any } }
  ```

## Authentication Flow

### Sign Up

```typescript
import { useAuthStore } from '@/lib/stores/auth-store';

const signUp = useAuthStore((state) => state.signUp);

// In your component
await signUp('user@example.com', 'password123');
// 1. Creates Supabase auth user
// 2. Calls POST /auth/register with authId
// 3. Stores session and appUser in Zustand
```

### Sign In

```typescript
import { useAuthStore } from '@/lib/stores/auth-store';

const signIn = useAuthStore((state) => state.signIn);

// In your component
await signIn('user@example.com', 'password123');
// 1. Authenticates with Supabase
// 2. Fetches or creates appUser from backend
// 3. Stores session and appUser in Zustand
```

### Sign Out

```typescript
import { useAuthStore } from '@/lib/stores/auth-store';

const signOut = useAuthStore((state) => state.signOut);

await signOut();
// Clears session from Supabase and Zustand
```

## Using Authentication in Components

### Get Current User

```typescript
import { useAuth } from '@/lib/hooks/use-auth';

function MyComponent() {
  const { appUser, supabaseUser, isAuthenticated, role } = useAuth();

  return (
    <View>
      <Text>Email: {supabaseUser?.email}</Text>
      <Text>Role: {role}</Text>
    </View>
  );
}
```

### Require Authentication

```typescript
import { useRequireAuth } from '@/lib/hooks/use-auth';

function ProtectedComponent() {
  const auth = useRequireAuth(); // Throws error if not authenticated

  return <View>...</View>;
}
```

### Role-Based Access

```typescript
import { useRequireClient, useRequireTrainer } from '@/lib/hooks/use-auth';

function ClientOnlyComponent() {
  const auth = useRequireClient(); // Throws error if not CLIENT
  return <View>...</View>;
}

function TrainerOnlyComponent() {
  const auth = useRequireTrainer(); // Throws error if not TRAINER
  return <View>...</View>;
}
```

## Making API Requests

### Using Endpoint Functions

```typescript
import { todayApi } from '@/lib/api/endpoints';

// Get today's data
const todayData = await todayApi.getToday();

// Create check-in
const checkin = await checkinApi.upsertToday({
  weight: 75,
  energyLevel: 8,
  stressLevel: 3,
});
```

### Using React Query Hooks

```typescript
import { useTodayView } from '@/lib/hooks/queries/use-today';
import { useUpsertCheckin } from '@/lib/hooks/queries/use-checkins';

function TodayScreen() {
  const { data, isLoading, error } = useTodayView();
  const upsertCheckin = useUpsertCheckin();

  const handleSubmit = async (checkinData) => {
    await upsertCheckin.mutateAsync(checkinData);
  };

  if (isLoading) return <ActivityIndicator />;
  if (error) return <Text>Error: {error.message}</Text>;

  return <View>{/* Render data */}</View>;
}
```

## Query Keys Pattern

All React Query keys are centralized in `lib/api/query-keys.ts`:

```typescript
import { queryKeys } from '@/lib/api/query-keys';

// Examples
queryKeys.today.all()                      // ['today']
queryKeys.clients.detail('123')            // ['clients', '123']
queryKeys.sessions.all({ status: 'SCHEDULED' })  // ['sessions', { status: 'SCHEDULED' }]
```

This ensures:
- Type-safe query keys
- Easy invalidation
- Consistent naming
- Better refactoring

## Route Protection

The app automatically redirects users:
- **Not authenticated** → `/auth/sign-in`
- **Authenticated & on auth screen** → `/(tabs)`

This is handled in [app/_layout.tsx](../app/_layout.tsx:18-24):

```typescript
if (!session && !inAuthGroup) {
  router.replace('../auth/sign-in');
} else if (session && inAuthGroup) {
  router.replace('../(tabs)');
}
```

## Token Management

JWT tokens are automatically:
1. Retrieved from Supabase session
2. Injected into all API requests via `Authorization: Bearer <token>`
3. Refreshed automatically by Supabase
4. Validated by backend

See [lib/api/client.ts](../lib/api/client.ts:42-47) for implementation.

## Error Handling

### API Errors

```typescript
import { ApiError } from '@/lib/api/client';

try {
  const data = await todayApi.getToday();
} catch (error) {
  if (error instanceof ApiError) {
    console.log('Status:', error.statusCode);
    console.log('Message:', error.message);
    console.log('Details:', error.details);
  }
}
```

### Mutation Errors

```typescript
const createSession = useCreateSession();

createSession.mutate(sessionData, {
  onError: (error) => {
    if (error instanceof ApiError) {
      Alert.alert('Error', error.message);
    }
  },
  onSuccess: (data) => {
    Alert.alert('Success', 'Session created!');
  },
});
```

## Best Practices

### 1. Use Hooks for Queries

✅ **Good:**
```typescript
import { useTodayView } from '@/lib/hooks/queries/use-today';

function MyComponent() {
  const { data } = useTodayView();
}
```

❌ **Bad:**
```typescript
import { todayApi } from '@/lib/api/endpoints';

function MyComponent() {
  const [data, setData] = useState(null);

  useEffect(() => {
    todayApi.getToday().then(setData);
  }, []);
}
```

### 2. Explicit Imports

✅ **Good:**
```typescript
import { useCheckins, useUpsertCheckin } from '@/lib/hooks/queries/use-checkins';
```

❌ **Bad:**
```typescript
import { useCheckins, useUpsertCheckin } from '@/lib/hooks';
```

### 3. Centralized Query Keys

✅ **Good:**
```typescript
import { queryKeys } from '@/lib/api/query-keys';

queryClient.invalidateQueries({ queryKey: queryKeys.today.all() });
```

❌ **Bad:**
```typescript
queryClient.invalidateQueries({ queryKey: ['today'] });
```

### 4. Type Safety

All API responses are fully typed. Use TypeScript to catch errors:

```typescript
import type { TodayView } from '@/lib/types/api';

const { data } = useTodayView();
// data is typed as TodayView | undefined
// TypeScript will catch property access errors
```

## Testing Authentication

### 1. Start the app:
```bash
npm start
```

### 2. Test sign up:
- Enter email and password
- Should create Supabase user
- Should call backend `/auth/register`
- Should redirect to tabs

### 3. Test sign in:
- Enter credentials
- Should authenticate
- Should fetch app user
- Should redirect to tabs

### 4. Test sign out:
- Click sign out
- Should clear session
- Should redirect to sign in

## Troubleshooting

### "Missing Supabase environment variables"
- Check `.env` file exists
- Restart Metro bundler after adding `.env`

### "Failed to fetch app user"
- Check backend is running
- Verify API_URL in `.env`
- Check network connectivity
- Verify backend returns correct response format

### "Navigation error"
- Clear app data/cache
- Restart Metro bundler
- Check route names match file structure

### TypeScript errors
- Run `npm run lint` to check for errors
- Ensure all types are imported correctly
- Check `tsconfig.json` paths are correct

## Additional Resources

- [Supabase Docs](https://supabase.com/docs)
- [React Query Docs](https://tanstack.com/query/latest)
- [Zustand Docs](https://zustand-demo.pmnd.rs/)
- [Expo Router Docs](https://docs.expo.dev/router/introduction/)
- [React Hook Form Docs](https://react-hook-form.com/)