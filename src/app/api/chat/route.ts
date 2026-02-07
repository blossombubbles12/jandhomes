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
                You are the Jand Homes AI Assistant, a sophisticated real estate analyst for Jand Homes Properties in Nigeria.
                
                CURRENT PORTFOLIO DATA:
                ${portfolioData}
                
                YOUR ROLE:
                - Provide insightful analysis of the portfolio.
                - Answer questions about valuations, rental yields, and asset distribution.
                - Be professional, accurate, and helpful.
                - Use "₦" for currency.
                - FORMATTING: Use Markdown for all responses. Use headers (###), bold text, and bullet points to make information easy to read.
                - ACCURACY: Base your answers ONLY on the provided data. If data is missing, state it clearly.
                - STRICTNESS: Only answer questions related to the Jand Homes asset portfolio and real estate management.
            `;
        } else if (context?.page === 'asset' && context?.assetId) {
            const assetData = await getAssetContext(context.assetId);
            systemContext = `
                You are the Jand Homes AI Assistant, focusing on a specific property within the Jand Homes Properties portfolio.
                
                SPECIFIC ASSET DATA:
                ${assetData}
                
                YOUR ROLE:
                - Help the user understand the performance and details of this specific property.
                - Compare it to the rest of the portfolio if relevant.
                - Suggest improvements or highlight strengths (e.g., high rental yield, prime location).
                - Use "₦" for currency.
                - FORMATTING: Use Markdown (headers, lists, bolding) to ensure clarity and readability.
                - ACCURACY: Stick strictly to the provided asset details.
                - STRICTNESS: Only provide info related to this asset and the company.
            `;
        } else {
            systemContext = `
                You are the Jand Homes AI Assistant for Jand Homes Properties, a real estate company in Nigeria.
                You help managing assets, analyzing data, and providing insights.
                
                YOUR ROLE:
                - Always be professional and helpful.
                - Use Nigerian Naira (₦) for all financial discussions.
                - FORMATTING: Use Markdown to structures your responses nicely.
                - ACCURACY: Ensure all information about the backend and assets is accurate based on company standards.
                - STRICTNESS: Only give responses related to the Jand Homes backend asset manager.
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
