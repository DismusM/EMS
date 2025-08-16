import 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      name: string;
      email: string;
      role: string;
      status: string;
    };
  }

  interface User {
    id: string;
    name: string;
    email: string;
    role: string;
    status: string;
  }
}
