/** @format */

import { Context } from 'hono';
import userModel from './user-schema';
import bcrypt from 'bcrypt';
import CommonUtils from '../../utils/common-utils';
import crypto from 'crypto';
import { Spot } from '@binance/connector';
import { streamSSE } from 'hono/streaming';
namespace UserController {
	export const signUp = async (ctx: Context) => {
		try {
			let payload = await ctx.req.json();
			const user = await userModel.find({
				email: payload.email.toLowerCase(),
			});

			if (user.length > 0) {
				return ctx.json({ message: 'User already exists', status: 400 }, 200);
			}
			const saltRounds = 10;
			const hashPassword = await bcrypt.hash(payload.password, saltRounds);

			const newUser = await userModel.create({
				username: payload.name,
				email: payload.email,
				password: hashPassword,
			});

			if (newUser) {
				const token = await CommonUtils.setUserCookie(newUser, ctx);
				return ctx.json({
					status: 200,
					user: { username: newUser.username, email: newUser.email },
					token: token,
				});
			}

			return ctx.json({ status: 201, user: newUser }, 201);
		} catch (err) {
			console.log(err);
			return ctx.json({ message: 'Internal server error', status: 500 }, 500);
		}
	};

	export const signIn = async (ctx: Context) => {
		try {
			let payload = await ctx.req.json();

			if (payload.googleId) {
				const existUser = await userModel.findOne({
					googleId: payload.googleId,
				});

				if (existUser) {
					const token = await CommonUtils.setUserCookie(existUser, ctx);
					return ctx.json({
						status: 200,
						user: { username: existUser.username, email: existUser.email },
						token: token,
					});
				}

				const newUser = await userModel.create({
					username: payload.name,
					email: payload.email,
					googleId: payload.googleId,
				});
				const token = await CommonUtils.setUserCookie(newUser, ctx);
				return ctx.json({
					status: 200,
					user: { username: newUser.username, email: newUser.email },
					token: token,
				});
			}

			const user = await userModel.findOne({
				email: payload.email.toLowerCase(),
			});

			if (!user) {
				return ctx.json({ message: 'User not found', status: 400 }, 404);
			}

			const isPasswordValid = await bcrypt.compare(
				payload.password,
				user.password
			);

			if (!isPasswordValid) {
				return ctx.json({ message: 'Invalid password', status: 400 }, 400);
			}

			if (isPasswordValid) {
				const token = await CommonUtils.setUserCookie(user, ctx);
				return ctx.json(
					{
						status: 201,
						user: { username: user.username, email: user.email },
						token,
					},
					200
				);
			}
		} catch (err) {
			console.log(err);
			return ctx.json({ message: 'Internal server error', status: 500 }, 500);
		}
	};

	const generateSignature = (payload, timestamp, nonce, apiSecret) => {
		const signaturePayload =
			timestamp + '\n' + nonce + '\n' + JSON.stringify(payload) + '\n';
		return crypto
			.createHmac('sha512', apiSecret)
			.update(signaturePayload)
			.digest('hex');
	};

	const generateNonce = () => {
		return crypto.randomBytes(32).toString('hex');
	};

	export const testBinanceApi = async (ctx: Context) => {
		try {
			const timestamp = Date.now().toString();
			const generateNonce = () => {
				const length = 32;
				const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
				let nonce = '';
				for (let i = 0; i < length; i++) {
					const randomIndex = Math.floor(Math.random() * chars.length);
					const randomChar = chars.charAt(randomIndex);
					nonce += randomChar;
				}
				return nonce;
			};

			const nonce = generateNonce();
			console.log('nonce', nonce);
			const payload = {
				env: {
					terminalType: 'APP',
				},
				orderTags: {
					ifProfitSharing: true,
				},
				merchantTradeNo: Date.now().toString(),
				orderAmount: parseFloat('1.00'),
				currency: 'USDT',
				description: 'Sample Order',
				goods: {
					goodsType: '01',
					goodsCategory: 'D000',
					referenceGoodsId: '7876763A3B',
					goodsName: 'Ice Cream',
					goodsDetail: 'Greentea ice cream cone',
				},
			};

			const API_KEY = process.env.API_KEY;
			const API_SECRET = process.env.SECRET_KEY;

			const signature = generateSignature(
				payload,
				timestamp,
				nonce,
				process.env.SECRET_KEY
			);

			const response = await fetch(
				'https://bpay.binanceapi.com/binancepay/openapi/v3/order',
				{
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
						'BinancePay-Timestamp': timestamp,
						'BinancePay-Nonce': nonce,
						'BinancePay-Certificate-SN':
							API_KEY ||
							'4IAL9JpxNjd458dUhMGKCE2hECdtjbTH0ZmgZYjq8q9zCjiSEvwOiiTs5No2JCqi',
						'BinancePay-Signature': signature,
					},
					body: JSON.stringify(payload),
				}
			);

			const data = await response.json();
			console.log('data', data);
			return ctx.json({ data });
		} catch (error) {
			console.log(error);
			return ctx.json({
				message: `${error.message}`,
				status: 500,
			});
		}
	};

	export const testbc = (ctx: Context) => {
		try {
			const apiKey = process.env.API_KEY;
			const apiSecret = process.env.SECRET_KEY;
			const client = new Spot(apiKey, apiSecret);

			client.account().then((response) => client.logger.log("account",response.data));

			// Place a new order
			client
				.newOrder('BNBUSDT', 'BUY', 'LIMIT', {
					price: '350',
					quantity: 1,
					timeInForce: 'GTC',
				})
				.then((response) => client.logger.log("response:",response.data))
				.catch((error) => client.logger.error(error));
		} catch (error) {
			return ctx.json({
				message: `${error.message}`,
				status: 500,
			});
		}
	};
}

export default UserController;
