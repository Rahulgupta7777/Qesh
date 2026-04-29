const BASE = "https://image.pollinations.ai/prompt";

export const pollImg = (prompt, { width = 800, height = 800, seed = 7, model = "turbo" } = {}) => {
  const encoded = encodeURIComponent(prompt.trim());
  return `${BASE}/${encoded}?width=${width}&height=${height}&seed=${seed}&model=${model}&nologo=true`;
};

const STYLE = "editorial beauty photography, soft natural lighting, minimal composition, muted warm palette, high-end salon aesthetic";

export const qeshImg = (subject, opts = {}) =>
  pollImg(`${subject}, ${STYLE}`, opts);
