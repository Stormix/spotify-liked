import { Request, Response } from 'express'

export default (delay: number) => {
  return (req: Request, res: Response, next: () => unknown) => {
    setTimeout(next, delay)
  }
}
