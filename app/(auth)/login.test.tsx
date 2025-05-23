import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { useRouter } from 'expo-router';
import LoginScreen from './login';
import { useAuthContext } from '@/components/AuthContext';

// Mock the router
jest.mock('expo-router', () => ({
  useRouter: jest.fn(),
}));

// Mock the auth context
jest.mock('@/components/AuthContext', () => ({
  useAuthContext: jest.fn(),
}));

describe('LoginScreen', () => {
  const mockRouter = {
    push: jest.fn(),
  };

  const mockSignIn = jest.fn();

  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();

    // Setup router mock
    (useRouter as jest.Mock).mockReturnValue(mockRouter);

    // Setup auth context mock
    (useAuthContext as jest.Mock).mockReturnValue({
      signIn: mockSignIn,
      error: null,
      isLoading: false,
    });
  });

  it('renders login form correctly', () => {
    const { getByPlaceholderText, getByText } = render(<LoginScreen />);

    // Check if all form elements are present
    expect(getByPlaceholderText('Enter your email')).toBeTruthy();
    expect(getByPlaceholderText('Enter your password')).toBeTruthy();
    expect(getByText('Sign In')).toBeTruthy();
  });

  it('shows validation errors for empty fields', async () => {
    const { getByText } = render(<LoginScreen />);
    
    // Try to submit without entering data
    fireEvent.press(getByText('Sign In'));

    // Check for validation error
    await waitFor(() => {
      expect(getByText('Email is required')).toBeTruthy();
    });
  });

  it('handles successful admin login', async () => {
    const { getByPlaceholderText, getByText } = render(<LoginScreen />);

    // Fill in admin credentials
    fireEvent.changeText(getByPlaceholderText('Enter your email'), 'admin@example.com');
    fireEvent.changeText(getByPlaceholderText('Enter your password'), 'admin123');

    // Submit form
    fireEvent.press(getByText('Sign In'));

    // Verify sign in was called with correct credentials
    await waitFor(() => {
      expect(mockSignIn).toHaveBeenCalledWith('admin@example.com', 'admin123');
    });
  });

  it('handles successful manager login', async () => {
    const { getByPlaceholderText, getByText } = render(<LoginScreen />);

    // Fill in manager credentials
    fireEvent.changeText(getByPlaceholderText('Enter your email'), 'manager@example.com');
    fireEvent.changeText(getByPlaceholderText('Enter your password'), 'manager123');

    // Submit form
    fireEvent.press(getByText('Sign In'));

    // Verify sign in was called with correct credentials
    await waitFor(() => {
      expect(mockSignIn).toHaveBeenCalledWith('manager@example.com', 'manager123');
    });
  });

  it('handles successful tenant login', async () => {
    const { getByPlaceholderText, getByText } = render(<LoginScreen />);

    // Fill in tenant credentials
    fireEvent.changeText(getByPlaceholderText('Enter your email'), 'tenant@example.com');
    fireEvent.changeText(getByPlaceholderText('Enter your password'), 'tenant123');

    // Submit form
    fireEvent.press(getByText('Sign In'));

    // Verify sign in was called with correct credentials
    await waitFor(() => {
      expect(mockSignIn).toHaveBeenCalledWith('tenant@example.com', 'tenant123');
    });
  });

  it('displays error message on failed login', async () => {
    // Setup auth context with error
    (useAuthContext as jest.Mock).mockReturnValue({
      signIn: mockSignIn,
      error: 'Invalid credentials',
      isLoading: false,
    });

    const { getByText } = render(<LoginScreen />);

    // Check if error message is displayed
    expect(getByText('Invalid credentials')).toBeTruthy();
  });

  it('shows loading state during authentication', async () => {
    // Setup auth context with loading state
    (useAuthContext as jest.Mock).mockReturnValue({
      signIn: mockSignIn,
      error: null,
      isLoading: true,
    });

    const { getByTestId } = render(<LoginScreen />);

    // Check if loading indicator is shown
    expect(getByTestId('loading-indicator')).toBeTruthy();
  });

  it('handles quick login buttons correctly', async () => {
    const { getByText } = render(<LoginScreen />);

    // Test tenant quick login
    fireEvent.press(getByText('Tenant'));
    expect(getByPlaceholderText('Enter your email')).toHaveValue('tenant@example.com');
    expect(getByPlaceholderText('Enter your password')).toHaveValue('tenant123');

    // Test manager quick login
    fireEvent.press(getByText('Manager'));
    expect(getByPlaceholderText('Enter your email')).toHaveValue('manager@example.com');
    expect(getByPlaceholderText('Enter your password')).toHaveValue('manager123');

    // Test admin quick login
    fireEvent.press(getByText('Admin'));
    expect(getByPlaceholderText('Enter your email')).toHaveValue('admin@example.com');
    expect(getByPlaceholderText('Enter your password')).toHaveValue('admin123');
  });
});