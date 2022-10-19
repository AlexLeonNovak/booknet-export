import {DateTime} from 'luxon';

export const toMauticData = (fields) => ({
	customerid: fields['Customer_Id'],
	firstname: fields['first_name_delivery'],
	lastname: fields['Last_Name'],
	birth_date: DateTime.fromJSDate(fields['Birth_Date']).toFormat('yyyy-MM-dd'),
	firstofbirthdaymonth: fields['BD_Promotion_Triger'],
	lastpurchasetimedate: fields['Last_Purchase_Date'],
	firstofjoindate: fields['Join_Promotion_Triger'],
	entercardnumberdate: fields['Last_Card_Date'],
	jointimendate: fields['Last_Card_Date_H'],
	points: fields['PointsAmount'],
	confirmation: fields['Consent'],
	mobile: fields['Mobile'],
	cansendsms: fields['Could_send_sms'],
	email: fields['Email'] && fields['Email'].trim() || fields['Customer_Id'] + '@email.com',
	cansendemail: fields['Could_send_email'],
	city: fields['City'],
	preferredbranch12m: fields['preferredBranch_12mon'],
	preferredbranch: fields['preferredBranch_12mon_Name'],
	lastpurchasenum: fields['lastbranch'],
	lastpurchase: fields['Last_Branch_Name'],
	counttran: fields['CountTran_12mon'],
	firstcategory: fields['Primary_Category'],
	secondcategory: fields['Secondary_Category'],
	cooking: fields['בישול'],
	fantasy: fields['מד"ב ופנטזיה'],
	judaism: fields['יהדות'],
	newage: fields['עידן חדש'],
	english: fields['אנגלית'],
	study: fields['עיון'],
	thriller: fields['מתח'],
	erotica: fields['ארוטיקה'],
	romance: fields['רומנטי'],
	history: fields['רומן היסטרי'],
	story: fields['סיפורת'],
	teen: fields['ספרות נוער'],
	puzzle: fields['פאזלים'],
	games: fields['משחקים'],
	kids: fields['ספרות ילדים'],
	teenager: fields['נוער בוגר'],
	puzzleshop: fields['קניות פאזלים'],
	gameshop: fields['קניות משחקים'],
	kidsshop: fields['קניות ילדים'],
	boughtthismonth: fields['BoughtthisMonth'],
	monthsfromlastbuy: fields['MonthsSinceLastPurchase'],
	birthdaythismonth9: fields['BirthDayThisMonth'],
	dynamic: fields['Dynamic_1'],
	dynamic1: fields['Dynamic_2'],
	joinlastmonth: fields['Join_Promoiton_this_month'],
	endmonthdate: DateTime.now().endOf('month').toFormat('yyyy-MM-dd'),
	datecreated: fields['Creation_Date'],
	updatedate: fields['Update_Date'],
	controlgroup: fields['Control_Group'],
});

export const prepareApiData = (data) => {
	const newData = [];
	for (const row of data) {
		newData.push(toMauticData(row));
	}
	return newData;
}
