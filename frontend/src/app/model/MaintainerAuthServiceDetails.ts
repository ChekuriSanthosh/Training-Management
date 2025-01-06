export class MaintainerDetails {
    constructor(
      public username: string,
      public password: string,
      public role: string = 'MAINTAINER',
      public userId:number
    ) {}
  }

  export interface AuthDetails{
    username: string;
    password: string;
    role: string; 
    userId:number;
  }
  