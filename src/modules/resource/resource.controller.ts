import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ResourceService } from './resource.service';
import { CreateResourceDTO } from './dto/create-resource.dto';
import { UpdateResourceDTO } from './dto/update.dto';
import { AddAttributeDTO } from './dto/add-attribute.dto';
import { AuthGaurd } from 'src/guards/auth.guard';
import { PermissionGuard } from 'src/guards/permission.guard';
import { CreateResourceItemDTO } from './dto/create-resource-item.dto';

@Controller('resource')
export class ResourceController {
  constructor(private readonly resourceService: ResourceService) {}

  @UseGuards(AuthGaurd, PermissionGuard)
  @Post()
  create(@Body() body: CreateResourceDTO) {
    return this.resourceService.create(body);
  }

  @Post('item')
  create_resource_item(@Body() body: CreateResourceItemDTO) {
    return this.resourceService.create_resource_item(body);
  }

  @Post('update')
  update(@Body() body: UpdateResourceDTO) {
    return this.resourceService.update(body);
  }

  @UseGuards(AuthGaurd, PermissionGuard)
  @Post('attribute')
  addAttribute(@Body() body: AddAttributeDTO) {
    return this.resourceService.addAttribute(body);
  }

  @Get(':organizationId')
  getByOrganization(@Param() { organizationId }: { organizationId: string }) {
    return this.resourceService.getByOrganization(parseInt(organizationId));
  }
}
