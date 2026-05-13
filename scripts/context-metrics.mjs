export const TOKEN_ESTIMATE_BASIS = "approx_chars_div_4"

export function countWords(text) {
  const withoutCodeFences = text.replace(/```[\s\S]*?```/g, " ")
  return (withoutCodeFences.match(/[A-Za-zÀ-ÿ0-9_'-]+/g) ?? []).length
}

export function estimateTokens(text) {
  return Math.ceil(text.length / 4)
}

export function measureText(text) {
  return {
    chars: text.length,
    words: countWords(text),
    lines: text.split("\n").length,
    estimatedTokens: estimateTokens(text),
    basis: TOKEN_ESTIMATE_BASIS,
  }
}

export function measurePrompt(label, text, extra = {}) {
  return {
    label,
    ...measureText(text),
    ...extra,
  }
}

export function sumPromptMetrics(label, items) {
  return {
    label,
    chars: items.reduce((total, item) => total + item.chars, 0),
    words: items.reduce((total, item) => total + item.words, 0),
    lines: items.reduce((total, item) => total + item.lines, 0),
    estimatedTokens: items.reduce((total, item) => total + item.estimatedTokens, 0),
    basis: TOKEN_ESTIMATE_BASIS,
    itemCount: items.length,
  }
}

export function buildPromptCostEstimate(promptMetrics, extra = {}) {
  return {
    basis: "prompt-only estimate; provider usage not available",
    tokenEstimateBasis: TOKEN_ESTIMATE_BASIS,
    promptTokens: promptMetrics.estimatedTokens,
    completionTokens: "not-recorded",
    totalTokens: "not-recorded",
    usd: "not-recorded",
    ...extra,
  }
}
