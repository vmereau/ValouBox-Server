export enum JwtType {
  Access = 'access',
}

export interface JwtPayload {
  sub: string;
  type: JwtType;
  jti?: string;
}
