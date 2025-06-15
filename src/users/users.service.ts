/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { HashingService } from 'src/auth/hashing/hashing.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    private readonly hashingService: HashingService,
  ) {}

  throwNotFoundError() {
    throw new NotFoundException('User not found');
  }

  async create(payload: CreateUserDto) {
    try {
      const passwordHash = await this.hashingService.hash(payload.password);

      const newUser = this.usersRepository.create({
        passwordHash,
        ...payload,
      });

      return await this.usersRepository.save(newUser);
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException('E-mail já cadastrado');
      }

      throw error;
    }
  }

  async findAll() {
    return await this.usersRepository.find({
      order: {
        id: 'desc',
      },
    });
  }

  async findOne(id: number) {
    const user = await this.usersRepository.findOneBy({ id });

    if (!user) this.throwNotFoundError();

    return user!;
  }

  async update(id: number, payload: UpdateUserDto) {
    const userData = {
      name: payload?.name,
    };

    if (payload?.password) {
      const passwordHash = await this.hashingService.hash(payload.password);

      userData['passwordHash'] = passwordHash;
    }

    const userToBeUpdated = await this.usersRepository.preload({
      id,
      ...userData,
    });

    if (!userToBeUpdated) this.throwNotFoundError();

    await this.usersRepository.save(userToBeUpdated!);

    return userToBeUpdated;
  }

  async remove(id: number) {
    const user = await this.findOne(id);

    return await this.usersRepository.remove(user);
  }
}
