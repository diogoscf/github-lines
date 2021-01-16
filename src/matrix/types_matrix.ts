/**
 * Matrix-specific configuration.
 */
export class MatrixConfig {
  readonly MATRIX_TOKEN: string;

  readonly MATRIX_HOMESERVER: string;

  constructor(token: string, homeserver: string) {
    this.MATRIX_TOKEN = token;
    this.MATRIX_HOMESERVER = homeserver;
  }
}
