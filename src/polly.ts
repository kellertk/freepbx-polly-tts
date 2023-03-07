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
import { PollyClient, SynthesizeSpeechCommand } from '@aws-sdk/client-polly';
import { writeFile } from 'fs/promises';
import { execSync } from 'child_process';

const main = async () => {
  const { mp3, text, wav } = await argv.argv;
  const response = await new PollyClient({
    region: env.AWS_REGION,
    credentials: {
      accessKeyId: env.AWS_ACCESS_KEY_ID,
      secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
    },
  }).send(
    new SynthesizeSpeechCommand({
      OutputFormat: 'mp3',
      Text: text,
      TextType: 'text',
      VoiceId: 'Ruth',
      Engine: 'neural',
      SampleRate: '8000',
    })
  );
  if (response.AudioStream) {
    const array = await response.AudioStream.transformToByteArray();
    await writeFile(mp3, array);
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
