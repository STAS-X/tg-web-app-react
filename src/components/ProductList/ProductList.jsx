import React, { useCallback, useEffect, useState } from 'react';
import useTelegram from '../../hooks/useTelegram';
import ProductItem from '../ProductItem/ProductItem';
import uuid from 'react-uuid';
import './ProductList.css';

const initProducts = [
	{
		id: 1,
		title: 'Джинсы 1',
		image: 'https://loremflickr.com/json/g/240/240/jeans,pants,girl?lock=',
		price: 1600,
		description: 'Синего цвета, прямые',
	},
	{
		id: 2,
		title: 'Джинсы 2',
		image: 'https://loremflickr.com/json/g/240/240/jeans,pants,boy?lock=',
		price: 2300,
		description: 'Красного цвета, узкие',
	},
	{
		id: 3,
		title: 'Джинсы 3',
		image: 'https://loremflickr.com/json/g/240/240/jeans,pants,kids?lock=',
		price: 5200,
		description: 'Зеленого цвета, широкие',
	},
	{
		id: 4,
		title: 'Джинсы 4',
		image: 'https://loremflickr.com/json/g/240/240/jeans,pants,rap?lock=',
		price: 4500,
		description: 'Черного цвета, модные',
	},
	{
		id: 5,
		title: 'Куртка 1',
		image: 'https://loremflickr.com/json/g/240/240/jacket,girl?lock=',
		price: 15000,
		description: 'Серого цвета, летняя',
	},
	{
		id: 6,
		title: 'Куртка 2',
		image: 'https://loremflickr.com/json/g/240/240/jacket,boy?lock=',
		price: 14700,
		description: 'Черного цвета, сезонная',
	},
	{
		id: 7,
		title: 'Куртка 3',
		image: 'https://loremflickr.com/json/g/240/240/jacket,kids?lock=',
		price: 9800,
		description: 'Красного цвета, зимняя',
	},
	{
		id: 8,
		title: 'Куртка 4',
		image: 'https://loremflickr.com/json/g/240/240/jacket,rap?lock=',
		price: 12900,
		description: 'Желтого цвета, осенняя',
	},
	{
		id: 9,
		title: 'Рубашка 1',
		image: 'https://loremflickr.com/json/g/240/240/shirt,girl?lock=',
		price: 5200,
		description: 'Синего цвета, легкая',
	},
	{
		id: 10,
		title: 'Рубашка 2',
		image: 'https://loremflickr.com/json/g/240/240/shirt,boy?lock=',
		price: 6500,
		description: 'Черного цвета, хлопковая',
	},
	{
		id: 11,
		title: 'Рубашка 3',
		image: 'https://loremflickr.com/json/g/240/240/shirt,kids?lock=',
		price: 4500,
		description: 'Зеленого цвета, ультратонкая',
	},
	{
		id: 12,
		title: 'Рубашка 4',
		image: 'https://loremflickr.com/json/g/240/240/shirt,rap?lock=',
		price: 2500,
		description: 'Изумрудного цвета, узкая',
	},
];

const ProductList = () => {
	const [products, setProducts] = useState([]);
	const [addedItems, setAddedItems] = useState([]);
	//const [isFetched, setIsFetched] = useState(false);
	const { tg, queryId, user } = useTelegram();

	const getTotalPrice = (items) => {
		return items.reduce((total, newItem) => total + parseInt(newItem.price), 0);
	};

	const onSendData = useCallback(() => {
		const data = {
			products: addedItems,
			totalPrice: getTotalPrice(addedItems),
			queryId,
			username: user?.username,
		};
		fetch(
			`${process.env.REACT_APP_WEB_APP}/${process.env.REACT_APP_API_ROUTER}`,
			{
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(data),
			}
		);
	}, [addedItems]);

	useEffect(() => {
		if (products.length > 0) return;

		const promisesToFetch = [];

		initProducts.forEach((prod, index) => {
			if (prod.image.slice(-1) === '=') {
				promisesToFetch.push(
					fetch(`${process.env.REACT_APP_WEB_APP}/${process.env.REACT_APP_API_ROUTER}`, {method:'GET', headers: {url_data:`${prod.image}${uuid().slice(0, 8)}`}})
						.then((response) => response.json())
						.then((data) => {
							prod.image = data.file;
							return new Promise((resolve, reject) => resolve(prod));
						})
				);
			}
		});
		Promise.all(promisesToFetch).then((data) => setProducts(data));
		//
	}, []);

	useEffect(() => {
		tg.onEvent('mainButtonClicked', onSendData);
		return () => {
			tg.offEvent('mainButtonClicked', onSendData);
		};
	}, [onSendData]);

	const onAdd = (product) => {
		const alreadyAdded =
			addedItems.findIndex((item) => item.id === product.id) > -1;
		let newItems = [];
		if (alreadyAdded) {
			newItems = addedItems.filter((item) => item.id !== product.id);
		} else {
			newItems = [...addedItems, product];
		}

		setAddedItems(newItems);

		if (newItems.length === 0) {
			tg.MainButton.hide();
		} else {
			//console.log(`total price ${getTotalPrice(newItems)}`)
			tg.MainButton.show();
			tg.MainButton.setParams({
				text: `Общая сумма покупок: ${getTotalPrice(newItems)} руб.`,
			});
		}
	};

	return (
		<div className={'list'}>
			{products.length > 0 &&
				products.map((item) => (
					<ProductItem
						key={item.id}
						product={item}
						onAdd={onAdd}
						className={'item'}
					/>
				))}
		</div>
	);
};
export default ProductList;
