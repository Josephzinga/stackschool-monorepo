import { Global, Module } from '@nestjs/common';
import { SESSION_STORE, sessionStoreProvider } from './session-store.provider';

@Global()
@Module({
  providers: [sessionStoreProvider],
  exports: [SESSION_STORE],
})
export class SessionModule {}
