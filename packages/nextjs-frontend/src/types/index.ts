// src/types/index.ts
export interface Developer {
    username: string;
    developer_address: string;
    token_address: string;
    analysis: {
        confidence_score: number;
        skills_assessment: {
            validated_skills: string[];
            missing_critical_skills: string[];
            skill_relevance_score: number;
        };
        market_metrics: {
            growth_potential: number;
            suggested_initial_price: string;
            suggested_token_name: string;
            suggested_token_symbol: string;
        };
        investment_thesis: string[];
        risk_factors: string[];
        analyzed_at: string;
        github_url: string;
        initial_skills: string[];
    };
    transaction_hash: string;
}

export interface CreatorToken {
    name: string;
    symbol: string;
    price: number;
    balance: number;
    volume24h: number;
}

export interface CreatorData extends Developer {
    tokenData?: CreatorToken;
    isClaimed: boolean;
}
