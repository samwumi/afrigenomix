import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import prisma from '@/lib/prisma';

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

/**
 * POST /api/ai/moderate-comment
 * Automatically moderate a comment using AI
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { commentId, name, email, content } = body;

    if (!content) {
      return NextResponse.json(
        { success: false, error: 'Content is required' },
        { status: 400 }
      );
    }

    if (!OPENAI_API_KEY) {
      // If no API key, default to PENDING status
      return NextResponse.json({
        success: true,
        decision: 'PENDING',
        confidence: 0,
        reason: 'AI moderation not configured',
      });
    }

    const openai = new OpenAI({
      apiKey: OPENAI_API_KEY,
    });

    const prompt = `You are a content moderator for Afrigenomix, a DNA testing platform.

Analyze this comment and determine if it should be APPROVED, REJECTED, or SPAM:

Name: ${name}
Email: ${email}
Content: ${content}

Criteria:
SPAM if:
- Contains URLs (except legitimate questions about DNA testing)
- Promotional content
- Gibberish or random characters
- Copy-pasted generic comments
- Contains offensive language

REJECT if:
- Medical advice or diagnoses
- Hate speech or discrimination
- Personal attacks
- Misinformation about DNA testing

APPROVE if:
- Genuine question or comment
- Personal experience sharing
- Constructive feedback
- Related to DNA testing topics

Respond ONLY with JSON:
{
  "decision": "APPROVED" | "REJECTED" | "SPAM",
  "confidence": 0.0-1.0,
  "reason": "brief explanation"
}`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are a content moderation AI. Respond only with valid JSON.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.3,
      max_tokens: 200,
      response_format: { type: 'json_object' },
    });

    const result = JSON.parse(completion.choices[0]?.message?.content || '{}');

    // Update comment status if commentId provided
    if (commentId) {
      await prisma.comment.update({
        where: { id: commentId },
        data: { status: result.decision },
      });
    }

    return NextResponse.json({
      success: true,
      decision: result.decision,
      confidence: result.confidence,
      reason: result.reason,
      cost: ((completion.usage?.total_tokens || 0) * 0.000001).toFixed(6),
    });
  } catch (error) {
    console.error('Comment moderation error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Moderation failed',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
