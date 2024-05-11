import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { AxiosRequestConfig } from 'axios';
import { firstValueFrom } from 'rxjs';
import { AxiosRequestYoutube } from '../dtos';
import { deleteKey } from '../utils/object.util';
@Injectable()
export class ApiService {
  constructor(private readonly httpService: HttpService) {}

  async get(domain: string, path: string, provinceId?: string): Promise<any> {
    path = provinceId ? `${path}/${provinceId}` : path;
    const axiosConfig: AxiosRequestConfig = {
      method: 'get',
      url: encodeURI(`${domain}${path}`),
      headers: {
        'Content-Type': 'application/json',
      },
    };
    return firstValueFrom(this.httpService.request(axiosConfig))
      .then((res) => res.data)
      .catch((e) => {
        Logger.error(e.message);
      });
  }

  async videoYoutube(
    domain: string,
    path: string,
    query: AxiosRequestYoutube,
  ): Promise<any> {
    const { key, part, maxResults, id, playlistId, videoId } = query;
    const params = {
      key,
      part,
      maxResults,
      id,
      playlistId,
      videoId,
    };
    deleteKey(params);
    const axiosConfig: AxiosRequestConfig = {
      method: 'get',
      url: domain + path,
      headers: {
        'Content-Type': 'application/json',
      },
      params,
    };
    return firstValueFrom(this.httpService.request(axiosConfig))
      .then((res) => res.data)
      .catch((e) => {
        Logger.error(e.message);
      });
  }
}
