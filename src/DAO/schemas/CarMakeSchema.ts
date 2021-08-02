import { Schema } from 'mongoose'
import { CarMakeDocument } from '../documents/CarMake'
import CarMake from '../models/CarMake'
import CarModel from '../models/CarModel'

const CarMakeSchema: Schema = new Schema(
  {
    _id: { type: Schema.Types.String, required: true },
    name: { type: Schema.Types.String, required: true },
    models: [{ type: Schema.Types.String, ref: 'CarModels' }],
  },
  {
    collection: 'CarMakes',
  }
)

CarMakeSchema.statics.findAllMakes = async (): Promise<CarMakeDocument[]> => {
  const makes = await CarMake.find(
    {},
    {
      _id: 0,
      id: '$_id',
      name: 1,
      models: 1,
    }
  ).sort({ name: 1 })
  return makes
}

CarMakeSchema.statics.findMakeById = async (
  makeId: string
): Promise<CarMakeDocument> => {
  const make = await CarMake.findOne(
    {
      _id: makeId,
    },
    {
      _id: 0,
      id: '$_id',
      name: 1,
      models: 1,
    }
  ) //.populate({ path: 'models', model: CarModel })

  return make
}

// CarMakeSchema.statics.findModelById = async (
//   makeId: string,
//   modelId: string
// ): Promise<CarModelDocument> => {
//   const result = await CarMake.aggregate([
//     {
//       $match: {
//         name: { $regex: new RegExp(makeId.toString(), 'i') },
//       },
//     },
//     {
//       $unwind: '$models',
//     },
//     {
//       $match: {
//         'models.id': modelId,
//       },
//     },
//     {
//       $project: {
//         _id: 0,
//         id: '$_id',
//         name: {
//           $concat: [
//             '$name',
//             ' ',
//             '$models.group',
//             ' ',
//             '$models.name',
//             ' (',
//             '$models.productionStartYear',
//             ' - ',
//             '$models.productionEndYear',
//             ')',
//           ],
//         },
//         model: '$models',
//       },
//     },
//   ])
// }

export default CarMakeSchema
