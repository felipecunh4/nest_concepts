import { validate } from 'class-validator';
import { CreateUserDto } from './create-user.dto';
import { ERoutePolicies } from 'src/auth/enums/route-policies.enum';

describe('CreateUserDto', () => {
  it('should validate a valid DTO', async () => {
    const dto = new CreateUserDto();
    dto.email = 'test@example.com';
    dto.password = 'Aa1!b';
    dto.name = 'name test';
    dto.roles = [ERoutePolicies.admin];

    const errors = await validate(dto);
    expect(errors.length).toBe(0); // Nenhum erro significa que o DTO é válido
  });

  it('should fail if email is invalid', async () => {
    const dto = new CreateUserDto();
    dto.email = 'invalid-email';
    dto.password = 'Aa1!b';
    dto.name = 'name test';
    dto.roles = [ERoutePolicies.admin];

    const errors = await validate(dto);

    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('email');
  });

  it('should fail if password is too short', async () => {
    const dto = new CreateUserDto();
    dto.email = 'test@example.com';
    dto.password = '123';
    dto.name = 'name test';
    dto.roles = [ERoutePolicies.admin];

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('password');
  });

  it('should fail if name is empty', async () => {
    const dto = new CreateUserDto();
    dto.email = 'test@example.com';
    dto.password = 'Aa1!b';
    dto.name = '';
    dto.roles = [ERoutePolicies.admin];

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('name');
  });

  it('should fail if name is too large', async () => {
    const dto = new CreateUserDto();
    dto.email = 'test@example.com';
    dto.password = 'Aa1!b';
    dto.name = 'a'.repeat(101);
    dto.roles = [ERoutePolicies.admin];

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('name');
  });
});
