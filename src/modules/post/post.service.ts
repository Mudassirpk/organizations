import { Injectable } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PrismaService } from 'src/shared/prisma/prisma.service';

@Injectable()
export class PostService {

  constructor(private readonly prisma: PrismaService) { }

  async create(createPostDto: CreatePostDto) {
    const user = await this.prisma.user.findUnique({
      where: { id: createPostDto.authorId }, include: {
        permissions: {
          where: {
            permission: {
              action: {
                name: "CREATE"
              },
              resource: "POST"
            },

          }, include: {
            permission: {
              include: {
                organization: true,
                action: true
              }
            }
          },
        },
        user_organization: {
          include: {
            organization: true
          }
        }
      }
    });

    console.table(JSON.stringify(user))

    const has_organizational_permission = user.user_organization.find(organization => {
      return user.permissions.find(p => {
        return p.permission.organization.id === organization.organizationId
      })
    })

    const has_action_permission = user.permissions.find(p => p.permission.resource === 'POST' && p.permission.action.name === 'CREATE')

    if (!has_organizational_permission) {
      return "You are not allowed to create post on this organization"
    }

    if (!has_action_permission) return 'You are not allowed to create post'

    return await this.prisma.post.create({
      data: {
        title: createPostDto.title,
        description: createPostDto.description,
        author: {
          connect: { id: createPostDto.authorId }
        }
      }
    })
  }

  findAll() {
    return `This action returns all post`;
  }

  findOne(id: number) {
    return `This action returns a #${id} post`;
  }

  update(id: number, updatePostDto: UpdatePostDto) {
    return `This action updates a #${id} post`;
  }

  remove(id: number) {
    return `This action removes a #${id} post`;
  }
}
