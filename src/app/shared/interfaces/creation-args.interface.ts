export interface CreationArgs {
  classes?: string[]
  attributes?: renderer2Attribute[]
}


interface renderer2Attribute {
  name: string,
  value: string,
  namespace?: string
}
