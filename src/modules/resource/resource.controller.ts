import { Body, Controller, Post } from '@nestjs/common';
import { ResourceService } from './resource.service';
import { CreateResourceDTO } from './dto/create-resource.dto';

@Controller('resource')
export class ResourceController {
  constructor(private readonly resourceService: ResourceService) { }

  @Post()
  create(@Body() body: CreateResourceDTO) {
    return this.resourceService.create(body);
  }
}
