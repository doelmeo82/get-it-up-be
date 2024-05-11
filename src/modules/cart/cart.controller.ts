import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { BaseApiResponse } from 'src/shared/dtos';
import { ReqUser } from '../../common';
import { RequestContext } from '../../shared/request-context/request-context.dto';
import { CartService } from './cart.service';
import { CreateCartDto } from './dto';
import { SummaryCartOutput } from './dto/cart-output.dto';

@Controller('')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Post('/add-to-cart')
  @UseInterceptors(ClassSerializerInterceptor)
  async addToCart(
    @ReqUser() ctx: RequestContext,
    @Body() data: CreateCartDto,
  ): Promise<BaseApiResponse<null>> {
    return this.cartService.addToCart(ctx.user.id, data);
  }

  @Get('/my-cart')
  @UseInterceptors(ClassSerializerInterceptor)
  async getMyCart(
    @ReqUser() ctx: RequestContext,
  ): Promise<BaseApiResponse<SummaryCartOutput>> {
    return this.cartService.getMyCart(ctx.user.id);
  }

  @Delete('/:id')
  @UseInterceptors(ClassSerializerInterceptor)
  async removeCart(
    @Param('id') id: number,
    @ReqUser() ctx: RequestContext,
  ): Promise<BaseApiResponse<null>> {
    return this.cartService.removeCart(id, ctx.user.id);
  }
}
