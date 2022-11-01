import React from 'react';
import Button from '../Button/Button';
import './ProductItem.css';

const ProductItem = ({ product, className, onAdd }) => {
	const onAddHandler = () => {
		onAdd(product);
	};

	return (
		<div className={'product ' + className}>
			<div
				className={'img'}
				style={{
					backgroundImage:
						product.image.slice(-1) === '='
							? `url("https://via.placeholder.com/200?text=${product.title.replace(
									/\s/g,
									'+'
							  )}")`
							: `url("${product.image}")`,
				}}
			></div>
			<div className={'title'}>{product.title}</div>
			<div className={'description'}>{product.description}</div>
			<div className={'price'}>
				<span>
					Стоимость <b>{product.price}</b>
				</span>
			</div>
			<Button className={'add-btn'} onClick={onAddHandler}>
				Добавить в корзину
			</Button>
		</div>
	);
};
export default ProductItem;
