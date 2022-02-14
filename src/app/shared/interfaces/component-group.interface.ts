import { Control } from "./control.interface";

export interface ComponentGroup {
  widgets?: Control[],
  forms?: Control[],
  manage?: Control[]
}
