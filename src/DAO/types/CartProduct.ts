import { IProduct } from '../documents/Product'

type CartProduct = IProduct & { selectedAmount: number }

export default CartProduct
