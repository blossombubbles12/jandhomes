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
                You are the Jand Homes AI Assistant, a real estate analyst for Jand Homes Properties in Nigeria.
                
                CURRENT PORTFOLIO DATA:
                ${portfolioData}
                
                YOUR ROLE:
                - Be concise and direct. Keep responses to 1-3 sentences unless a detailed analysis is requested.
                - DO NOT start every response with a formal introduction or "Introduction to Jand Homes...". Just answer directly.
                - Use "₦" for currency.
                - FORMATTING: Use Markdown. Use bullet points for lists. Bolding for key figures.
                - ACCURACY: Base answers ONLY on provided data. If unsure, say "I don't have that information."
                - STRICTNESS: Only discuss the Jand Homes portfolio and real estate.
            `;
        } else if (context?.page === 'asset' && context?.assetId) {
            const assetData = await getAssetContext(context.assetId);
            systemContext = `
                You are the Jand Homes AI Assistant, focusing on a specific property within the Jand Homes Properties portfolio.
                
                SPECIFIC ASSET DATA:
                ${assetData}
                
                YOUR ROLE:
                - Be concise. Answer questions specifically about this asset.
                - DO NOT use repetitive introductory text.
                - Use "₦" for currency.
                - FORMATTING: Use Markdown.
                - ACCURACY: Stick strictly to the provided asset details.
                - STRICTNESS: Only provide info related to this asset and the company.
            `;
        } else {
            systemContext = `
                You are the Jand Homes AI Assistant for Jand Homes Properties, Nigeria.
                
                YOUR ROLE:
                - Be concise and helpful. 
                - Use "₦" for currency.
                - DO NOT provide long repetitive generic introductions.
                - FORMATTING: Use Markdown.
                - ACCURACY/STRICTNESS: Only discuss Jand Homes backend and assets.
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
