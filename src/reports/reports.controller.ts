import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CreateReportDTO } from './dtos/create-report.dto';
import { ReportsService } from './reports.service';
import { AuthGuard } from 'src/guards/auth.guard';
import { CurrentUser } from 'src/users/decorators/current-user.decorator';
import { User } from 'src/users/user.entity';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { ReportDTO } from './dtos/report.dto';
import { ApproveReportDTO } from './dtos/approve-report.dto';
import { AdminGuard } from 'src/guards/admin.guard';
import { GetEstimateDTO } from './dtos/get-estimate.dto';

@Controller('reports')
export class ReportsController {
  constructor(private reportService: ReportsService) {}

  @Post()
  @UseGuards(AuthGuard)
  @Serialize(ReportDTO)
  createPost(@Body() body: CreateReportDTO, @CurrentUser() user: User) {
    return this.reportService.create(body, user);
  }

  @UseGuards(AdminGuard)
  @Patch(':id')
  approveReport(@Param('id') id: string, @Body() body: ApproveReportDTO) {
    return this.reportService.changeApproval(id, body.approved);
  }

  @Get()
  getEstimate(@Query() query: GetEstimateDTO) {
    return this.reportService.createEstimate(query);
  }
}
