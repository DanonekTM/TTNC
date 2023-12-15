import fs from 'fs';
import axios from 'axios';
import { uploadFile } from './uploader.js';

async function downloadFile(fileId, ctx) {
	let filePath = '';
	await axios({
		method: "GET",
		url: `https://api.telegram.org/bot${process.env.TOKEN}/getFile?file_id=${fileId}`,
	}).then(function (response) {
		filePath = response.data.result.file_path;
	});
	var fileName = filePath.split("/")[1].toLowerCase();
	await axios({
		method: "GET",
		url: `https://api.telegram.org/file/bot${process.env.TOKEN}/${filePath}`,
		responseType: "stream"
	}).then(function (response) {
		let allowedMIME = [ "png", "jpg", "jpeg", "jpe", "mp4", "m4v" ];
		if (allowedMIME.includes(fileName?.split('.')[1].toLowerCase()))
			console.log("💾 Saving: " + fileName);
			response.data.pipe(fs.createWriteStream(`./downloads/${fileName}`));
	}).finally(() => {
		setTimeout(() => {
			fs.open(`./downloads/${fileName}`, 'r', function (err, fd) {
				if (err) return console.error(err);
				uploadFile(fileName);
			});
		  }, 1000)
		
	});

	ctx.telegram.deleteMessage(ctx.chat.id, ctx.message.message_id);
}

export { downloadFile };