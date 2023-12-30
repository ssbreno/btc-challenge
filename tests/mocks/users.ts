import { User } from '../../src/domain/entities/user.entity'
import { faker } from '@faker-js/faker'

export const UserMock = (override = {} as Partial<User>): User => ({
  id: faker.string.uuid(),
  email: faker.internet.email(),
  name: faker.person.fullName(),
  password: faker.internet.password(),
  ...override,
})
