import { Schema, Types } from 'mongoose'
import { ProductDocument, Property } from '../documents/Product'
import Product from '../models/Product'
import { ResultData } from '../types/ResultData'
import SortMethod from '../types/SortMethod'

const PropertySchema: Schema = new Schema({
  name: { type: Schema.Types.String, required: true },
  unit: { type: Schema.Types.String },
  value: { type: Schema.Types.String, required: true },
})

const ProductSchema: Schema = new Schema<ProductDocument>(
  {
    _id: { type: Schema.Types.String, required: true },
    title: { type: Schema.Types.String, required: true },
    subTitle: { type: Schema.Types.String },
    identifier: { type: Schema.Types.String, required: true },
    price: { type: Schema.Types.Number, required: true },
    oldPrice: { type: Schema.Types.Number },
    currency: { type: Schema.Types.String, required: true },
    quantity: { type: Schema.Types.Number, required: true },
    properties: [{ type: PropertySchema }],
    manufacturer: { type: Schema.Types.String, required: true },
    categoryId: { type: Schema.Types.String, required: true },
    compatibleCarTypeIds: [{ type: Schema.Types.String }],
    thumbnailUrl: { type: Schema.Types.String, required: true },
  },
  {
    collection: 'Products',
  }
)

ProductSchema.statics.createProduct = async (
  title: string,
  subTitle: string | undefined,
  identifier: string,
  price: number,
  oldPrice: number | undefined,
  currency: string,
  quantity: number,
  properties: Property[] | undefined,
  manufacturer: string,
  categoryId: string,
  compatibleCarTypeIds: string[] | undefined,
  thumbnailUrl: string
): Promise<ProductDocument> => {
  const product = new Product({
    _id: Types.ObjectId().toHexString(),
    title: title,
    ...(subTitle && { subTitle: subTitle }),
    identifier: identifier,
    price: price,
    ...(oldPrice && { oldPrice: oldPrice }),
    currency: currency,
    quantity: quantity,
    ...(properties && { properties: properties }),
    manufacturer: manufacturer,
    categoryId: categoryId,
    ...(compatibleCarTypeIds && { compatibleCarTypeIds: compatibleCarTypeIds }),
    thumbnailUrl: thumbnailUrl,
  })
  const createdProduct = await product.save()
  return createdProduct
}

ProductSchema.statics.findProductById = async (
  productId: string,
  userId?: string
): Promise<ProductDocument | null> => {
  if (userId) {
    const product = await Product.aggregate([
      {
        $match: {
          _id: productId,
        },
      },
      {
        $lookup: {
          from: 'Users',
          let: {
            product_id: '$_id',
          },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    {
                      $eq: ['$_id', userId],
                    },
                    {
                      $in: [
                        '$$product_id',
                        {
                          $ifNull: ['$wishList', []],
                        },
                      ],
                    },
                  ],
                },
              },
            },
          ],
          as: 'Users',
        },
      },
      {
        $project: {
          title: 1,
          subTitle: 1,
          identifier: 1,
          price: 1,
          oldPrice: 1,
          currency: 1,
          quantity: 1,
          properties: 1,
          manufacturer: 1,
          categoryId: 1,
          compatibleCarTypeIds: 1,
          thumbnailUrl: 1,
          inWishList: {
            $eq: [
              {
                $size: '$Users',
              },
              1,
            ],
          },
        },
      },
    ])

    return Array.isArray(product) && product.length > 0
      ? (product[0] as ProductDocument)
      : null
  } else {
    const product = await Product.findById(productId, {
      title: 1,
      subTitle: 1,
      identifier: 1,
      price: 1,
      oldPrice: 1,
      currency: 1,
      quantity: 1,
      properties: 1,
      manufacturer: 1,
      categoryId: 1,
      compatibleCarTypeIds: 1,
      thumbnailUrl: 1,
    })

    return product
  }
}

ProductSchema.statics.findProductsByCategoryId = async (
  userId?: string,
  categoryId?: string
): Promise<ProductDocument[]> => {
  let products

  let pipeline = []

  if (categoryId) {
    pipeline.push({
      $match: {
        categoryId: categoryId,
      },
    })
  }

  pipeline = [
    {
      $lookup: {
        from: 'Users',
        let: {
          product_id: '$_id',
        },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  {
                    $eq: ['$_id', userId],
                  },
                  {
                    $in: [
                      '$$product_id',
                      {
                        $ifNull: ['$wishList', []],
                      },
                    ],
                  },
                ],
              },
            },
          },
        ],
        as: 'Users',
      },
    },
    {
      $project: {
        title: 1,
        subTitle: 1,
        identifier: 1,
        price: 1,
        oldPrice: 1,
        currency: 1,
        quantity: 1,
        properties: 1,
        manufacturer: 1,
        categoryId: 1,
        compatibleCarTypeIds: 1,
        thumbnailUrl: 1,
        inWishList: {
          $eq: [
            {
              $size: '$Users',
            },
            1,
          ],
        },
      },
    },
  ]

  if (userId) {
    products = await Product.aggregate(pipeline)
  } else {
    products = await Product.find(
      { categoryId: categoryId },
      {
        title: 1,
        subTitle: 1,
        identifier: 1,
        price: 1,
        oldPrice: 1,
        currency: 1,
        quantity: 1,
        properties: 1,
        manufacturer: 1,
        categoryId: 1,
        compatibleCarTypeIds: 1,
        thumbnailUrl: 1,
      }
    )
    //.sort({ title: 1 })
  }

  return products
}

ProductSchema.statics.findProductsByCategoryHierarchy = async (
  categoryId: string,
  userId: string | undefined,
  page: number,
  resultsPerPage: number,
  sortMethod: SortMethod
): Promise<ResultData<ProductDocument[]>> => {
  let pipeline = []
  pipeline = [
    {
      $lookup: {
        from: 'Categories',
        let: {
          category_id: '$_id',
        },
        pipeline: [
          {
            $graphLookup: {
              from: 'Categories',
              startWith: '$_id',
              connectFromField: '_id',
              connectToField: 'parentCategoryId',
              as: 'hierarchy',
            },
          },
          {
            $project: {
              'hierarchy._id': 1,
            },
          },
          {
            $project: {
              _id: 0,
              hierarchy: {
                $concatArrays: [
                  [
                    {
                      _id: '$_id',
                    },
                  ],
                  '$hierarchy',
                ],
              },
            },
          },
          {
            $addFields: {
              hierarchy: {
                $map: {
                  input: '$hierarchy',
                  as: 'hier',
                  in: '$$hier._id',
                },
              },
            },
          },
        ],
        as: 'categories',
      },
    },
    {
      $unwind: {
        path: '$categories',
      },
    },
    {
      $match: {
        $expr: {
          $in: ['$categoryId', '$categories.hierarchy'],
        },
      },
    },
    {
      $match: {
        $expr: {
          $eq: [
            categoryId,
            {
              $arrayElemAt: ['$categories.hierarchy', 0],
            },
          ],
        },
      },
    },
    {
      $group: {
        _id: '$_id',
        doc: {
          $first: '$$ROOT',
        },
      },
    },
    {
      $replaceRoot: {
        newRoot: '$doc',
      },
    },
  ]

  const sort = {
    $sort: {
      ...(sortMethod.type === SortMethod.relevance.type && { _id: -1 }),
      ...(sortMethod.type === SortMethod.nameAsc.type && { title: 1 }),
      ...(sortMethod.type === SortMethod.nameDesc.type && { title: -1 }),
      ...(sortMethod.type === SortMethod.priceAsc.type && { price: 1 }),
      ...(sortMethod.type === SortMethod.priceDesc.type && { price: -1 }),
    },
  }
  pipeline.push(sort)

  const wishList = {
    $lookup: {
      from: 'Users',
      let: {
        product_id: '$_id',
      },
      pipeline: [
        {
          $match: {
            $expr: {
              $and: [
                {
                  $eq: ['$_id', userId],
                },
                {
                  $in: [
                    '$$product_id',
                    {
                      $ifNull: ['$wishList', []],
                    },
                  ],
                },
              ],
            },
          },
        },
      ],
      as: 'users',
    },
  }
  if (userId) {
    pipeline.push(wishList)
  }
  const project = {
    $project: {
      title: 1,
      subTitle: 1,
      identifier: 1,
      price: 1,
      oldPrice: 1,
      currency: 1,
      quantity: 1,
      properties: 1,
      manufacturer: 1,
      categoryId: 1,
      compatibleCarTypeIds: 1,
      thumbnailUrl: 1,
      ...(userId && {
        inWishList: {
          $eq: [
            {
              $size: '$users',
            },
            1,
          ],
        },
      }),
    },
  }
  pipeline.push(project)

  const pagination = {
    $facet: {
      metadata: [
        {
          $count: 'totalResults',
        },
        {
          $addFields: {
            totalPages: {
              $ceil: {
                $divide: ['$totalResults', resultsPerPage],
              },
            },
          },
        },
      ],
      results: [
        {
          $skip: (page - 1) * resultsPerPage,
        },
        {
          $limit: resultsPerPage,
        },
      ],
    },
  }
  pipeline.push(pagination)

  const products = await Product.aggregate(pipeline)
  products[0].totalResults = products[0].metadata[0]
    ? products[0].metadata[0].totalResults
    : 0
  products[0].totalPages = products[0].metadata[0]
    ? products[0].metadata[0].totalPages
    : 1
  return products[0]
}

ProductSchema.statics.findProductsByIds = async (
  ids: string[],
  userId: string | undefined,
  page: number,
  resultsPerPage: number,
  sortMethod: SortMethod
): Promise<ResultData<ProductDocument[]>> => {
  let pipeline = []
  pipeline = [
    {
      $match: {
        $expr: {
          $in: ['$_id', ids],
        },
      },
    },
  ]

  const sort = {
    $sort: {
      ...(sortMethod.type === SortMethod.relevance.type && { _id: -1 }),
      ...(sortMethod.type === SortMethod.nameAsc.type && { title: 1 }),
      ...(sortMethod.type === SortMethod.nameDesc.type && { title: -1 }),
      ...(sortMethod.type === SortMethod.priceAsc.type && { price: 1 }),
      ...(sortMethod.type === SortMethod.priceDesc.type && { price: -1 }),
    },
  }
  pipeline.push(sort)

  const wishList = {
    $lookup: {
      from: 'Users',
      let: {
        product_id: '$_id',
      },
      pipeline: [
        {
          $match: {
            $expr: {
              $and: [
                {
                  $eq: ['$_id', userId],
                },
                {
                  $in: [
                    '$$product_id',
                    {
                      $ifNull: ['$wishList', []],
                    },
                  ],
                },
              ],
            },
          },
        },
      ],
      as: 'Users',
    },
  }

  if (userId) {
    pipeline.push(wishList)
  }
  const project = {
    $project: {
      title: 1,
      subTitle: 1,
      identifier: 1,
      price: 1,
      oldPrice: 1,
      currency: 1,
      quantity: 1,
      properties: 1,
      manufacturer: 1,
      categoryId: 1,
      compatibleCarTypeIds: 1,
      thumbnailUrl: 1,
      ...(userId && {
        inWishList: {
          $eq: [
            {
              $size: '$users',
            },
            1,
          ],
        },
      }),
    },
  }
  pipeline.push(project)

  const pagination = {
    $facet: {
      metadata: [
        {
          $count: 'totalResults',
        },
        {
          $addFields: {
            totalPages: {
              $ceil: {
                $divide: ['$totalResults', resultsPerPage],
              },
            },
          },
        },
      ],
      results: [
        {
          $skip: (page - 1) * resultsPerPage,
        },
        {
          $limit: resultsPerPage,
        },
      ],
    },
  }
  pipeline.push(pagination)

  const products = await Product.aggregate(pipeline)
  products[0].totalResults = products[0].metadata[0]
    ? products[0].metadata[0].totalResults
    : 0
  products[0].totalPages = products[0].metadata[0]
    ? products[0].metadata[0].totalPages
    : 1
  return products[0]
}

export default ProductSchema
