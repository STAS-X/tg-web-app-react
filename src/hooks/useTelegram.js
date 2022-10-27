let tg = window.Telegram.WebApp;

export default function useTelegram() {
	const handleClose = () => {
		//console.log(JSON.stringify(tg.initDataUnsafe), 'telegram bot object');
		tg.close();
	};

	const handleToggleButton = () => {
		if (tg.MainButton.isVisible) {
			tg.MainButton.hide();
		} else {
			tg.MainButton.show();
		}
	};

	return {
		handleClose,
        handleToggleButton,
		tg,
		user: tg.initDataUnsafe?.user,
        queryId: tg.initDataUnsafe?.query_id,
	};
}
