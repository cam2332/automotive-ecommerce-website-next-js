/* eslint-disable class-methods-use-this */
/* eslint-disable max-classes-per-file */
export type Either<L, R> = Left<L, R> | Right<L, R>

export class Left<L, R> {
  readonly value: L

  constructor(value: L) {
    this.value = value
  }

  isLeft(): this is Left<L, R> {
    return true
  }

  isRight(): this is Right<L, R> {
    return false
  }

  applyOnLeft<B>(func: (l: L) => B): Either<B, B> {
    return new Left(func(this.value))
  }

  applyOnRight<B>(_: (r: R) => B): Either<L, B> {
    return this as any
  }
}

export class Right<L, R> {
  readonly value: R

  constructor(value: R) {
    this.value = value
  }

  isLeft(): this is Left<L, R> {
    return false
  }

  isRight(): this is Right<L, R> {
    return true
  }

  applyOnLeft<B>(_: (l: L) => B): Either<R, B> {
    return this as any
  }

  applyOnRight<B>(func: (r: R) => B): Either<L, B> {
    return new Right(func(this.value))
  }
}

export const left = <L, R>(l: L): Either<L, R> => new Left<L, R>(l)

export const right = <L, R>(r: R): Either<L, R> => new Right<L, R>(r)
