export class Maintainer {
    constructor(
        public maintainerId:number,
      public maintainerName: string,
      public roomSize:number
    ) {}
  }
  
export interface Maintainermodel{
    maintainerId:number;
    maintainerName: string;
    roomSize:number;
}