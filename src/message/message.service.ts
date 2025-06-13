import { Injectable, NotFoundException } from '@nestjs/common';
import { Message } from './entities/message.entity';
import { CreateMessageDTO } from './dto/create-message.dto';
import { UpdateMessageDTO } from './dto/update-message.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class MessageService {
  constructor(
    @InjectRepository(Message)
    private readonly messageRepository: Repository<Message>,
  ) {}

  throwNotFoundError() {
    throw new NotFoundException('Message not found');
  }

  async findAll() {
    const msg = this.messageRepository.find();

    return msg;
  }

  async findOne(id: number) {
    const msg = await this.messageRepository.findOne({
      where: {
        id,
      },
    });

    if (!msg) this.throwNotFoundError();

    return msg;
  }

  async create(payload: CreateMessageDTO) {
    const newMsg = {
      ...payload,
      read: false,
      date: new Date(),
    };

    return await this.messageRepository.save(newMsg);
  }

  async update(id: number, payload: UpdateMessageDTO) {
    const payloadToUpdate = {
      read: payload?.read,
      text: payload?.text,
    };
    const msgToBeUpdated = await this.messageRepository.preload({
      id,
      ...payloadToUpdate,
    });

    if (!msgToBeUpdated) this.throwNotFoundError();

    await this.messageRepository.save(msgToBeUpdated!);

    return msgToBeUpdated;
  }

  async remove(id: number) {
    const msgToBeRemoved = await this.messageRepository.findOneBy({ id });

    if (!msgToBeRemoved) this.throwNotFoundError();

    return await this.messageRepository.remove(msgToBeRemoved!);
  }
}
