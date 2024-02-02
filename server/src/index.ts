import { getApp } from 'server/src/app';

const PORT = 3002;

async function main() {
  const app = await getApp();
  app.listen(PORT, () => {
    console.log(`Listening at ${PORT}`);
  });
}

main();
