import { NextApiRequest, NextApiResponse } from 'next'
import { findAll } from '../../../business/ProductManager'
import { authorize } from '../../../business/SessionManager'
import {
  addProduct,
  getProducts,
  removeAllProducts,
  removeProduct,
} from '../../../business/WishListManager'
import PageableBuilder from '../../../DAO/types/PageableBuilder'
import ProductCriteriaBuilder from '../../../DAO/types/ProductCriteriaBuilder'
import SortCriteriaBuilder from '../../../DAO/types/SortCriteriaBuilder'
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
      let productsResult = {
        totalPages: 1,
        totalResults: 0,
        results: [],
      }
      if (result.value.length > 0) {
        productsResult = await findAll(
          new ProductCriteriaBuilder()
            .withIds(result.value)
            .withPagination(
              new PageableBuilder()
                .withPage(1)
                .withSize(result.value.length)
                .build()
            )
            .withSort(
              new SortCriteriaBuilder()
                .withOrder('ASC')
                .withAttribute('title')
                .build()
            )
            .build()
        )
      }
      res.status(200).json(productsResult)
    } else {
      res.status(result.value.status).json(result.value.toObject())
    }
  })
  .put(async (req, res) => {
    const result = await addProduct(req['user'].id, req.body.productId)
    if (result.isRight()) {
      res.status(201).json(result.value)
    } else {
      res.status(result.value.status).json(result.value.toObject())
    }
  })
  .delete(async (req, res) => {
    let result: Either<ApplicationError, string[]>
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
