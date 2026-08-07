/**
 * Ambient globals for PCore / PConnect.
 *
 * @pega/pcore-pconnect-typedefs@5.1.0 exports types as a module and no longer
 * includes `declare global` (unlike 4.x). This file restores the globals the
 * package README documents — it does not invent APIs.
 */
import type { PCore as PCoreType } from '@pega/pcore-pconnect-typedefs';
import type { C11nEnv } from '@pega/pcore-pconnect-typedefs/interpreter/c11n-env';

declare global {
  var PCore: PCoreType;
  var PConnect: C11nEnv;
  function getPConnect(): C11nEnv;

  interface Window {
    PCore: PCoreType;
  }
}

export {};
