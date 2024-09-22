// @ts-ignore
import axios, {AxiosResponse} from 'axios';
import {LOGIN_URL, REGISTER_URL} from '../utils/urlUtils';

interface LoginResponse {
    message: string;
    token: string;
    username: string;
    userType: string;
}

interface RegisterResponse {
    message: string;
    token: string;
    username: string;
    userType: string;
    email: string;
}

export const loginUser = async (username: string, password: string): Promise<LoginResponse> => {
    try {
        const response: AxiosResponse<LoginResponse> = await axios.post(LOGIN_URL, {username, password});

        // Ensure the response data matches LoginResponse structure
        return response.data;
    } catch (error: any) {
        // Handle error
        if (error.response) {
            // Server responded with a non-2xx status code
            throw new Error(error.response.data.message || 'Login failed');
        } else if (error.request) {
            // No response was received
            throw new Error('No response from the server');
        } else {
            // Other errors (e.g., setup issue)
            throw new Error(`Login error: ${error.message}`);
        }
    }
};

export const registerUser = async (username: string, password: string, email: string, user_type: string): Promise<RegisterResponse> => {
    try {
        const response: AxiosResponse<RegisterResponse> = await axios.post(REGISTER_URL, {
            username,
            password,
            email,
            user_type: user_type
        });

        // Ensure the response data matches RegisterResponse structure
        return response.data;
    } catch (error: any) {
        // Handle error
        if (error.response) {
            // Server responded with a non-2xx status code
            throw new Error(error.response.data.message || 'Registration failed');
        } else if (error.request) {
            // No response was received
            throw new Error('No response from the server');
        } else {
            // Other errors (e.g., setup issue)
            throw new Error(`Login error: ${error.message}`);
        }
    }
};
