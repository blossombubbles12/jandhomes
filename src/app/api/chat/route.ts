import { NextResponse } from 'next/server';
import Groq from 'groq-sdk';
import { getPortfolioContext, getAssetContext } from '@/lib/ai-context';

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY,
});

export async function POST(request: Request) {
    try {
        const { messages, context } = await request.json(); // context: { page: 'dashboard' | 'asset', assetId?: string }

        // 1. Fetch relevant data based on user context
        let systemContext = "";

        if (context?.page === 'dashboard') {
            const portfolioData = await getPortfolioContext();
            systemContext = `
                You are the Jand Homes AI Assistant, a helpful assistant for Jand Homes Properties in Nigeria.
                
                KNOWLEDGE BASE:
                ${portfolioData}
                
                INSTRUCTIONS:
                - Greet users normally (e.g., "Hello! How can I help you today?").
                - DO NOT include the portfolio summary in your response unless specifically asked about the portfolio, valuations, income, or asset lists.
                - If a user asks a follow-up or meta-question (like "I just said hello"), respond naturally and helpfully.
                - Use "₦" for currency. Keep responses concise.
                - Always be professional and stay focused on real estate and Jand Homes.
            `;
        } else if (context?.page === 'asset' && context?.assetId) {
            const assetData = await getAssetContext(context.assetId);
            systemContext = `
                You are the Jand Homes AI Assistant, currently assisting with a specific property.
                
                PROPERTY DETAILS:
                ${assetData}
                
                INSTRUCTIONS:
                - Greet users naturally.
                - Only discuss the specific details of this property if asked.
                - Keep responses conversational and concise.
                - Use "₦" for currency.
            `;
        } else {
            systemContext = `
                You are the Jand Homes AI Assistant for Jand Homes Properties.
                
                INSTRUCTIONS:
                - Be helpful, conversational, and professional.
                - If unsure, ask for clarification.
                - Only provide in-depth data if the user requests it.
                - Use "₦" for currency.
            `;
        }

        // 2. Call Groq
        const completion = await groq.chat.completions.create({
            messages: [
                { role: 'system', content: systemContext },
                ...messages
            ],
            model: 'llama-3.3-70b-versatile',
            temperature: 0.7,
            max_tokens: 1024,
        });

        const responseContent = completion.choices[0]?.message?.content || "I couldn't generate a response.";

        return NextResponse.json({ role: 'assistant', content: responseContent });

    } catch (error) {
        console.error('AI Error:', error);
        return NextResponse.json({ error: 'Failed to process request' }, { status: 500 });
    }
}
