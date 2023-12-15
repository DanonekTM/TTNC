import 'dotenv/config';
import express from 'express';
import { Telegraf } from 'telegraf';
import { downloadFile } from './downloader.js';
const app = express();

const { TOKEN, SERVER_URL } = process.env;
const WEBHOOK_URL = SERVER_URL +  `/webhook/${TOKEN}`;

const bot = new Telegraf(TOKEN);
app.use(await bot.createWebhook({ domain: WEBHOOK_URL }));

const usernamesAllowed = [ "YOUR_TELEGRAM_USERNAME_HERE" ];

bot.on("photo", async ctx => {
	if (!usernamesAllowed.includes(ctx.message.from.username)) return; 
	downloadFile(ctx.message.photo[ctx.message.photo.length - 1]?.file_id, ctx);
});

bot.on("video", async ctx => {
	if (!usernamesAllowed.includes(ctx.message.from.username)) return; 
	downloadFile(ctx.message.video.file_id, ctx);
});

bot.on("document", ctx => {
	if (!usernamesAllowed.includes(ctx.message.from.username)) return; 
	downloadFile(ctx.message.document.file_id, ctx);
});

bot.on("text", async ctx => {
	if (!usernamesAllowed.includes(ctx.message.from.username)) return; 

	if (ctx.message.text == "clear")
	{
		for (let i = ctx.message.message_id; i >= ctx.message.message_id - 10; i--) 
		{
			console.log(`chat_id: ${ctx.chat.id}, message_id: ${i}`);
			try {
				let res = await ctx.telegram.deleteMessage(ctx.chat.id, i);
				console.log(res);
			} catch (e) {
				console.error(e);
			}
		}
	}
	
	if (ctx.message.text == "ping")
	{
		ctx.reply('pong');
	}
});

app.listen(process.env.PORT, async () => {
	console.log("🚀 App running on port", process.env.PORT);
	bot.launch();
})

process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));