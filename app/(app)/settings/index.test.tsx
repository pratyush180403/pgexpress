import { render, fireEvent, waitFor } from '@testing-library/react-native';
import SettingsScreen from './index';
import { useTheme } from '@/components/ThemeContext';
import { useAuthContext } from '@/components/AuthContext';

jest.mock('@/components/ThemeContext');
jest.mock('@/components/AuthContext');
jest.mock('expo-router', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

describe('SettingsScreen', () => {
  beforeEach(() => {
    (useTheme as jest.Mock).mockReturnValue({
      colors: {
        text: '#000000',
        background: '#FFFFFF',
        primary: '#0A6CFF',
        surface: '#F5F5F5',
        textSecondary: '#666666',
        border: '#E0E0E0',
      },
    });

    (useAuthContext as jest.Mock).mockReturnValue({
      user: {
        id: '1',
        name: 'Test User',
        email: 'test@example.com',
        role: 'tenant',
      },
      signOut: jest.fn(),
    });
  });

  it('renders correctly', () => {
    const { getByText } = render(<SettingsScreen />);
    expect(getByText('Settings')).toBeTruthy();
  });

  it('handles search functionality', async () => {
    const { getByPlaceholderText, getByText } = render(<SettingsScreen />);
    const searchInput = getByPlaceholderText('Search settings...');
    
    fireEvent.changeText(searchInput, 'notifications');
    await waitFor(() => {
      expect(getByText('Notifications')).toBeTruthy();
    });
  });

  it('toggles quick settings', async () => {
    const { getByText, getByTestId } = render(<SettingsScreen />);
    const notificationToggle = getByTestId('notification-toggle');
    
    fireEvent.press(notificationToggle);
    await waitFor(() => {
      expect(getByText('Notifications enabled')).toBeTruthy();
    });
  });

  it('navigates to profile settings', () => {
    const { getByText } = render(<SettingsScreen />);
    const profileButton = getByText('Profile');
    
    fireEvent.press(profileButton);
    // Add navigation assertions
  });

  it('handles sign out', async () => {
    const signOut = jest.fn();
    (useAuthContext as jest.Mock).mockReturnValue({
      user: {
        id: '1',
        name: 'Test User',
        email: 'test@example.com',
        role: 'tenant',
      },
      signOut,
    });

    const { getByText } = render(<SettingsScreen />);
    const signOutButton = getByText('Sign Out');
    
    fireEvent.press(signOutButton);
    await waitFor(() => {
      expect(signOut).toHaveBeenCalled();
    });
  });
});