import React, { useRef, useState } from 'react';
import { useMemo } from 'react';
import { useCallback } from 'react';
import { useEffect } from 'react';
import useTelegram from '../../hooks/useTelegram';
import './Form.css';

const Form = () => {
	const [country, setCountry] = useState('');
	const [street, setStreet] = useState('');
	const [subject, setSubject] = useState('fizical');

	//const allData = `Страна: ${country} Улица: ${street} Вид деятельности: ${subject}`;

	const { tg } = useTelegram();

	const onSendData = useCallback(() => {
		const data = { country, street, subject };
		tg.sendData(JSON.stringify(data));
	}, [country, street, subject]);

	useEffect(() => {

		tg.onEvent('mainButtonClicked', onSendData);
		return () => {
			tg.offEvent('mainButtonClicked', onSendData);
		};
	}, [onSendData]);

	useEffect(() => {

		tg.MainButton.setParams({ text: 'Отправить данные' });

	}, []);

	useMemo(() => {
		if (!country || !street) {
			tg.MainButton.hide();
		} else {
			tg.MainButton.show();
		}
	}, [country, street]);

	return (
		<div className={'form'}>
			<h3>Введите ваше данные</h3>
			<input
				className={'input'}
				type="text"
				value={country}
				onChange={(e) => setCountry(e.target.value)}
				placeholder={'Страна'}
			></input>
			<input
				className={'input'}
				type="text"
				value={street}
				onChange={(e) => setStreet(e.target.value)}
				placeholder={'Улица'}
			></input>
			<select
				className={'select'}
				value={subject}
				onChange={(e) => setSubject(e.target.value)}
			>
				<option value={'fizical'}>Физ. лицо</option>
				<option value={'company'}>Юр. лицо</option>
			</select>
		</div>
	);
};
export default Form;
