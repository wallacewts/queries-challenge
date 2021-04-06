import { getRepository, Repository } from 'typeorm';

import { IFindUserWithGamesDTO, IFindUserByFullNameDTO } from '../../dtos';
import { User } from '../../entities/User';
import { IUsersRepository } from '../IUsersRepository';

export class UsersRepository implements IUsersRepository {
  private repository: Repository<User>;

  constructor() {
    this.repository = getRepository(User);
  }

  async findUserWithGamesById({
    user_id,
  }: IFindUserWithGamesDTO): Promise<User> {
    const user = await this.repository.findOne(user_id, { relations: ['games'] });

    if (!user) {
      throw new Error("User not exists")
    }

    return user;
  }

  async findAllUsersOrderedByFirstName(): Promise<User[]> {
    const query = `
      SELECT 
        id, 
        first_name, 
        last_name, 
        email, 
        created_at, 
        updated_at 
      FROM 
        users 
      ORDER BY 
        first_name
      `
    ;

    return this.repository.query(query);
  }

  async findUserByFullName({
    first_name,
    last_name,
  }: IFindUserByFullNameDTO): Promise<User[] | undefined> {
    const query = `
      SELECT
        email,
        first_name,
        last_name
      FROM
        users
      WHERE
        LOWER(first_name) = LOWER($1)
      AND
        LOWER(last_name) = LOWER($2)
      `
    ;

    return this.repository.query(query, [first_name, last_name]);
  }
}
