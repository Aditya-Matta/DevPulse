const OpenAI = require('openai');

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

/**
 * Analyses an array of interview objects and returns 3 weakness clusters.
 * @param {Array} interviews
 * @returns {{ weaknesses: Array<{ topic: string, diagnosis: string, studyPlan: string[] }> }}
 */
const analyseInterviews = async (interviews) => {
  const prompt = `You are a technical interview coach. A developer has logged the following interviews:
${JSON.stringify(interviews, null, 2)}

Analyse their weak areas and respond ONLY in this JSON format:
{
  "weaknesses": [
    {
      "topic": "string",
      "diagnosis": "string (2 sentences)",
      "studyPlan": ["item1", "item2", "item3", "item4", "item5"]
    }
  ]
}
Return exactly 3 weakness objects. No preamble, no markdown, raw JSON only.`;

  const response = await client.chat.completions.create({
    model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
    messages: [{ role: 'user', content: prompt }],
    max_tokens: 1024,
    response_format: { type: 'json_object' },
  });

  const text = response.choices[0].message.content.trim();
  const parsed = JSON.parse(text);

  if (!parsed.weaknesses || !Array.isArray(parsed.weaknesses)) {
    throw new Error('Invalid AI response structure');
  }

  return parsed;
};

module.exports = { analyseInterviews };
