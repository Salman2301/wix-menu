import wixData from 'wix-data';
import wixLocation from 'wix-location';
import { session } from 'wix-storage';

var menu = [],
	mainMenu = [];
$w.onReady(function () {
	$w('#repeatSubMenu').collapse();
	menu = session.getItem('menu');

	if (menu === null || menu === undefined || menu.length === 0) {
		wixData.query('menu')
			.ascending('sort')
			.find()
			.then(res => {
				menu = res.items;
				session.setItem('menu', JSON.stringify(menu));
				mainmenu();
			});
	} else {
		menu = JSON.parse(menu)
		mainmenu();
	}

	function mainmenu() {
		menu.forEach(item => {
			if (item.sort % 1 === 0) {
				mainMenu.push(item)
			}
		});
		$w('#repeateMainMenu').data = mainMenu;

	}
	$w('#repeateMainMenu').onItemReady(($item, itemData, i) => {
		$item('#btnMainMenu').label = itemData.title;
		$item('#btnMainMenu').link = itemData.link;
		if (wixLocation.url.split('?')[0] === wixLocation.baseUrl + itemData.link || (itemData.link === '/' && wixLocation.url.split('?')[0] === wixLocation.baseUrl)) {
		//Selected Main menu Highlting main menu
			$item('#btnMainMenu').style.color = '#D55342';
			$item('#lineMain').show()
			$item('#vectorArrow').show();
		} else {
		
			$item('#btnMainMenu').style.color = 'white';
			$item('#lineMain').hide()
			$item('#vectorArrow').hide();
		}
		//Hightlight Main menu is submenu is selected!
		menu.filter(item => {
			if (wixLocation.url.split('?')[0] === wixLocation.baseUrl + item.link && Math.trunc(Number(item.sort)) === Number(itemData.sort)) {
				console.log('Selected category of this Main menu', i)
				$item('#btnMainMenu').style.color = '#D55342';
				$item('#lineMain').show();
				$item('#vectorArrow').show();
				submenu();
			}
		});
		$item('#btnMainMenu').onMouseIn(() => {
			submenu();
		});
		$item('#btnMainMenu').onMouseOut(() => {
			submenu();
		});
		$item('#btnMainMenu').onClick(() => {
			$item('#btnMainMenu').style.color = '#D55342';
			wixLocation.to(itemData.link)
		});

		function submenu() {
			if (itemData.hasSubMenu) {
				repeaterCons(itemData.sort);
				$w('#repeatSubMenu').expand();
			} else {
				$w('#repeatSubMenu').collapse();
			}
		}
	});
	$w('#repeatSubMenu').onItemReady(($item, itemData, i) => {
		$item('#btnSubMenu').label = itemData.title;
		$item('#btnSubMenu').link = itemData.link;
	 });
	function repeaterCons(index) {
		let subMenu = menu.filter(item => {
			return item.sort < index + 1 && item.sort > index
		});
		$w('#repeatSubMenu').data = subMenu;
		$w('#repeatSubMenu').forEachItem(($item, itemData, i) => {
			if (wixLocation.url.split('?')[0] === wixLocation.baseUrl + itemData.link) {
				$item('#btnSubMenu').style.color = '#D55342';
				$item('#lineSub').show();
			} else {
				$item('#btnSubMenu').style.color = 'white';
				$item('#lineSub').hide();
			}
		});
	}
});
