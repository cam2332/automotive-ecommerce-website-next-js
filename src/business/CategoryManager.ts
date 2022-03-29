/* eslint-disable no-plusplus */
import { ICategory } from '../DAO/documents/Category'
import Category from '../DAO/models/Category'
import CategoryCriteriaBuilder from '../DAO/types/CategoryCriteriaBuilder'
import ICategoryCriteria from '../DAO/types/ICategoryCriteria'
import PageableBuilder from '../DAO/types/PageableBuilder'
import { ResultData } from '../DAO/types/ResultData'
import SortCriteriaBuilder from '../DAO/types/SortCriteriaBuilder'
import SortMethod from '../DAO/types/SortMethod'
import ApplicationError from '../utils/ApplicationError'
import { Either, left, right } from '../utils/Either'
import {
  applyFilterAndPaginationAndSortOnCategories,
  createCategoryDataTree,
  fromCategoryDocument,
} from '../utils/MongoConverter'

export const createCategory = async (requestBody: {
  name: string
  parentCategoryId?: string
  thumbnailUrl?: string
}): Promise<Either<ApplicationError, ICategory>> => {
  if (!requestBody.name) {
    return left(
      ApplicationError.MISSING_REQUIRED_PROPERTY.setDetail(
        `The 'name' property must be present in the request body.`
      ).setInstance('/categories')
    )
  }
  if (typeof requestBody.name !== 'string' || requestBody.name.length < 1) {
    return left(
      ApplicationError.UNSUPPORTED_PROPERTY.setDetail(
        `The 'name' property must be a string.`
      ).setInstance('/categories')
    )
  }

  try {
    const category = await Category.findCategoryByName(requestBody.name)

    if (category) {
      return left(
        ApplicationError.RESOURCE_EXISTS.setDetail(
          `Category with name '${requestBody.name}' already exists.`
        ).setInstance(`/categories/${category.id}`)
      )
    }
    const createdCategory = await Category.createCategory(
      requestBody.name,
      requestBody.thumbnailUrl,
      requestBody.parentCategoryId
    )

    return right(fromCategoryDocument(createdCategory))
  } catch (error) {
    return left(
      ApplicationError.INTERNAL_ERROR.setDetail(
        'Cannot create category.'
      ).setInstance('/categories')
    )
  }
}

export const findAll = async (
  criteria: ICategoryCriteria
): Promise<ResultData<ICategory[]>> => {
  try {
    const categoryDocs = await Category.findAll()
    let categories = categoryDocs.map((category) =>
      fromCategoryDocument(category)
    )
    if (!criteria.flat) {
      categories = createCategoryDataTree(
        categories,
        'id',
        'parentCategoryId',
        criteria
      )
    }

    return {
      totalResults: categories.length,
      totalPages: Math.ceil(categories.length / criteria.pagination.size),
      results: applyFilterAndPaginationAndSortOnCategories(
        categories,
        criteria
      ),
    }
  } catch (error) {
    return {
      totalResults: 0,
      totalPages: 1,
      results: [],
    }
  }
}

const searchCategoryInBranchById = (
  category: ICategory,
  id: string
  // eslint-disable-next-line consistent-return
): ICategory | null => {
  if (id === category.id) {
    return category
  }
  if (category.categories) {
    for (let i = 0; i < category.categories.length; i++) {
      const result = searchCategoryInBranchById(category.categories[i], id)
      if (result) {
        return result
      }
    }
    return null
  }
}

export const findCategoryById = async (
  id: string
): Promise<Either<ApplicationError, ICategory>> => {
  if (id === undefined) {
    return left(
      ApplicationError.MISSING_REQUIRED_PATH_PARAMETER.setDetail(
        `The 'id' URL parameter must be provided in the request.`
      ).setInstance('/categories/:id')
    )
  }
  if (typeof id !== 'string' || id.length < 1) {
    return left(
      ApplicationError.UNSUPPORTED_PATH_PARAMETER.setDetail(
        `The 'id' path parameter must be a string.`
      ).setInstance('/categories/:id')
    )
  }

  let category: ICategory
  const allCategories = await findAll(
    new CategoryCriteriaBuilder()
      .withPagination(new PageableBuilder().withPage(1).withSize(1000).build())
      .withSort(
        new SortCriteriaBuilder()
          .withOrder('DESC')
          .withAttribute('numberOfProducts')
          .build()
      )
      .build()
  )

  for (let i = 0; i < allCategories.results.length; i++) {
    category = searchCategoryInBranchById(allCategories.results[i], id)
    if (category) {
      break
    }
  }

  if (category) {
    return right(category)
  }
  return left(
    ApplicationError.RESOURCE_NOT_FOUND.setDetail(
      `Category with id '${id}' does not exists.`
    ).setInstance(`/categories/${id}`)
  )
}

export const findRootCategoryById = async (
  categoriesTree: ICategory[],
  id: string
): Promise<
  Either<ApplicationError, { category: ICategory; selectedCategory: ICategory }>
> => {
  if (id === undefined) {
    return left(
      ApplicationError.MISSING_REQUIRED_PATH_PARAMETER.setDetail(
        `The 'id' URL parameter must be provided in the request`
      ).setInstance('/categories/:id')
    )
  }
  if (typeof id !== 'string' || id.length < 1) {
    return left(
      ApplicationError.UNSUPPORTED_PATH_PARAMETER.setDetail(
        `The 'id' path parameter must be a string.`
      ).setInstance('/categories/:id')
    )
  }
  let category: ICategory
  let selectedCategory: ICategory

  for (let i = 0; i < categoriesTree.length; i++) {
    selectedCategory = searchCategoryInBranchById(categoriesTree[i], id)
    if (selectedCategory) {
      category = categoriesTree[i]
      break
    }
  }

  if (category) {
    return right({ category, selectedCategory })
  }
  return left(
    ApplicationError.RESOURCE_NOT_FOUND.setDetail(
      `Category with id '${id}' does not exists.`
    ).setInstance(`/categories/${id}`)
  )
}

const searchCategoryInBranchByName = (
  category: ICategory,
  name: string
  // eslint-disable-next-line consistent-return
): ICategory | null => {
  if (name === category.name) {
    return category
  }
  if (category.categories) {
    for (let i = 0; i < category.categories.length; i++) {
      const result = searchCategoryInBranchByName(category.categories[i], name)
      if (result) {
        return result
      }
    }
    return null
  }
}

export const findCategoryByName = async (
  name: string
): Promise<Either<ApplicationError, ICategory>> => {
  if (name === undefined) {
    return left(
      ApplicationError.MISSING_REQUIRED_QUERY_PARAMETER.setDetail(
        `The 'name' URL query parameter must be provided in the request.`
      ).setInstance('/categories')
    )
  }
  if (typeof name !== 'string' || name.length < 1) {
    return left(
      ApplicationError.UNSUPPORTED_QUERY_PARAMETER.setDetail(
        `The 'name' query parameter must be a string.`
      ).setInstance('/categories')
    )
  }

  let category: ICategory
  const allCategories = await findAll(
    new CategoryCriteriaBuilder()
      .withPagination(new PageableBuilder().withPage(1).withSize(1000).build())
      .withSort(
        new SortCriteriaBuilder()
          .withOrder('DESC')
          .withAttribute('numberOfProducts')
          .build()
      )
      .build()
  )

  for (let i = 0; i < allCategories.results.length; i++) {
    category = searchCategoryInBranchByName(allCategories.results[i], name)
    if (category) {
      break
    }
  }

  if (category) {
    return right(category)
  }
  return left(
    ApplicationError.RESOURCE_NOT_FOUND.setDetail(
      `Category with name '${name}' does not exists.`
    ).setInstance('/categories/')
  )
}

export const findRootCategoryByName = async (
  name: string
): Promise<Either<ApplicationError, ICategory>> => {
  if (name === undefined) {
    return left(
      ApplicationError.MISSING_REQUIRED_QUERY_PARAMETER.setDetail(
        `The 'name' URL parameter must be provided in the request`
      ).setInstance('/categories')
    )
  }
  if (typeof name !== 'string' || name.length < 1) {
    return left(
      ApplicationError.UNSUPPORTED_QUERY_PARAMETER.setDetail(
        `The 'name' query parameter must be a string.`
      ).setInstance('/categories')
    )
  }
  let category: ICategory
  const allCategories = await findAll(
    new CategoryCriteriaBuilder()
      .withPagination(new PageableBuilder().withPage(1).withSize(1000).build())
      .withSort(
        new SortCriteriaBuilder()
          .withOrder('DESC')
          .withAttribute('numberOfProducts')
          .build()
      )
      .build()
  )

  for (let i = 0; i < allCategories.results.length; i++) {
    if (searchCategoryInBranchByName(allCategories.results[i], name)) {
      category = allCategories.results[i]
      break
    }
  }

  if (category) {
    return right(category)
  }
  return left(
    ApplicationError.RESOURCE_NOT_FOUND.setDetail(
      `Category with name '${name}' does not exists.`
    ).setInstance('/categories')
  )
}

export const findAllByName = async (
  name: string,
  page: number,
  resultsPerPage: number,
  sortMethod: SortMethod
): Promise<ResultData<ICategory[]>> => {
  try {
    const result = await Category.findAllByName(
      name,
      page,
      resultsPerPage,
      sortMethod
    )
    return {
      ...result,
      results: result.results.map((category) => fromCategoryDocument(category)),
    }
  } catch (error) {
    return {
      totalResults: 0,
      totalPages: 1,
      results: [],
    }
  }
}
