export type Role = 'admin' | 'customer' | 'vendor' | 'marketer';

export interface MockUser {
  id: string;
  name: string;
  email: string;
  password: string;
  role: Role;
}

const SEED_USERS: MockUser[] = [
  { id: '1', name: 'Admin', email: 'admin@demo.com', password: 'admin123', role: 'admin' },
  { id: '2', name: 'Vendor', email: 'vendor@demo.com', password: 'vendor123', role: 'vendor' },
  { id: '3', name: 'Marketer', email: 'marketer@demo.com', password: 'marketer123', role: 'marketer' },
  { id: '4', name: 'Customer', email: 'user@demo.com', password: 'user12345', role: 'customer' },
];

const STORAGE_KEY = 'mock_users';

function readStore(): MockUser[] | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) return parsed as MockUser[];
    return null;
  } catch {
    return null;
  }
}

function writeStore(users: MockUser[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
  } catch {
    // ignore
  }
}

export function getUsers(): MockUser[] {
  const existing = readStore();
  if (existing && existing.length) return existing;
  writeStore(SEED_USERS);
  return [...SEED_USERS];
}

export function saveUsers(users: MockUser[]) {
  writeStore(users);
}

export function findUserByEmail(email: string): MockUser | undefined {
  const normalized = email.trim().toLowerCase();
  return getUsers().find(u => u.email.toLowerCase() === normalized);
}

export function authenticate(email: string, password: string): MockUser | null {
  const normalized = email.trim().toLowerCase();
  const users = getUsers();
  const match = users.find(u => u.email.toLowerCase() === normalized && u.password === password);
  return match || null;
}

export function addUser(newUser: Omit<MockUser, 'id'>): { ok: true; user: MockUser } | { ok: false; error: string } {
  const users = getUsers();
  const exists = users.some(u => u.email.toLowerCase() === newUser.email.trim().toLowerCase());
  if (exists) return { ok: false, error: 'EMAIL_TAKEN' };
  const user: MockUser = { ...newUser, id: String(Date.now()) };
  users.push(user);
  saveUsers(users);
  return { ok: true, user };
}

export function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function validatePasswordMin(password: string, min = 6): boolean {
  return typeof password === 'string' && password.length >= min;
}
