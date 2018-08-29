const ow = require('ow');
const signale = require('signale');
const delay = require('delay');
const puppeteer = require('puppeteer');

/**
 * @typedef {Object} User
 * @property {string} user.username
 * @property {string} user.password
 */

const checkNonEmptyString = ow.create(ow.string.minLength(1));

const login = async (page, user) => {
	await page.goto('https://twitter.com/login', {waitUntil: 'networkidle0'});
	await page.type('input[type=text]', user.username, {delay: 50});
	signale.info('username typed');
	await page.type('input.js-password-field', user.password, {delay: 50});
	signale.info('password typed');
	await page.click('button.submit');
	signale.info('login');
};

const tweet = async (page, message) => {
	// Await page.goto('https://twitter.com/', {waitUntil: 'networkidle0'});
	await page.waitForSelector('#tweet-box-home-timeline');
	await page.click('#tweet-box-home-timeline');
	await page.type('#tweet-box-home-timeline', message, {delay: 50});
	signale.info('login');
	await delay(100);
	await page.click('button.tweet-action');
};

/**
 * @param {string} message
 * @param {User} user
 */
module.exports = async (
	message,
	user = {}
) => {
	Object.assign(user, {
		username: process.env.TWITTER_USERNAME,
		password: process.env.TWITTER_PASSWORD
	});
	checkNonEmptyString(message);
	checkNonEmptyString(user.username);
	checkNonEmptyString(user.password);

	const browser = await puppeteer.launch({headless: Boolean(true)});
	const page = await browser.newPage();
	await login(page, user);
	await tweet(page, message);
	signale.success('tweeted');
	await browser.close();
};
