export interface User {
  id: number;
  email: string;
  role: "USER" | "ADMIN";
  accessToken: string;
}
