export interface User {
  id: string;
  name: string;
  email: string;
  password?: string;
  createdAt: string;
}

const STORAGE_KEY = 'app_users';

export const UserService = {
  getUsers: (): User[] => {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  },

  register: (user: Omit<User, 'id' | 'createdAt'>): User | null => {
    const users = UserService.getUsers();
    
    if (users.find(u => u.email === user.email)) {
      return null;
    }

    const newUser: User = {
      ...user,
      id: Math.random().toString(36).substring(2, 9),
      createdAt: new Date().toISOString(),
    };

    const updatedUsers = [...users, newUser];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedUsers));
    return newUser;
  },

  login: (email: string, password: string): User | null => {
    const users = UserService.getUsers();
    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
      const { password: _, ...userWithoutPassword } = user;
      return userWithoutPassword as User;
    }
    
    return null;
  }
};
