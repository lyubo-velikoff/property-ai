import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Login from '../Login';
import { AuthProvider } from '../../../contexts/auth';
import type { User } from '../../../types/api';

// Mock the auth service
vi.mock('../../../services/auth', () => ({
  login: vi.fn(),
  getCurrentUser: vi.fn(),
}));

// Mock the useNavigate hook
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

const mockUserData: User = {
  id: 'test-id',
  email: 'admin@avalon.bg',
  name: 'Admin',
  role: 'ADMIN',
  createdAt: '2025-01-13T20:16:21.392Z',
};

const mockToken = 'mock-jwt-token';

// Mock localStorage
const mockStorage: { [key: string]: string } = {};
const mockLocalStorage = {
  getItem: vi.fn((key: string) => {
    console.log('Getting from localStorage:', key, mockStorage[key]);
    return mockStorage[key] || null;
  }),
  setItem: vi.fn((key: string, value: string) => {
    console.log('Setting in localStorage:', key, value);
    mockStorage[key] = value;
  }),
  removeItem: vi.fn((key: string) => {
    console.log('Removing from localStorage:', key);
    delete mockStorage[key];
  }),
  clear: vi.fn(() => {
    console.log('Clearing localStorage');
    Object.keys(mockStorage).forEach(key => delete mockStorage[key]);
  }),
  length: 0,
  key: vi.fn(),
};
Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage,
});

describe('Login Component', () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
        },
      },
    });
    // Clear localStorage and reset user state before each test
    mockLocalStorage.clear();
    // Reset all mocks
    vi.clearAllMocks();
    console.log('Test setup complete - localStorage cleared');
  });

  afterEach(() => {
    mockLocalStorage.clear();
    vi.clearAllMocks();
    console.log('Test cleanup complete');
  });

  const renderLogin = async () => {
    console.log('Rendering Login component');
    let component: ReturnType<typeof render>;
    await act(async () => {
      component = render(
        <BrowserRouter>
          <QueryClientProvider client={queryClient}>
            <AuthProvider>
              <Login />
            </AuthProvider>
          </QueryClientProvider>
        </BrowserRouter>
      );
    });
    return component!;
  };

  it('should successfully log in and persist user data', async () => {
    const { login } = await import('../../../services/auth');
    console.log('Setting up login test');
    
    // Mock successful login response
    (login as any).mockResolvedValueOnce({
      user: mockUserData,
      token: mockToken,
    });

    await renderLogin();

    // Fill in the login form
    const emailInput = screen.getByLabelText(/имейл/i);
    const passwordInput = screen.getByLabelText(/парола/i);
    const submitButton = screen.getByRole('button', { name: /вход/i });

    fireEvent.change(emailInput, { target: { value: 'admin@avalon.bg' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    console.log('Submitting login form');
    
    await act(async () => {
      fireEvent.submit(submitButton);
    });

    // Wait for the login to complete and check all effects
    await waitFor(() => {
      expect(login).toHaveBeenCalledWith({
        email: 'admin@avalon.bg',
        password: 'password123',
      });
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith('token', mockToken);
      expect(mockNavigate).toHaveBeenCalledWith('/admin');
    });
    console.log('Login test complete');
  });

  it('should persist login state after page refresh', async () => {
    const { getCurrentUser } = await import('../../../services/auth');
    console.log('Setting up persistence test');
    
    // Set up initial auth state with token
    mockStorage['token'] = mockToken;
    
    // Set window.location.pathname to /admin/login
    window.location.pathname = '/admin/login';
    
    // Mock getCurrentUser to return user data in the format expected by the auth context
    (getCurrentUser as any).mockImplementation(async () => {
      console.log('getCurrentUser called with token:', mockStorage['token']);
      if (!mockStorage['token']) {
        throw new Error('No token found');
      }
      // Return the user data directly as the auth context expects
      return mockUserData;
    });
    
    console.log('Initial state set:', { token: mockToken, user: mockUserData });

    // Render component which should trigger getCurrentUser
    const { container } = await renderLogin();

    // Wait for getCurrentUser to be called and return data
    await waitFor(() => {
      expect(getCurrentUser).toHaveBeenCalled();
    });

    // Wait for user state to be updated and navigation to occur
    await waitFor(() => {
      const authProvider = container.querySelector('[data-testid="auth-provider"]');
      expect(authProvider).toHaveAttribute('data-user', JSON.stringify({ user: mockUserData }));
      expect(mockNavigate).toHaveBeenCalledWith('/admin');
    }, { timeout: 3000 });

    // Verify token remains in localStorage
    expect(mockStorage['token']).toBe(mockToken);
    
    console.log('Persistence test complete');
  });

  it('should handle login failure', async () => {
    const { login } = await import('../../../services/auth');
    console.log('Setting up failure test');
    
    // Mock login failure
    (login as any).mockRejectedValueOnce(new Error('Invalid credentials'));

    await renderLogin();

    // Fill in the login form
    const emailInput = screen.getByLabelText(/имейл/i);
    const passwordInput = screen.getByLabelText(/парола/i);
    const submitButton = screen.getByRole('button', { name: /вход/i });

    fireEvent.change(emailInput, { target: { value: 'wrong@email.com' } });
    fireEvent.change(passwordInput, { target: { value: 'wrongpass' } });
    console.log('Submitting invalid credentials');
    
    await act(async () => {
      fireEvent.submit(submitButton);
    });

    // Wait for error messages to appear
    await waitFor(() => {
      const errorMessages = screen.getAllByText(/невалиден имейл или парола/i);
      expect(errorMessages).toHaveLength(2);
      expect(mockNavigate).not.toHaveBeenCalled();
      expect(mockLocalStorage.getItem('token')).toBeNull();
    });
    console.log('Failure test complete');
  });

  it('should validate form inputs before submission', async () => {
    const { login } = await import('../../../services/auth');
    console.log('Setting up validation test');
    await renderLogin();

    const submitButton = screen.getByRole('button', { name: /вход/i });

    // Try to submit empty form
    console.log('Submitting empty form');
    await act(async () => {
      fireEvent.submit(submitButton);
    });

    // Check for validation messages
    const emailInput = screen.getByLabelText(/имейл/i);
    fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
    console.log('Entered invalid email');
    
    await waitFor(() => {
      expect(screen.getByText('Невалиден имейл адрес')).toBeInTheDocument();
      expect(login).not.toHaveBeenCalled();
    });
    console.log('Validation test complete');
  });
}); 
