export interface Products {
    categories: Category[]
}

export interface Category {
    name: string
    products: Product[]
}

export interface Product {
    name: string
    price: number
    description: string
    image: string
    accessories?: Accessory[]
}

export interface Accessory {
    name: string
    price: number
    description: string
    image: string
}
