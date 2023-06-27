import { Injectable } from '@nestjs/common';
// Module option
import { HttpModuleOptionsFactory } from '@nestjs/axios';
// Type
import type { HttpModuleOptions } from '@nestjs/axios';


@Injectable()
export class ApiConfigProvider implements HttpModuleOptionsFactory {
  createHttpOptions(): HttpModuleOptions {
    return {
      baseURL: `https://api.nasa.gov/planetary`,
      timeout: 8000
    };
  }
}