import { load } from 'ts-dotenv';
const env = load({
  AWS_ACCESS_KEY_ID: String,
  AWS_SECRET_ACCESS_KEY: String,
  AWS_REGION: String,
});
import yargs from 'yargs/yargs';
const argv = yargs(process.argv).options({
  mp3: { type: 'string', demandOption: true },
  text: { type: 'string', demandOption: true },
  wav: { type: 'string', demandOption: true },
});
import { writeFileSync } from 'fs';
import { execSync } from 'child_process';
import AWS from 'aws-sdk';

AWS.config.update({
  region: env.AWS_REGION,
  credentials: {
    accessKeyId: env.AWS_ACCESS_KEY_ID,
    secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
  },
});

const main = async () => {
  const { mp3, text, wav } = await argv.argv;
  const polly = new AWS.Polly();
  const response = await polly
    .synthesizeSpeech({
      OutputFormat: 'mp3',
      SampleRate: '8000',
      Text: text,
      TextType: 'text',
      VoiceId: 'Ruth',
      Engine: 'neural',
    })
    .promise();
  if (response.AudioStream instanceof Buffer) {
    const array = response.AudioStream;
    writeFileSync(mp3, array);
    execSync(`lame --decode ${mp3} -b 8000 ${wav}`);
    execSync(`rm -f ${mp3}`);
  }
};

(async () => {
  await main();
})().catch(e => {
  console.error(`Error: ${String(e)}`);
  // eslint-disable-next-line no-process-exit
  process.exit(1);
});
