export interface Employee {
  id: string,
  firstName: string,
  lastName: string,
  active: boolean,
  hireDate: Date,
  salary: number,
  title: string
}

export const TITLES = [
  'Associate',
  'Supervisor',
  'Manager'
]
