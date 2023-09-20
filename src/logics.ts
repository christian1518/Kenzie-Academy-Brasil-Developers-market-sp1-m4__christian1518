import { Request, Response } from "express";
import market from "./database";
import { Product } from "./interfaces";

let id = 1

const createNewProduct = (req: Request, res: Response): Response => {
    const newProduct: Product = {
        ...req.body,
        id: id++,
        expirationDate: new Date()
    }
    
    const currentDate: Date = new Date(newProduct.expirationDate);

    currentDate.setFullYear(currentDate.getFullYear() + 1);
    newProduct.expirationDate = currentDate;

    market.push(newProduct)

    return res.status(201).json(newProduct)
}

const readAllProducts = (req: Request, res: Response): Response => {
    let totalPrice = 0
    for(let i = 0; i < market.length; i++) {
        totalPrice += market[i].price
    }

    return res.status(200).json({ total: totalPrice, products: market })
}

const search = (req: Request, res: Response): Response => {
    const { foundProduct } = res.locals
    return res.status(200).json(foundProduct)
}

const destroy = (req: Request, res: Response): Response => {
    const {productIndex} = res.locals

    market.splice(productIndex, 1)

    return res.status(204).json()
}

const partialUpdate = (req: Request, res: Response): Response => {
    const {productIndex} = res.locals

    market[productIndex] = {
        ...market[productIndex],
        ...req.body,
    }

    const updatedProduct = market[productIndex]

    return res.status(200).json(updatedProduct)
}

export default { createNewProduct, readAllProducts, search, destroy, partialUpdate }