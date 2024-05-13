import { ICreateAccountUseCase } from '@/domain/usecases/account/create-account-usecase.interface';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  Param,
  ParseIntPipe,
  Post,
  Put,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { AccountCreateInputDTO, AccountOutputDTO, AccountUpdateInputDTO } from '../dtos/account.dto';
import { IUpdateAccountUseCase } from '@/domain/usecases/account/update-account-usecase.interface';
import { IDeleteAccountUseCase } from '@/domain/usecases/account/delete-account-usecase.interface';
import { IGetAccountUseCase } from '@/domain/usecases/account/get-account-usecase.interface';
import { GetAccountUseCase } from '@/app/usecases/account/get-account.usecase';
import { CreateAccountUseCase } from '@/app/usecases/account/create-account.usecase';
import { UpdateAccountUseCase } from '@/app/usecases/account/update-account.usecase';
import { DeleteAccountUseCase } from '@/app/usecases/account/delete-account.usecase';

@ApiTags('Account')
@Controller('account')
export class AccountController {
  constructor(
    @Inject(GetAccountUseCase.name)
    private readonly getAccountUseCase: IGetAccountUseCase,
    @Inject(CreateAccountUseCase.name)
    private readonly createAccountUseCase: ICreateAccountUseCase,
    @Inject(UpdateAccountUseCase.name)
    private readonly updateAccountUseCase: IUpdateAccountUseCase,
    @Inject(DeleteAccountUseCase.name)
    private readonly deleteAccountUseCase: IDeleteAccountUseCase,
  ) {}

  @Get(':id')
  @ApiOperation({
    summary: 'View Account by ID',
  })
  @ApiNotFoundResponse({
    description: 'Account not found',
  })
  async get(@Param('id', ParseIntPipe) id: number): Promise<AccountOutputDTO> {
    return this.getAccountUseCase.execute(id);
  }

  @Post()
  @ApiOperation({
    summary: 'Create a Account',
  })
  @ApiNoContentResponse({
    description: 'Account created',
  })
  @ApiBadRequestResponse({
    description: 'Account already exists!',
  })
  async create(@Body() { name, document }: AccountCreateInputDTO): Promise<AccountOutputDTO> {
    return this.createAccountUseCase.execute({ name, document });
  }

  @Put(':id')
  @ApiOperation({
    summary: 'Update a Account',
  })
  @ApiNotFoundResponse({
    description: 'Account not found',
  })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() { name }: AccountUpdateInputDTO,
  ): Promise<AccountOutputDTO> {
    return this.updateAccountUseCase.execute(id, { name });
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Delete a Account',
  })
  @ApiNotFoundResponse({
    description: 'Account not found',
  })
  @ApiNoContentResponse({
    description: 'Account deleted',
  })
  async delete(@Param('id', ParseIntPipe) id: number): Promise<void> {
    await this.deleteAccountUseCase.execute(id);
  }
}
