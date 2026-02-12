import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags, } from '@nestjs/swagger';
import { Body, Controller, Get, HttpCode, HttpStatus, Post, Query, } from '@nestjs/common';

import { Role } from '@/shared/enums/role.enum';
import { Roles } from '@/shared/decorators/roles.decorator';
import { UserId } from '@/shared/decorators/user-id.decorator';
import { HttpResponse } from '@/shared/dto/common/http-response.dto';
import { ApiResponseWithType } from '@/shared/decorators/api-response.decorator';

import { GetWalletQuery, GetWalletTransactionsQuery } from '@/modules/wallet/application/queries';
import { AddMoneyToWalletCommand, ValidateWalletBalanceCommand } from '@/modules/wallet/application/commands';

import { AddMoneyDto } from '../dto/request/add-money.dto';
import { WalletResponseDto } from '../dto/response/wallet-response.dto';
import { GetTransactionsDto } from '../dto/request/get-transactions.dto';
import { ValidateBalanceDto } from '../dto/request/validate-balance.dto';
import { AddMoneyResponseDto } from '../dto/response/add-money-response.dto';
import { ValidateBalanceResponseDto } from '../dto/response/validate-balance-response.dto';
import { WalletTransactionsResponseDto } from '@/modules/wallet/interfaces/http/dto/response';

/**
 * WalletController
 * Handles wallet operations with CQRS pattern
 * Routes:
 * - GET /wallet - Get wallet information
 * - GET /wallet/transactions - Get wallet transaction history
 * - POST /wallet/add-money - Add money to wallet
 * - POST /wallet/validate-balance - Validate wallet balance for an amount
 */
@ApiTags('Wallet')
@ApiBearerAuth()
@Controller('wallet')
@Roles(Role.CUSTOMER)
export class WalletController {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus,
  ) {}

  /**
   * Get wallet information
   */
  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get wallet',
    description:
      'Retrieves wallet information for the authenticated customer. Creates wallet if not exists.',
  })
  @ApiResponseWithType(
    {
      status: HttpStatus.OK,
      description: 'Wallet retrieved successfully',
    },
    WalletResponseDto,
  )
  async getWallet(
    @UserId() userId: string,
  ): Promise<HttpResponse<WalletResponseDto>> {
    const query = new GetWalletQuery(userId);
    const wallet = await this.queryBus.execute(query);

    return {
      message: 'Wallet retrieved successfully',
      data: wallet,
    };
  }

  /**
   * Get wallet transactions
   */
  @Get('transactions')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get wallet transactions',
    description:
      'Retrieves transaction history for the wallet with pagination.',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Wallet not found',
  })
  @ApiResponseWithType(
    {
      status: HttpStatus.OK,
      description: 'Transactions retrieved successfully',
    },
    WalletTransactionsResponseDto,
  )
  async getTransactions(
    @UserId() userId: string,
    @Query() dto: GetTransactionsDto,
  ): Promise<HttpResponse<WalletTransactionsResponseDto>> {
    const query = new GetWalletTransactionsQuery(
      userId,
      dto.limit || 20,
      dto.offset || 0,
    );
    const result = await this.queryBus.execute(query);

    return {
      message: 'Transactions retrieved successfully',
      data: result,
    };
  }

  /**
   * Add money to wallet
   */
  @Post('add-money')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Add money to wallet',
    description: 'Adds funds to the customer wallet.',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid amount or wallet inactive',
  })
  @ApiResponseWithType(
    {
      status: HttpStatus.CREATED,
      description: 'Money added successfully',
    },
    AddMoneyResponseDto,
  )
  async addMoney(
    @UserId() userId: string,
    @Body() dto: AddMoneyDto,
  ): Promise<HttpResponse<AddMoneyResponseDto>> {
    const command = new AddMoneyToWalletCommand(
      userId,
      dto.amount,
      dto.description,
      dto.reference,
    );
    const result = await this.commandBus.execute(command);

    return {
      message: 'Money added to wallet successfully',
      data: result,
    };
  }

  /**
   * Validate wallet balance
   */
  @Post('validate-balance')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Validate wallet balance',
    description:
      'Checks if wallet has sufficient balance for the given amount.',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid amount or wallet inactive',
  })
  @ApiResponseWithType(
    {
      status: HttpStatus.OK,
      description: 'Balance validation completed',
    },
    ValidateBalanceResponseDto,
  )
  async validateBalance(
    @UserId() userId: string,
    @Body() dto: ValidateBalanceDto,
  ): Promise<HttpResponse<ValidateBalanceResponseDto>> {
    const command = new ValidateWalletBalanceCommand(userId, dto.amount);
    const result = await this.commandBus.execute(command);

    return {
      message: result.isValid
        ? 'Sufficient wallet balance'
        : 'Insufficient wallet balance',
      data: result,
    };
  }
}
