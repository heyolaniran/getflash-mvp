
'use server'

import { createClient } from '@/lib/supabase/server'

export async function getAiSavingsRecommendation() {
    const supabase = await createClient()

    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
        return { error: 'Unauthorized' }
    }

    // 1. Fetch transaction history for "analysis"
    const { data: transactions, error } = await supabase
        .from('sats_transactions')
        .select('amount, type, created_at')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(20)

    if (error) {
        return { error: 'Failed to fetch transaction history' }
    }

    // 2. Mock "AI Logic" - In a real app, this would be a call to an ML model or LLM
    // We'll simulate analyzing transaction frequency and volatility.

    const totalVolume = transactions?.reduce((sum, tx) => sum + Number(tx.amount), 0) || 0;
    const frequency = transactions?.length || 0;

    // Simulate "Market Volatility" index (0-100)
    const marketVolatility = 65;

    let recommendation = 0;
    let explanation = "";

    if (marketVolatility > 50) {
        // High volatility: Suggest saving more in StableSats
        recommendation = Math.min(Math.round(40 + (frequency * 0.5)), 90);
        explanation = `Bitcoin volatility is high (${marketVolatility}%). Based on your ${frequency} recent transactions, I recommend increasing your savings to ${recommendation}% to protect your fiat liquidity while keeping a healthy BTC exposure for growth.`;
    } else {
        // Low volatility: Suggest keeping more in BTC
        recommendation = 20;
        explanation = `Market conditions are stable. You have a steady volume of ${totalVolume} sats. You can afford to lower your savings to ${recommendation}% to maximize your long-term Bitcoin accumulation.`;
    }

    return {
        recommendation,
        explanation,
        analysisResult: {
            volume: totalVolume,
            count: frequency,
            volatility: marketVolatility
        }
    }
}
