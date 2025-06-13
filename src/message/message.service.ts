import { Injectable, NotFoundException } from '@nestjs/common';
import { Message } from './entities/message.entity';
import { CreateMessageDTO } from './dto/create-message.dto';
import { UpdateMessageDTO } from './dto/update-message.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class MessageService {
  constructor(
    @InjectRepository(Message)
    private readonly messageRepository: Repository<Message>,
    private readonly usersService: UsersService,
  ) {}

  throwNotFoundError() {
    throw new NotFoundException('Message not found');
  }

  async findAll() {
    const msg = this.messageRepository.find({
      relations: ['to', 'from'],
      order: {
        id: 'desc',
      },
      select: {
        to: {
          id: true,
          name: true,
        },
        from: {
          id: true,
          name: true,
        },
      },
    });

    return msg;
  }

  async findOne(id: number) {
    const msg = await this.messageRepository.findOne({
      where: {
        id,
      },
      relations: ['to', 'from'],
      order: {
        id: 'desc',
      },
      select: {
        to: {
          id: true,
          name: true,
        },
        from: {
          id: true,
          name: true,
        },
      },
    });

    if (!msg) this.throwNotFoundError();

    return msg!;
  }

  async create(payload: CreateMessageDTO) {
    const from = await this.usersService.findOne(payload.fromId);
    const to = await this.usersService.findOne(payload.toId);

    const msgData = {
      text: payload.text,
      from: from,
      to: to,
      read: false,
      date: new Date(),
    };

    const newMsg = this.messageRepository.create(msgData);

    await this.messageRepository.save(newMsg);
    return {
      ...msgData,
      from: {
        id: msgData.from.id,
        name: msgData.from.name,
      },
      to: {
        id: msgData.to.id,
        name: msgData.to.name,
      },
    };
  }

  async update(id: number, payload: UpdateMessageDTO) {
    const msg = await this.findOne(id);

    msg.text = payload?.text ?? msg.text;
    msg.read = payload?.read ?? msg.read;
    await this.messageRepository.save(msg);

    return msg;
  }

  async remove(id: number) {
    const msgToBeRemoved = await this.messageRepository.findOneBy({ id });

    if (!msgToBeRemoved) this.throwNotFoundError();

    return await this.messageRepository.remove(msgToBeRemoved!);
  }
}
