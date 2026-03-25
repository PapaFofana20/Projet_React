// Fake user service for demo authentication
interface User {
  id: string;
  email: string;
  token: string;
}

const fakeUsers: User[] = [
  {
    id: '1',
    email: 'user@example.com',
    token: 'fake-jwt-token-123'
  },
  {
    id: '2',
    email: 'test@test.com',
    token: 'fake-jwt-token-456'
  }
];

export class UserService {
  static login(email: string, password: string): User | null {
    // Demo: hardcoded password check 'password123'
    if (password !== 'password123') {
      return null;
    }

    const user = fakeUsers.find(u => u.email === email);
    return user || null;
  }
}

