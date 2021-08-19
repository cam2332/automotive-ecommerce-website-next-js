import { ICategory } from '../DAO/documents/Category'
import Category from '../DAO/models/Category'
import ApplicationError from '../utils/ApplicationError'
import { Either, left, right } from '../utils/Either'
import { createDataTree, fromCategoryDocument } from '../utils/MongoConverter'

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
    } else {
      const createdCategory = await Category.createCategory(
        requestBody.name,
        requestBody.thumbnailUrl,
        requestBody.parentCategoryId
      )

      return right(fromCategoryDocument(createdCategory))
    }
  } catch (error) {
    return left(
      ApplicationError.INTERNAL_ERROR.setDetail(
        'Cannot create category.'
      ).setInstance('/categories')
    )
  }
}

export const findAllCategories = async (
  makeTree: boolean
): Promise<Either<ApplicationError, ICategory[]>> => {
  try {
    let categories = await Category.findAllCategories()

    if (makeTree) {
      return right(
        createDataTree(
          categories.map((category) => fromCategoryDocument(category)),
          'id',
          'parentCategoryId'
        )
      )
    } else {
      return right(categories.map((category) => fromCategoryDocument(category)))
    }
  } catch (error) {
    return left(
      ApplicationError.INTERNAL_ERROR.setDetail(
        'Cannot find categories.'
      ).setInstance('/categories')
    )
  }
}

const searchCategoryInBranchById = (
  category: ICategory,
  id: string
): ICategory | null => {
  if (id === category.id) {
    return category
  } else {
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
  const allCategories = await findAllCategories(true)
  console.log('categories', allCategories)
  if (allCategories.isRight()) {
    for (let i = 0; i < allCategories.value.length; i++) {
      category = searchCategoryInBranchById(allCategories.value[i], id)
      if (category) {
        break
      }
    }

    if (category) {
      return right(category)
    } else {
      return left(
        ApplicationError.RESOURCE_NOT_FOUND.setDetail(
          `Category with id '${id}' does not exists.`
        ).setInstance(`/categories/${id}`)
      )
    }
  } else {
    return left(
      ApplicationError.INTERNAL_ERROR.setDetail(
        `Cannot find category with id ${id}.`
      ).setInstance(`/categories/${id}`)
    )
  }
}

export const findRootCategoryById = async (
  id: string
): Promise<Either<ApplicationError, ICategory>> => {
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
  const allCategories = await findAllCategories(true)
  console.log(allCategories)
  if (allCategories.isRight()) {
    for (let i = 0; i < allCategories.value.length; i++) {
      if (searchCategoryInBranchById(allCategories.value[i], id)) {
        category = allCategories.value[i]
        break
      }
    }

    if (category) {
      return right(category)
    } else {
      return left(
        ApplicationError.RESOURCE_NOT_FOUND.setDetail(
          `Category with id '${id}' does not exists.`
        ).setInstance(`/categories/${id}`)
      )
    }
  } else {
    return left(
      ApplicationError.INTERNAL_ERROR.setDetail(
        `Cannot find category with id ${id}.`
      ).setInstance(`/categories/${id}`)
    )
  }
}

const searchCategoryInBranchByName = (
  category: ICategory,
  name: string
): ICategory | null => {
  if (name === category.name) {
    return category
  } else {
    if (category.categories) {
      for (let i = 0; i < category.categories.length; i++) {
        const result = searchCategoryInBranchByName(
          category.categories[i],
          name
        )
        if (result) {
          return result
        }
      }
      return null
    }
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
  const allCategories = await findAllCategories(true)
  if (allCategories.isRight()) {
    for (let i = 0; i < allCategories.value.length; i++) {
      category = searchCategoryInBranchByName(allCategories.value[i], name)
      if (category) {
        break
      }
    }

    if (category) {
      return right(category)
    } else {
      return left(
        ApplicationError.RESOURCE_NOT_FOUND.setDetail(
          `Category with name '${name}' does not exists.`
        ).setInstance('/categories/')
      )
    }
  } else {
    return left(
      ApplicationError.INTERNAL_ERROR.setDetail(
        `Cannot find category with name ${name}.`
      ).setInstance('/categories')
    )
  }
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
  const allCategories = await findAllCategories(true)
  if (allCategories.isRight()) {
    for (let i = 0; i < allCategories.value.length; i++) {
      if (searchCategoryInBranchByName(allCategories.value[i], name)) {
        category = allCategories.value[i]
        break
      }
    }

    if (category) {
      return right(category)
    } else {
      return left(
        ApplicationError.RESOURCE_NOT_FOUND.setDetail(
          `Category with name '${name}' does not exists.`
        ).setInstance('/categories')
      )
    }
  } else {
    return left(
      ApplicationError.INTERNAL_ERROR.setDetail(
        `Cannot find category with name ${name}.`
      ).setInstance('/categories')
    )
  }
}
