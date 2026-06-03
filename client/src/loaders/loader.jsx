function getRandomInt(min, max) {
  const minCeiled = Math.ceil(min);
  const maxFloored = Math.floor(max);
  return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled);
}

export default async function Loader(ms) {
  const minTime = Math.max(0, ms - 1500); 
  const maxTime = ms + 1500;
  const randomDelay = getRandomInt(minTime, maxTime);

  await new Promise(resolve => setTimeout(resolve, getRandomInt(ms-2500,ms+2500)))
  return true;
};