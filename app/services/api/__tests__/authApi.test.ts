import AsyncStorage from '@react-native-async-storage/async-storage';
import { signUp, login } from '../authApi';
import apiClient from '../apiClient';
import { SignUpData, LoginData } from '@/app/types/auth';

jest.mock('@react-native-async-storage/async-storage');
jest.mock('../apiClient');

describe('authApi', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('signUp', () => {
        it('should sign up a user and store the token', async () => {
            const userData: SignUpData = { name: 'John Doe', email: 'john@example.com', password: 'password' };
            const token = 'mockToken';
            (apiClient.post as jest.Mock).mockResolvedValue({ data: { token } });

            const response = await signUp(userData);

            expect(apiClient.post).toHaveBeenCalledWith('/auth/signup', userData);
            expect(AsyncStorage.setItem).toHaveBeenCalledWith('authToken', token);
            expect(response.token).toBe(token);
        });

        it('should throw an error if sign up fails', async () => {
            const userData: SignUpData = { name: 'John Doe', email: 'john@example.com', password: 'password' };
            const errorMessage = 'Error signing up';
            (apiClient.post as jest.Mock).mockRejectedValue(new Error(errorMessage));

            await expect(signUp(userData)).rejects.toThrow(errorMessage);
        });
    });

    describe('login', () => {
        it('should log in a user and store the token', async () => {
            const userData: LoginData = { email: 'john@example.com', password: 'password' };
            const token = 'mockToken';
            (apiClient.post as jest.Mock).mockResolvedValue({ data: { token } });

            const response = await login(userData);

            expect(apiClient.post).toHaveBeenCalledWith('/auth/login', userData);
            expect(AsyncStorage.setItem).toHaveBeenCalledWith('authToken', token);
            expect(response.token).toBe(token);
        });

        it('should throw an error if login fails', async () => {
            const userData: LoginData = { email: 'john@example.com', password: 'password' };
            const errorMessage = 'Error logging in';
            (apiClient.post as jest.Mock).mockRejectedValue(new Error(errorMessage));

            await expect(login(userData)).rejects.toThrow(errorMessage);
        });
    });
});

