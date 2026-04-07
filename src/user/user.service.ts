import { ConflictException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt'
import { ResponseUserDto } from './dto/response-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) { }

  async create(user: CreateUserDto): Promise<User> {
    const exist = await this.userRepository.findOne({
      where: [{ username: user.username }],
    });
    console.log("EXISTE?????---->", exist);
    if (exist) throw new ConflictException("Credenciales invalidas.")

    const SALT = await bcrypt.genSalt(10);
    const password = await bcrypt.hash(user.password, SALT);

    const new_user = this.userRepository.create({
      ...user,
      password: password
    });

    return this.userRepository.save(new_user);
  }

  async getUser(username: string) {
    const user = await this.userRepository.findOne({
      where: [{ username: username }],
      select: ['id', 'username', 'password']
    });
    if (!user) throw new ConflictException("Este username no corresponde a ningun usuario.");
    return user;
  }

  async findAll() {
    const user = await this.userRepository.find();
    return user;
  }

  async findOne(id: number): Promise<User> {
    const user = await this.userRepository.findOne({
      where: [{ id: id }]
    });
    if (!user) throw new ConflictException("Este id no corresponde a ningun usuario.");
    return user;
  }

  

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
