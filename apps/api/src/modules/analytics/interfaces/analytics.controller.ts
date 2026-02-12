import { QueryBus } from '@nestjs/cqrs';
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { Controller, Get, HttpStatus, Query } from '@nestjs/common';

import {
  AdminDashboardResponseDto,
  SalesReportItemDto,
  SellerDashboardResponseDto,
} from './dto';
import { Role } from '@/shared/enums/role.enum';
import { Roles } from '@/shared/decorators/roles.decorator';
import { UserId } from '@/shared/decorators/user-id.decorator';
import { PrismaService } from '@/shared/prisma/prisma.service';
import { ApiResponseWithType } from '@/shared/decorators/api-response.decorator';
import { GetSalesReportQuery } from '../application/queries/get-sales-report/get-sales-report.query';
import { GetAdminDashboardQuery } from '../application/queries/get-admin-dashboard/get-admin-dashboard.query';
import { GetSellerDashboardQuery } from '../application/queries/get-seller-dashboard/get-seller-dashboard.query';

@ApiTags('Analytics')
@Controller('analytics')
export class AnalyticsController {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly prisma: PrismaService,
  ) {}

  @Get('sales-report')
  @Roles(Role.ADMIN, Role.SELLER)
  @ApiOperation({ summary: 'Get sales report with date filtering' })
  @ApiQuery({
    name: 'timeframe',
    required: true,
    enum: ['daily', 'weekly', 'monthly', 'yearly'],
    description: 'Timeframe for grouping sales data',
  })
  @ApiQuery({
    name: 'startDate',
    required: true,
    type: String,
    description: 'Start date in YYYY-MM-DD format',
  })
  @ApiQuery({
    name: 'endDate',
    required: true,
    type: String,
    description: 'End date in YYYY-MM-DD format',
  })
  @ApiResponseWithType(
    {
      status: HttpStatus.OK,
      isArray: true,
      description: 'Sales report data',
    },
    SalesReportItemDto,
  )
  async getSalesReport(
    @Query('timeframe') timeframe: string,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
    @UserId() userId: string,
  ): Promise<SalesReportItemDto[]> {
    // Get user role and seller profile if seller
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { sellerProfile: true },
    });

    let sellerProfileId: string | undefined;

    if (user?.role === 'SELLER' && user.sellerProfile) {
      sellerProfileId = user.sellerProfile.id;
    }

    return this.queryBus.execute(
      new GetSalesReportQuery(timeframe, startDate, endDate, sellerProfileId),
    );
  }

  @Get('admin-dashboard')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Get admin dashboard analytics' })
  @ApiResponseWithType(
    {
      status: HttpStatus.OK,
      description: 'Admin dashboard data',
    },
    AdminDashboardResponseDto,
  )
  async getAdminDashboard(): Promise<AdminDashboardResponseDto> {
    return this.queryBus.execute(new GetAdminDashboardQuery());
  }

  @Get('seller-dashboard')
  @Roles(Role.SELLER)
  @ApiOperation({ summary: 'Get seller dashboard analytics' })
  @ApiResponseWithType(
    {
      status: HttpStatus.OK,
      description: 'Seller dashboard data',
    },
    SellerDashboardResponseDto,
  )
  async getSellerDashboard(
    @UserId() userId: string,
  ): Promise<SellerDashboardResponseDto> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { sellerProfile: true },
    });

    if (!user) {
      throw new Error('User not found');
    }

    if (!user.sellerProfile) {
      throw new Error('Seller profile not found');
    }

    return this.queryBus.execute(
      new GetSellerDashboardQuery(user.sellerProfile.id),
    );
  }
}
