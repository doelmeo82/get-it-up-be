import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Post,
  Query,
  Res,
  UseInterceptors,
} from '@nestjs/common';
import { PaymentService } from '../providers/payment.service';
import { Public, ReqUser } from '../../common';
import { RequestContext } from '../../shared/request-context/request-context.dto';
import { CheckoutCartDto } from '../dto';
import { VnpayPaymentUrlDto } from '../dto/vnpay-payload.dto';
import { BaseApiResponse } from 'src/shared/dtos';
import { Response } from 'express';
import { VIEW_TEMPLATE, VNPAY_RESPONSE_CODE } from '../../common/constants';

@Controller('')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post('/checkout')
  @UseInterceptors(ClassSerializerInterceptor)
  async checkout(
    @ReqUser() ctx: RequestContext,
    @Body() data: CheckoutCartDto,
  ): Promise<BaseApiResponse<string>> {
    return this.paymentService.checkout(ctx, data);
  }

  @Get('/vnpay-return')
  @Public()
  async vnpayReturn(
    @Query() query: VnpayPaymentUrlDto,
    @Res() res: Response,
  ): Promise<void> {
    const transOutput = await this.paymentService.getPaymentStatus(query);
    const status = transOutput.status;
    switch (status) {
      case VNPAY_RESPONSE_CODE.CANCLE_TRANSACTION:
        return res.render(VIEW_TEMPLATE.CANCLE_TRANSACTION);

      case VNPAY_RESPONSE_CODE.TRANSACTION_SUCCESS:
        return res.render(VIEW_TEMPLATE.PAYMENT_SUCCESS, {
          courses: transOutput.courses,
        });
    }
  }

  @Get('/vnpay_ipn')
  @Public()
  webHook(@Query() query: VnpayPaymentUrlDto): Promise<void> {
    return this.paymentService.webHook(query);
  }
}
