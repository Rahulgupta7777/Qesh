// Pollinations AI — free, no-auth image generation.
// Same (prompt, seed, size) inputs always produce the same image, so these
// URLs act like stable CDN links the browser can cache.
const BASE = "https://image.pollinations.ai/prompt";

export const pollImg = (prompt, { width = 800, height = 800, seed = 7, model = "flux" } = {}) => {
  const encoded = encodeURIComponent(prompt.trim());
  return `${BASE}/${encoded}?width=${width}&height=${height}&seed=${seed}&model=${model}&nologo=true&enhance=true`;
};

// Shared style suffix so all Qesh images feel consistent.
const STYLE = "editorial beauty photography, soft natural lighting, minimal clean composition, muted warm palette, high-end salon aesthetic, shallow depth of field";

export const qeshImg = (subject, opts = {}) =>
  pollImg(`${subject}, ${STYLE}`, opts);
