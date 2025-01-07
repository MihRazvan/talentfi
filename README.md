# Nexon: The Talent Futures Market

![banner (19)](https://github.com/user-attachments/assets/6abb9ee9-8b39-4564-9bae-4aca8902effe)


**Discover. Invest. Empower.**

Nexon is an AI-driven talent futures market, where creators meet investors, and the future of creative potential is traded. Powered by AI agents and Lens Network, Nexon revolutionizes talent discovery, creator funding, and market-driven innovation.

# Index

1. Why Nexon?
2. How Nexon Works?
3. Agent Architecture
4. Registration Flows
5. User Flow
6. Tech Stack
7. Contracts - TO DO
8. Growth Path
9. Contact

[Demo Video]() | [Prototype App]() | [Slide Deck](https://github.com/MihRazvan/talentfi/blob/main/docs/slide-deck.md) | [Talent Discovery & Analysis Process](https://github.com/MihRazvan/talentfi/blob/main/docs/td-ap.md) | [User Guide](https://github.com/MihRazvan/talentfi/blob/main/docs/user-guide.md) | [Contribution Guide](https://github.com/MihRazvan/talentfi/blob/main/docs/contribution-guide.md) | [Design Files](https://github.com/MihRazvan/talentfi/blob/main/docs/design-files.md)

## Why Nexon?

Talent discovery seems broken. Success is often dictated by followers, social clout, or industry gatekeepers rather than true achiievements and potential. So we asked: Can we make looking for a needle in a stack of hay more efficient today? Nexon is:
- **Analyzing Real Achievements:** AI scouts and validates creators based on measurable outputs (e.g., Github profile, NFT portfolio, music streams, or trading activity), not arbitrary metrics.
- **Creating Peronal Markets:** Trade creator tokens tied to the future prominence of theirs, enabling early supporters to profit while they fund the creators journey.
- **Leveraging Market Efficiency:** If you believe someone is undervalued, trade, prove it and balance the market!
- **Fostering Community Collaboration:** Investors, companies, and creators collaborate and benefit from talent discovery in a thriving ecosystem.

### The Proto-Info Finance

Nexon synthesizes collective intelligence about creator potential into tradable markets. This "proto-info finance" model aligns with concepts outlined in Vitalik Buterin´s [Info Finance](https://vitalik.eth.limo/general/2024/11/09/infofinance.html) and Robin Hanson´s [Prestige Futures](https://www.overcomingbias.com/p/more-academic-prestige-futureshtml).

![content (2)](https://github.com/user-attachments/assets/c9513a98-9a08-41e0-8394-5fa2e05b906c)

## How Nexon Works? Key features

1. **AI-Driven Scouting**
   - Continuously scans platforms like [GitHub](https://github.com/github/rest-api-description), [OpenSea](https://docs.opensea.io/reference/api-overview), [SoundCloud](https://developers.soundcloud.com/docs/api/guide), and [DeBank](https://docs.cloud.debank.com/en) to identify emerging talent.
   - Validate creators by analyzing their achievements and potential.
   - Automate registration, token creation, and onboarding processes, ensured via high performance Lens Network.

3. **Personal Talent Markets**
   - Each creator profile becomes a marketplace of potential.
   - Creator tokens (CT) are issued via quadratic bonding curves for instant liquidity.
   - Investors speculate on creators´ past and future success, driving accurate market valuations.
   - Creators recieve rewards (CR=10%) through trading volume fees from their individual token.
  
4. **Stakeholder Benefits**
   - Investors profit insights, speculate, and brag about scouting tomorrow´s stars from which they earn rewards (SR=2%).
   - Companies and organizations access a vetted talent pool validated by market dynamics and AI.
   - Creators gain visibility, funding, and invaluable market feedback.
  
## Agent Architecture

1. **Discovery Agent**
   - Scans GitHub using predefined search queries.
   - Filters developers based on minimum criteria (stars, followers, etc.).
   - Maintains discovery queue and avoids duplicates.
  
2. **Analysis Agent**
   - Processes GitHub data.
   - Runs GPT-4 analysis on developer´s work.
   - Produces standardized assessment report.
   - Sets initial token parameters.

3. **Registration Agent**
   - Handles onchain profile creation.
   - Deploys creator tokens via contracts.
   - Manages token initialization.
   - Stores metadata for frontend.

## Registration Flows

1. **Automatic**
   - Discovery Agent finds developer.
   - Analysis Agent validates profile.
   - Registration Agent creates profile & token.
   - Profile and rewards remains unclaimed (reserved) until developer verifies ownership.

2. **Manual**
   - Developer inputs GitHub username.
   - Analysis Agent runs same validation process.
   - If approved:
       - Profile created.
       - Token deployed.
       - Automatically claimed if developer initiated, otherwise stays unclaimed (reserved) and Scout recieves the future reward claim.
   - If rejected:
       - Detailed feedback provided.

## User Flow

![user flow (6)](https://github.com/user-attachments/assets/4d848e3f-ec64-4439-a614-39225d6deb39)

## Tech Stack

![tech stack (2)](https://github.com/user-attachments/assets/1314f0e8-a442-4d1a-9440-8e9d2e7401fe)

## Contracts

## Growth Path

Nexon begins with developers, the most quantifiable talent pool.

**Stage 1:** Developers (GitHub API)

**Stage 2:** NFT-Creators (OpenSea API)

**Stage 3:** Musicians (SoundCloud API)

**Stage 4:** Traders (DeBank API)

## Contact

**Email:** jensei.eth@protonmail.com / razvan.mihailescu1996@gmail.com

**Twitter:** [jensei_](https://x.com/jensei_) / [magentoooo](https://x.com/magentoooo)

**Lens:** [jensei](https://www.lensfrens.xyz/jensei) / [magento](https://www.lensfrens.xyz/magento)
