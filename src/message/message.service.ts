import { Injectable, NotFoundException } from '@nestjs/common';
import { Message } from './entities/message.entity';
import { CreateMessageDTO } from './dto/create-message.dto';
import { UpdateMessageDTO } from './dto/update-message.dto';

@Injectable()
export class MessageService {
  private lastId = 1;
  private msg: Message[] = [
    {
      id: 1,
      to: 'kelsier',
      from: 'percy',
      text: 'this is my first message',
      read: false,
      date: new Date(),
    },
  ];

  throwNotFoundError() {
    throw new NotFoundException('Message not found');
  }

  findAll() {
    return this.msg;
  }

  findOne(id: string) {
    const msg = this.msg.find((item) => item.id === +id);

    if (!msg) this.throwNotFoundError();

    return msg;
  }

  create(payload: CreateMessageDTO) {
    this.lastId++;

    const id = this.lastId;
    const newMsg = {
      id,
      read: false,
      date: new Date(),
      ...payload,
    };

    this.msg.push(newMsg);

    return newMsg;
  }

  update(id: number, payload: UpdateMessageDTO) {
    const msgIndex = this.msg.findIndex((item) => item.id === id);

    if (msgIndex < 0) this.throwNotFoundError();

    const msgToUpdate = this.msg[msgIndex];
    const newMsg = {
      ...msgToUpdate,
      ...payload,
    };

    this.msg[msgIndex] = newMsg;

    return newMsg;
  }

  remove(id: number) {
    const msgIndex = this.msg.findIndex((item) => item.id === id);

    if (msgIndex < 0) this.throwNotFoundError();

    const msgToBeRemoved = this.msg[msgIndex];

    this.msg.splice(msgIndex, 1);

    return msgToBeRemoved;
  }
}
