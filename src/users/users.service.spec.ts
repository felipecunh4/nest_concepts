/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { HashingService } from 'src/auth/hashing/hashing.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { ERoutePolicies } from 'src/auth/enums/route-policies.enum';
import {
  ConflictException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';

describe('UsersService', () => {
  let usersService: UsersService;
  let userRepository: Repository<User>;
  let hashingService: HashingService;

  // roda antes de cada teste
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: {
            save: jest.fn(),
            create: jest.fn(),
            findOneBy: jest.fn(),
            find: jest.fn(),
            preload: jest.fn(),
            remove: jest.fn(),
          },
        },
        {
          provide: HashingService,
          useValue: {
            hash: jest.fn(),
          },
        },
      ],
    }).compile();

    usersService = module.get(UsersService);
    userRepository = module.get(getRepositoryToken(User));
    hashingService = module.get(HashingService);
  });

  it('userService should be defined', () => {
    // Padrão AAA
    // Configurar - Arrange
    // Fazer alguma ação - Act
    // Conferir se a ação foi a esperada - Assert

    expect(usersService).toBeDefined();
  });

  describe('create', () => {
    it('should create a new user', async () => {
      // Preciso testar:
      // declara -> CreateUserDto
      // que o hashingService tenha o método hash
      // saber se o hashingService foi chamado com o CreateUserDTO
      // saber se o userRepository.create foi chamado com os dados do usuario
      // saber se o userRepository.save foi chamado com o user criado
      // o returno final deve ser o novo user criado -> expect

      // Arrange
      const createUserDTO: CreateUserDto = {
        email: 'mytest@test.com',
        name: 'user test',
        password: 'Aab1@',
        roles: [ERoutePolicies.admin],
      };
      const hashResolvedValue = 'hashResolvedValue';
      const newUser = {
        id: 1,
        name: createUserDTO.name,
        email: createUserDTO.email,
        roles: createUserDTO.roles,
        passwordHash: hashResolvedValue,
      };

      // Como o valor retornado por hashingService.hash é necessário
      // -> Devemos simular o valor
      // mockResolvedValue -> usado quando o retorno é uma promise -> await
      jest.spyOn(hashingService, 'hash').mockResolvedValue(hashResolvedValue);

      // Como o user retornado por userRepository.create é necessário em
      // pessoaRepository.save -> Devemos simular o valor
      // mockReturnValue -> usado quando o retorno é um valor definido
      jest.spyOn(userRepository, 'create').mockReturnValue(newUser as any);

      jest.spyOn(userRepository, 'save').mockReturnValue(newUser as any);

      // Act -> ação
      const result = await usersService.create(createUserDTO);

      // Assert
      // O método hashingService.hash foi chamado com createUserDTO.password ?
      expect(hashingService.hash).toHaveBeenCalledWith(createUserDTO.password);

      // O método userRepository.create foi chamado com os dados do novo
      // user com o hash de senha gerado por hashingService.hash ?
      expect(userRepository.create).toHaveBeenCalledWith({
        passwordHash: hashResolvedValue,
        ...createUserDTO,
      });

      // O método userRepository.save foi chamado com os dados do novo
      // user gerado por pessoaRepository.create ?
      expect(userRepository.save).toHaveBeenCalledWith(newUser);

      // O resultado do método usersService.create retornou a nova
      // pessoa criada?
      expect(result).toEqual(newUser);
    });

    it('should throw ConflictException when email already exists', async () => {
      jest.spyOn(userRepository, 'save').mockRejectedValue({ code: '23505' });

      await expect(usersService.create({} as CreateUserDto)).rejects.toThrow(
        ConflictException,
      );
    });

    it('should throw generic error', async () => {
      const genericErrorMsg = 'Generic Error';

      jest
        .spyOn(userRepository, 'save')
        .mockRejectedValue(new Error(genericErrorMsg));

      await expect(usersService.create({} as CreateUserDto)).rejects.toThrow(
        new Error(genericErrorMsg),
      );
    });
  });

  describe('findOne', () => {
    it('should return user if user is found', async () => {
      const userId = 1;
      const userToBeReturned = {
        email: 'mytest@test.com',
        name: 'user test',
        passwordHash: 'Aab1@',
        roles: [ERoutePolicies.admin],
      };

      jest
        .spyOn(userRepository, 'findOneBy')
        .mockResolvedValue(userToBeReturned as any);

      const result = await usersService.findOne(userId);

      expect(result).toEqual(userToBeReturned);
    });

    it('should throw NotFoundException when user does not exist', async () => {
      const userId = 1;

      jest
        .spyOn(userRepository, 'findOneBy')
        .mockResolvedValue(undefined as any);

      await expect(usersService.findOne(userId)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('findAll', () => {
    it('should return all users', async () => {
      const users: User[] = [];

      jest.spyOn(userRepository, 'find').mockResolvedValue(users);

      const result = await usersService.findAll();

      expect(result).toEqual(result);
      expect(userRepository.find).toHaveBeenCalledWith({
        order: {
          id: 'desc',
        },
      });
    });
  });

  describe('update', () => {
    it('should update an user if authorized', async () => {
      const userId = 1;
      const passwordHash = 'passwordHash';
      const userToBeUpdated: UpdateUserDto = {
        email: 'mytest@test.com',
        name: 'user test',
        password: 'Aab1@',
      };
      const userUpdated = {
        id: userId,
        email: 'mytest@test.com',
        name: 'user test',
        passwordHash,
      };
      const tokenPayload = {
        sub: userId,
      };

      jest.spyOn(hashingService, 'hash').mockResolvedValue(passwordHash);
      jest
        .spyOn(userRepository, 'preload')
        .mockResolvedValue(userUpdated as any);
      jest.spyOn(userRepository, 'save').mockResolvedValue(userUpdated as any);

      const result = await usersService.update(
        userId,
        userToBeUpdated,
        tokenPayload as any,
      );

      expect(hashingService.hash).toHaveBeenCalledWith(
        userToBeUpdated.password,
      );
      expect(userRepository.preload).toHaveBeenCalledWith({
        id: userId,
        name: userToBeUpdated.name,
        passwordHash,
      });
      expect(userRepository.save).toHaveBeenCalledWith(userUpdated);
      expect(result).toEqual(userUpdated);
    });

    it('should throw NotFoundException when user not found', async () => {
      const userId = 1;
      const userToBeUpdated: UpdateUserDto = {
        name: 'user test',
      };
      const tokenPayload = {
        sub: userId,
      };

      jest.spyOn(userRepository, 'preload').mockResolvedValue(undefined);

      await expect(
        usersService.update(userId, userToBeUpdated, tokenPayload as any),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw ForbiddenException when user is not authorized', async () => {
      const userId = 1;
      const userToBeUpdated: UpdateUserDto = {
        name: 'user test',
      };
      const tokenPayload = {
        sub: 2,
      };
      const userUpdated = {
        id: userId,
        email: 'mytest@test.com',
        name: 'user test',
        passwordHash: 'myhashedpassword',
      };

      jest
        .spyOn(userRepository, 'preload')
        .mockResolvedValue(userUpdated as any);

      await expect(
        usersService.update(userId, userToBeUpdated, tokenPayload as any),
      ).rejects.toThrow(ForbiddenException);
    });
  });

  describe('delete', () => {
    it('should remove an user if authorized', async () => {
      const userId = 1;
      const tokenPayload = { sub: userId };
      const userToBeDeleted = { id: userId, name: 'user test' };

      jest
        .spyOn(usersService, 'findOne')
        .mockResolvedValue(userToBeDeleted as any);

      jest
        .spyOn(userRepository, 'remove')
        .mockResolvedValue(userToBeDeleted as any);

      const result = await usersService.remove(userId, tokenPayload as any);

      expect(usersService.findOne).toHaveBeenCalledWith(userId);
      expect(userRepository.remove).toHaveBeenCalledWith(userToBeDeleted);
      expect(result).toEqual(userToBeDeleted);
    });

    it('should throw ForbiddenException when user is not authorized', async () => {
      const userId = 1;
      const tokenPayload = { sub: 2 };
      const userToBeDeleted = { id: userId, name: 'user test' };

      jest
        .spyOn(usersService, 'findOne')
        .mockResolvedValue(userToBeDeleted as any);

      await expect(
        usersService.remove(userId, tokenPayload as any),
      ).rejects.toThrow(ForbiddenException);
    });
  });
});
