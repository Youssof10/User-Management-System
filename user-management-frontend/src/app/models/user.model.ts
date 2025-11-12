

/**
 * Interface defining the exact data needed to register a new user.
 * This includes the password, which is NOT stored in the main User interface.
 */
export interface RegistrationData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role?: 'user' | 'admin';
}

/**
 * Interface defining the exact data needed to log in.
 */
export interface Credentials {
  email: string;
  password: string;
}

/**
 * This interface defines the data structure for a User,
 * matching the data coming from our Node.js backend after registration/login.
 * NOTE: It explicitly does NOT include the password field.
 */
export interface User {
  _id: string; // MongoDB primary key
  firstName: string;
  lastName: string;
  email: string;
  role: 'user' | 'admin';
  createdAt: string; // Timestamps are usually strings (ISO date)
  updatedAt: string;
}

/**
 * This interface defines the shape of the successful API response
 * for both Login and Register endpoints.
 */
export interface AuthResponse {
  status: string;
  data: {
    user: User;
    token: string;
  };
}
