import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import crypto from 'crypto';
import moment from 'moment';
import queryString from 'qs';
import { DeepPartial } from 'typeorm';
import { sortObject } from '../../shared/utils/object.util';
import { VnpayPaymentUrlDto } from '../dto/vnpay-payload.dto';
@Injectable()
export class VNPayService {
  constructor(private readonly configService: ConfigService) {}

  createPaymentUrl(
    ipAddr: string | undefined,
    orderId: number,
    total: number,
  ): string {
    const date = new Date();
    const createDate = moment(date).format('YYYYMMDDHHmmss');
    const secretKey = this.configService.get('vnp_hash_secrect');
    const vnpUrl = this.configService.get('vnp_url');

    let payload: DeepPartial<VnpayPaymentUrlDto> = {
      vnp_Version: this.configService.get('vnp_version') || '',
      vnp_Command: this.configService.get('vnp_command') || '',
      vnp_TmnCode: this.configService.get('vnp_tmncode') || '',
      vnp_Locale: this.configService.get('vnp_locale') || '',
      vnp_CurrCode: 'VND',
      vnp_TxnRef: orderId.toString(),
      vnp_OrderInfo: `Thanh toán cho Prime Edu mã GD: ${orderId}`,
      vnp_OrderType: 'other',
      vnp_Amount: total * 100,
      vnp_ReturnUrl: this.configService.get('vnp_return_url') || '',
      vnp_IpAddr: ipAddr,
      vnp_CreateDate: createDate,
    };

    payload = sortObject(payload);
    const signData = queryString.stringify(payload, { encode: false });
    const hmac = crypto.createHmac('sha512', secretKey);
    const signed = hmac.update(new Buffer(signData, 'utf-8')).digest('hex');
    payload.vnp_SecureHash = signed;

    const paymentUrl =
      vnpUrl + '?' + queryString.stringify(payload, { encode: false });
    return paymentUrl;
  }
}
