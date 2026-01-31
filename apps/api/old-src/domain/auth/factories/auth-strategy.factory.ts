import { Injectable } from '@nestjs/common';

export interface AuthStrategy {
  validate(credentials: any): Promise<any>;
}

@Injectable()
export class AuthStrategyFactory {
  private strategies = new Map<string, AuthStrategy>();

  register(name: string, strategy: AuthStrategy) {
    this.strategies.set(name, strategy);
  }

  get(name: string): AuthStrategy {
    const strategy = this.strategies.get(name);
    if (!strategy) {
      throw new Error(`Strategy ${name} not found`);
    }
    return strategy;
  }
}
