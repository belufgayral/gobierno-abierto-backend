import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import { ResponseUserDto } from './dto/response-user.dto';
import { CreateManagedUserDto } from 'src/auth/dto/create-managed-user.dto';
import { UserRole } from './enums/user-role.enum';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(user: CreateUserDto): Promise<User> {
    const exist = await this.userRepository.findOne({
      where: [{ email: user.email }],
    });

    if (exist) throw new ForbiddenException('Ya existe un usuario con ese correo.');

    const SALT = await bcrypt.genSalt(10);
    const password = await bcrypt.hash(user.password, SALT);

    const new_user = this.userRepository.create({
      ...user,
      password: password,
      role: UserRole.ADMIN,
    });

    return this.userRepository.save(new_user);
  }

  async createManagedUser(dto: CreateManagedUserDto): Promise<User> {
    const exist = await this.userRepository.findOne({
      where: [{ email: dto.email }],
    });
    if (exist) {
      throw new ForbiddenException('Ya existe un usuario con ese correo.');
    }

    const SALT = await bcrypt.genSalt(10);
    const password = await bcrypt.hash(dto.password, SALT);
    const role =
      dto.role === UserRole.SUPER_ADMIN ? UserRole.SUPER_ADMIN : UserRole.ADMIN;

    const new_user = this.userRepository.create({
      name: dto.name,
      surname: dto.surname,
      email: dto.email,
      password,
      role,
    });

    return this.userRepository.save(new_user);
  }

  async getUserByEmail(email: string) {
    const user = await this.userRepository.findOne({
      where: [{ email }],
      select: ['id', 'email', 'password', 'role', 'name'],
    });
    if (!user)
      throw new ConflictException(
        'No existe un usuario con ese correo electrónico.',
      );
    return user;
  }

  async findAll() {
    const user = await this.userRepository.find();
    return user;
  }

  /** Listado sin contraseña (panel super admin). */
  async findAllPublic(): Promise<
    Pick<User, 'id' | 'name' | 'surname' | 'email' | 'role'>[]
  > {
    return this.userRepository.find({
      select: ['id', 'name', 'surname', 'email', 'role'],
      order: { email: 'ASC' },
    });
  }

  async findOne(id: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: [{ id }],
    });
    if (!user) {
      throw new NotFoundException('Usuario no encontrado.');
    }
    return user;
  }

  async updatePasswordByUserId(userId: string, plainPassword: string) {
    const user = await this.findOne(userId);
    const SALT = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(plainPassword, SALT);
    await this.userRepository.save(user);
  }

  remove(id: string) {
    return `This action removes a #${id} user`;
  }
}
