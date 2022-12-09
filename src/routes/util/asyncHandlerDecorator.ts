import { Request, Response, NextFunction } from 'express'

/**
 * It takes a function as an argument, and returns a function that takes a request, response, and next
 * function as arguments, and returns a promise that resolves the original function, and catches any
 * errors that occur
 * @param {Function} fn - Function - the function that we want to wrap in the asyncHandlerDecorator
 */
const asyncHandlerDecorator = (fn: Function) => (req: Request, res: Response, next: NextFunction) => {
  Promise
    .resolve(fn(req, res, next))
    .catch(next)
}

export default asyncHandlerDecorator