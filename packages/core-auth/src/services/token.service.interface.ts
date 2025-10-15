export abstract class AuthTokenService {
  abstract generate(payload: object): Promise<string>;
}