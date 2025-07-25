import { handler } from './index';

export async function pubsubHandler(event: any) {
  console.log('Pub/Sub message received:', event);
  await handler();
}