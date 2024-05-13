import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { plainToInstance } from 'class-transformer';
import crypto from 'crypto';
import queryString from 'qs';
import { MESSAGES, VNPAY_MESSAGE } from '../../common/constants';
import { OrderService } from '../../modules/order/order.service';
import { BaseApiResponse } from '../../shared/dtos';
import { RequestContext } from '../../shared/request-context/request-context.dto';
import { sortObject } from '../../shared/utils/object.util';
import { CheckoutCartDto, TransactionOutput } from '../dto';
import { VnpayPaymentUrlDto } from '../dto/vnpay-payload.dto';
import { CourseOutput } from '@/src/modules/course/dto/course/course-output.dto';
@Injectable()
export class PaymentService {
  constructor(
    // private readonly cartService: CartService,
    private readonly orderService: OrderService,
    private readonly configService: ConfigService,
  ) {}

  async checkout(
    ctx: RequestContext,
    data: CheckoutCartDto,
  ): Promise<BaseApiResponse<string>> {
    const { items } = data;
    const totalPrice = items.reduce((total, current) => {
      total += current.price;
      return total;
    }, 0);
    await this.orderService.createOrder(ctx, data, totalPrice);

    return {
      error: false,
      data: `https://get-it-up.vercel.app/courses/${items[0].courseId}`,
      message: MESSAGES.GET_SUCCEED,
      code: 200,
    };
  }

  async getPaymentStatus(
    query: VnpayPaymentUrlDto,
  ): Promise<TransactionOutput> {
    const secureHash = query.vnp_SecureHash;
    const secretKey = this.configService.get('vnp_hash_secrect');
    delete query.vnp_SecureHash;
    delete query.vnp_SecureHashType;
    query = sortObject(query);
    const signData = queryString.stringify(query, { encode: false });
    const hmac = crypto.createHmac('sha512', secretKey);
    const signed = hmac.update(new Buffer(signData, 'utf-8')).digest('hex');

    // payment status
    const responseCode = query.vnp_ResponseCode;

    if (secureHash !== signed)
      return plainToInstance(TransactionOutput, {
        status: responseCode,
      });

    const orderId = +query.vnp_TxnRef;
    const order = await this.orderService.getOrderById(orderId);
    await this.orderService.test(orderId);
    const courses = order.data.orderDetails.reduce((accummulator, current) => {
      const coruse = current.course || current.cart?.course;
      return [...accummulator, coruse];
    }, [] as CourseOutput[]);
    return plainToInstance(
      TransactionOutput,
      {
        status: responseCode,
        courses,
      },
      { excludeExtraneousValues: true },
    );
  }

  async webHook(query: VnpayPaymentUrlDto): Promise<void> {
    const secureHash = query.vnp_SecureHash;
    const secretKey = this.configService.get('vnp_hash_secrect');
    delete query.vnp_SecureHash;
    delete query.vnp_SecureHashType;

    query = sortObject(query);
    const signData = queryString.stringify(query, { encode: false });
    const hmac = crypto.createHmac('sha512', secretKey);
    const signed = hmac.update(new Buffer(signData, 'utf-8')).digest('hex');

    if (signed !== secureHash)
      throw new HttpException(
        {
          error: true,
          data: null,
          message: VNPAY_MESSAGE.FAIL_CHECKSUM,
          code: 401,
        },
        HttpStatus.UNAUTHORIZED,
      );
    const responseCode = query.vnp_ResponseCode;
    const orderId = +query.vnp_TxnRef;
    const amount = query.vnp_Amount;
    const order = await this.orderService.getOrderById(orderId);

    if (!order.data || order.data.total > amount)
      throw new HttpException(
        {
          error: true,
          data: null,
          message: VNPAY_MESSAGE.WRONG_ORDER,
          code: 404,
        },
        HttpStatus.NOT_FOUND,
      );
    if (responseCode !== '00')
      throw new HttpException(
        {
          error: true,
          data: null,
          message: VNPAY_MESSAGE.TRANSACTION_FAIL,
          code: 402,
        },
        HttpStatus.PAYMENT_REQUIRED,
      );
    // update payment status
    await this.orderService.updatePaymentStatus(orderId);
  }
}
