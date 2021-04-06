import { getRepository, Repository } from 'typeorm';

import { User } from '../../../users/entities/User';
import { Game } from '../../entities/Game';

import { IGamesRepository } from '../IGamesRepository';

export class GamesRepository implements IGamesRepository {
  private repository: Repository<Game>;

  constructor() {
    this.repository = getRepository(Game);
  }

  async findByTitleContaining(param: string): Promise<Game[]> {
    return this.repository
      .createQueryBuilder('game')
      .select('game.title')
      .where('LOWER(game.title) LIKE LOWER(:title)', {title: `%${param}%`})
      .getMany();
  }

  async countAllGames(): Promise<[{ count: string }]> {
    const query = `
      SELECT 
        COUNT(id)
      FROM
        games
      `
    ;

    return this.repository.query(query);
  }

  async findUsersByGameId(id: string): Promise<User[]> {
    const game = await this.repository
      .createQueryBuilder("game")
      .innerJoinAndSelect('game.users', 'user')
      .where('game.id = :id', { id })
      .getOne();

    return game?.users || [];
  }
}
