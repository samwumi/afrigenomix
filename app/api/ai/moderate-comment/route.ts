import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import prisma from '@/lib/prisma';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

/**
 * POST /api/ai/moderate-comment
 * Automatically moderate a comment using Google Gemini AI
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

    if (!GEMINI_API_KEY) {
      // If no API key, default to PENDING status
      return NextResponse.json({
        success: true,
        decision: 'PENDING',
        confidence: 0,
        reason: 'AI moderation not configured',
      });
    }

    const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

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

Respond ONLY with valid JSON in this exact format:
{
  "decision": "APPROVED" | "REJECTED" | "SPAM",
  "confidence": 0.95,
  "reason": "brief explanation"
}`;

    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();

    // Parse JSON response
    let moderationResult;
    try {
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No JSON found in response');
      }
      moderationResult = JSON.parse(jsonMatch[0]);
    } catch (parseError) {
      console.error('Failed to parse Gemini response:', text);
      // Default to PENDING if parsing fails
      return NextResponse.json({
        success: true,
        decision: 'PENDING',
        confidence: 0,
        reason: 'Failed to parse AI response',
      });
    }

    // Update comment status if commentId provided
    if (commentId) {
      await prisma.comment.update({
        where: { id: commentId },
        data: { status: moderationResult.decision },
      });
    }

    return NextResponse.json({
      success: true,
      decision: moderationResult.decision,
      confidence: moderationResult.confidence,
      reason: moderationResult.reason,
      cost: 'FREE', // Gemini is free!
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
