export interface RegisterData {
  name: string;
  email: string;
  cpf: string;
  password?: string;
  passwordHash?: string;
}

export interface LoginData {
  email: string;
  password?: string;
  passwordHash?: string;
}