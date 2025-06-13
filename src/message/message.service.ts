import { Injectable } from '@nestjs/common';
import { Message } from './entities/message.entity';
import { IMessagePayload } from './message.controller';

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

  findAll() {
    return this.msg;
  }

  findOne(id: string) {
    return this.msg.find((item) => item.id === +id);
  }

  create(payload: IMessagePayload) {
    this.lastId++;
    const id = this.lastId;
    const newMsg = {
      id,
      ...payload,
    };

    this.msg.push(newMsg);

    return newMsg;
  }

  update(id: string, payload: Partial<IMessagePayload>) {
    const msgIndex = this.msg.findIndex((item) => item.id === +id);

    if (msgIndex >= 0) {
      const msgToUpdate = this.msg[msgIndex];

      const newMsg = {
        ...msgToUpdate,
        ...payload,
      };

      this.msg[msgIndex] = newMsg;

      return newMsg;
    }

    return `could not find the id: ${id}`;
  }

  remove(id: string) {
    const msgIndex = this.msg.findIndex((item) => item.id === +id);

    if (msgIndex >= 0) {
      this.msg.splice(msgIndex, 1);

      return 'message removed successfully!';
    }

    return `could not find the id: ${id}`;
  }
}
