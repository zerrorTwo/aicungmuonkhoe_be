import { HttpStatus } from '@nestjs/common';
import { SuccessResponse } from 'src/interfaces/response.interface';

export const Builder = <T>() => new ResponseBuilder<T>();

export class ResponseBuilder<T> {
  private _data: T;
  private _message: string;
  private _status: number = HttpStatus.OK;

  data(data: T): this {
    this._data = data;
    return this;
  }

  message(message: string): this {
    this._message = message;
    return this;
  }

  status(status: number): this {
    this._status = status;
    return this;
  }

  build(): SuccessResponse<T> {
    return {
      data: this._data,
      message: this._message,
      status: this._status,
    };
  }
}
