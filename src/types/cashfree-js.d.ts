/* eslint-disable no-unused-vars */

declare module '@cashfreepayments/cashfree-js' {
  export function load(options: {
    mode: 'sandbox' | 'production';
  }): Promise<any>;
}
