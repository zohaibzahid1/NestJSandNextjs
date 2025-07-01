import { Injectable } from '@nestjs/common';

@Injectable() // nest automatiicaly creates an instance of this class and inject it into where needed
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }
  getBye(): string {
    return "Bye World!"
  }
}
