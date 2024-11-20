import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ResourceService } from './resource.service';
import { CreateResourceDTO } from './dto/create-resource.dto';
import { UpdateResourceDTO } from './dto/update.dto';
import { AddAttributeDTO } from './dto/add-attribute.dto';
import { AuthGaurd } from 'src/guards/auth.guard';
import { PermissionGuard } from 'src/guards/permission.guard';
import { CreateResourceItemDTO } from './dto/create-resource-item.dto';
import { UpdateAttributeDTO } from './dto/update-attribute.dto';

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

  @Get('attribute/:id')
  getResourceAttributes(@Param('id') id: string) {
    return this.resourceService.getResourceAttributes(+id);
  }

  @UseGuards(AuthGaurd, PermissionGuard)
  @Put('attribute')
  updateAttribute(@Body() body: UpdateAttributeDTO) {
    return this.resourceService.updateAttribute(body);
  }

  @Get('by-id/:id')
  getById(
    @Param('id') id: number,
    @Query() query: { relations?: string; atoms?: string; attributes?: string },
  ) {
    return this.resourceService.getById(+id, {
      relations: query.relations === 'true',
      atoms: query.atoms === 'true',
      attributes: query.attributes === 'true',
    });
  }

  @Get(':organizationId')
  getByOrganization(
    @Param() { organizationId }: { organizationId: string },
    @Query() query: { relations?: string; atoms?: string; attributes?: string },
  ) {
    return this.resourceService.getByOrganization(parseInt(organizationId), {
      relations: query.relations === 'true',
      atoms: query.atoms === 'true',
      attributes: query.attributes === 'true',
    });
  }
}
