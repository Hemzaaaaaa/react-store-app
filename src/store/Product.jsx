import React from 'react'
import Rating from './Rating'

const Product = ({ product }) => {
    return (
        <tr>
            <td>{product.id}</td>
            <td>{product.title}</td>
            <td>{product.price}</td>
            <td>{product.description.slice(0, 100)}...</td>
            {/* display just the first 100 chars */}
            <td>{product.category}</td>
            <td><img src={product.image} alt={product.title} className="w-16 h-16 object-contain mx-auto" /></td>
            <td><Rating rate={product.rating.rate} count={product.rating.count} /></td>
        </tr>
    )
}

export default Product
