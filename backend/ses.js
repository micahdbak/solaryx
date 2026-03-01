const { SESClient, SendEmailCommand } = require("@aws-sdk/client-ses");

const client = new SESClient({ region: "us-east-2" });

async function send_email(to_email, subject, text_content, html_content) {
	const params = {
		Destination: {
			ToAddresses: [to_email]
		},
		Message: {
			Body: {
				Html: {
					Charset: "UTF-8",
					Data: html_content
				},
				Text: {
					Charset: "UTF-8",
					Data: text_content
				}
			},
			Subject: {
				Charset: "UTF-8",
				Data: subject
			}
		},
		Source: `"Solaryx" <no-reply@solaryx.app>`
	};

	const command = new SendEmailCommand(params);

	try {
		const data = await client.send(command);
		console.log(`sent email via AWS SES: ${data.MessageId}`);
		return data;
	} catch (err) {
		console.error(`Failed to send email via AWS SES: ${err}`);
		return null;
	}
}

module.exports = send_email;
