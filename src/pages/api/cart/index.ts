import { NextApiRequest, NextApiResponse } from 'next'
import {
  addProduct,
  getProducts,
  removeAllProducts,
  removeProduct,
} from '../../../business/CartManager'
import { findProductsByIds } from '../../../business/ProductManager'
import { authorize } from '../../../business/SessionManager'
import { ICart } from '../../../DAO/documents/User'
import SortMethod from '../../../DAO/types/SortMethod'
import ApplicationError from '../../../utils/ApplicationError'
import dbConnect from '../../../utils/dbConnect'
import { Either } from '../../../utils/Either'
import defaultHandler from '../../_defaultHandler'

const handler = defaultHandler<NextApiRequest, NextApiResponse>()
  .use(async (req, res, next) => {
    try {
      await dbConnect()
    } catch (err) {
      const error = ApplicationError.INTERNAL_ERROR.setDetail(
        'The server is currently unable to complete the request.'
      ).setInstance('/cart')

      res.status(error.status).json(error.toObject())
    }

    const authorized = await authorize(req, res)
    authorized.applyOnLeft((error) => {
      res.status(error.status).json(error.toObject())
    })
    authorized.applyOnRight(({ user, token }) => {
      req['user'] = user
      next()
    })
  })
  .get(async (req, res) => {
    const result = await getProducts(req['user'].id)
    if (result.isRight()) {
      const productsResult = await findProductsByIds(
        result.value.map(({ productId }) => productId),
        req['user'].id,
        1,
        result.value.length > 0 ? result.value.length : 1,
        SortMethod.nameAsc
      )
      if (productsResult.isRight()) {
        res.status(200).json(
          productsResult.value.results.map((product) =>
            Object.assign(product, {
              quantity: result.value.find(
                (prod) => prod.productId === product.id
              ).quantity,
            })
          )
        )
      } else {
        res
          .status(productsResult.value.status)
          .json(productsResult.value.toObject())
      }
    } else {
      res.status(result.value.status).json(result.value.toObject())
    }
  })
  .put(async (req, res) => {
    const result = await addProduct(
      req['user'].id,
      req.body.productId,
      req.body.quantity,
      req.query.setAddQuantity === 'true'
    )

    if (result.isRight()) {
      res.status(201).json(result.value)
    } else {
      res.status(result.value.status).json(result.value.toObject())
    }
  })
  .delete(async (req, res) => {
    let result: Either<ApplicationError, ICart[]>
    if (req.query.productId as string) {
      result = await removeProduct(
        req['user'].id,
        req.query.productId as string
      )
    } else {
      result = await removeAllProducts(req['user'].id)
    }

    if (result.isRight()) {
      res.status(204).end()
    } else {
      res.status(result.value.status).json(result.value.toObject())
    }
  })

export default handler
