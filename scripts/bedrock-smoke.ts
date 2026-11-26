/**
 * Smoke test for AWS Bedrock access. Run: npm run smoke:bedrock
 * Needs AWS_REGION, AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, BEDROCK_MODEL_ID in .env.local.
 * Uses the Converse API, so it works for any Anthropic model ID or inference profile ID.
 */
import { BedrockRuntimeClient, ConverseCommand } from "@aws-sdk/client-bedrock-runtime";

async function main() {
  const { AWS_REGION, BEDROCK_MODEL_ID } = process.env;
  if (!AWS_REGION || !BEDROCK_MODEL_ID || !process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY) {
    console.error("Missing AWS_REGION, AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY or BEDROCK_MODEL_ID");
    process.exit(1);
  }
  const client = new BedrockRuntimeClient({ region: AWS_REGION });
  const started = Date.now();
  const out = await client.send(
    new ConverseCommand({
      modelId: BEDROCK_MODEL_ID,
      messages: [{ role: "user", content: [{ text: "Trả lời đúng một từ: OK" }] }],
      inferenceConfig: { maxTokens: 20, temperature: 0 },
    })
  );
  const text = out.output?.message?.content?.map((c) => c.text ?? "").join("") ?? "";
  console.log(`OK in ${Date.now() - started}ms | model=${BEDROCK_MODEL_ID} | reply=${JSON.stringify(text)}`);
  console.log(`tokens in=${out.usage?.inputTokens} out=${out.usage?.outputTokens}`);
}

main().catch((e: unknown) => {
  console.error("Bedrock call failed:", e instanceof Error ? `${e.name}: ${e.message}` : e);
  process.exit(1);
});
