import type { DefaultSettableTheme } from '@pega/cosmos-react-core';

declare module 'styled-components' {
  export interface DefaultTheme extends DefaultSettableTheme {
    [key: string]: unknown;
  }
}
