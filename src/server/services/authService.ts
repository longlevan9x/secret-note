import { serverConfig } from "../config/serverConfig";

export class AuthService {
  isAuthorized(authHeader: string | null): boolean {
    const loginPassword = serverConfig.loginPassword;
    
    // Debug log
    console.log("Auth Debug:", {
      hasHeader: !!authHeader,
      expected: `Bearer ${loginPassword ? '********' : 'EMPTY'}`,
      match: authHeader === `Bearer ${loginPassword}`
    });

    if (!loginPassword) return true;
    return authHeader === `Bearer ${loginPassword}`;
  }
}

export const authService = new AuthService();
