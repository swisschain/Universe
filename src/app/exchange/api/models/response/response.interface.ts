import { Error } from './error.interface'

export interface Response<T> {
    payload: T;
    error: Error
}
