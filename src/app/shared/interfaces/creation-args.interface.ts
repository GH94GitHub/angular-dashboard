export interface CreationArgs {
  classes?: string[]
  attributes?: renderer2Attribute[],
  properties?: nameValue[]
}


interface renderer2Attribute {
  name: string,
  value: string,
  namespace?: string
}

interface nameValue {
  name: string,
  value: string
}
