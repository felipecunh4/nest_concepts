import { HashingService } from './hashing.service';
import * as bcrypt from 'bcryptjs';

export class BcryptService extends HashingService {
  async hash(password: string): Promise<string> {
    const salt = await bcrypt.genSalt();

    return bcrypt.hash(password, salt); // gera um hash pra salvar no banco
  }

  async compare(password: string, passwordHash: string): Promise<boolean> {
    // valida se a senha recebida é a mesma que foi salva
    return bcrypt.compare(password, passwordHash);
  }
}
