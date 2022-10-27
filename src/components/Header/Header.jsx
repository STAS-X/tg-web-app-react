import React, { useEffect } from 'react';
import useTelegram from '../../hooks/useTelegram';
import Button from '../Button/Button';
import './Header.css';

const Header = () => {
  const { tg, handleClose, user } = useTelegram();

	return (
		<div className={'header'}>
			<Button onClick={handleClose}>Закрыть</Button>
      <div className="break" />
			<div className={'username'}>{user?.username}</div>
		</div>
	);
};
export default Header;
