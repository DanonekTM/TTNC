import { Client, CommandStatus, UploadFilesCommand } from "nextcloud-node-client";
import fs from 'fs';

async function uploadFile(fileName) {
	const client = new Client();

	const files = [
		{
			sourceFileName: `${process.env.DOWNLOADS_PATH}/${fileName}`,
			targetFileName: `/Telegram/${fileName}`
		},
	];
	const uc = new UploadFilesCommand(client, { files });
	await uc.execute();
	const uploadResult = uc.getResultMetaData();

	if (uc.getStatus() === CommandStatus.success) {
		console.log("✅ Uploaded: " + uploadResult.messages[0]);
	} else {
		console.log("❌ Error: " + uploadResult.errors);
	}

	fs.unlink(`${process.env.DOWNLOADS_PATH}/${fileName}`, (err) => {
		if (err) console.log("❌ Error: " + err);
		console.log(`🗑️  ${process.env.DOWNLOADS_PATH}/${fileName} deleted.`);
	});
};

export { uploadFile };