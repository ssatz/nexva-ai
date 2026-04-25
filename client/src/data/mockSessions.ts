/*
  mockSessions.ts — canned multi-turn conversations keyed by history id.
  Used by ChatView to hydrate the thread when a History entry is clicked.
*/

import type { ChatMessage } from "@/components/ChatThread";

export interface MockSession {
  title: string;
  /** Short subtitle shown under the title in the thread header. */
  subtitle?: string;
  messages: ChatMessage[];
}

const grokIntro = `Great question — there are roughly four prompt families teams are converging on for video models like Grok, Sora, Runway Gen-3, and Veo. Here is how they compare in practice.

| Method | Strengths | Watch-outs | Best for |
|---|---|---|---|
| **Cinematic shot list** | Director-level control over framing, lens, lighting | Verbose; prone to over-constraint | Brand films, ad spots |
| **Story beats** | Naturally produces motion + narrative arcs | Less control over a specific frame | Trailers, vlogs |
| **Reference + delta** | Lock a look from a still, change only what you want | Requires a strong seed image | Iteration, A/B tests |
| **Style + subject split** | Cleanly separates *what* from *how it feels* | Models sometimes blend the two | Stylized shorts |

If you only remember one rule of thumb: **describe the camera before you describe the subject** — Grok and Veo both anchor heavily on the first 12–18 tokens.`;

const grokExample = `Here is the same idea expressed in each method so you can feel the difference.

**1. Cinematic shot list**

\`\`\`text
Medium close-up, 35mm anamorphic, shallow depth of field.
A barista in a charcoal apron pours steamed milk into a white cup,
slow tilt down to the latte art forming. Warm tungsten key,
cool window fill, subtle film grain, 24fps.
\`\`\`

**2. Story beats**

\`\`\`text
Open on a quiet café at dawn. A barista begins her shift,
calmly preparing the first latte of the day. End on the
finished cup placed on the counter, steam rising.
\`\`\`

**3. Reference + delta**

\`\`\`text
Use the attached still as the look. Animate it: gentle
camera push-in (10%), steam rises, latte art slowly forms.
Keep palette and grain unchanged.
\`\`\`

**4. Style + subject split**

\`\`\`text
SUBJECT: a barista pouring a latte in a small café.
STYLE:   warm 16mm film, soft contrast, muted palette,
         handheld feel, 1970s Japanese coffee commercial.
\`\`\`

For Grok specifically I would start with **#1 (cinematic shot list)** for shots and **#3 (reference + delta)** when iterating — its motion model responds strongly to lens + frame language and to a clean seed still.`;

const grokFollowupAnswer = `Yes — the order matters more than most people expect.

Grok's text encoder gives disproportionate weight to the **first clause**, so the convention I keep coming back to is:

> *Camera & lens → Lighting → Subject → Action → Mood → Tech specs.*

A few smaller tips that compound:

- Keep each clause under ~12 words. Grok stitches clauses; long ones get truncated semantically.
- Use **concrete numbers** (e.g. "35mm", "24fps", "f/2.0") instead of adjectives like "cinematic" — the model maps numbers more reliably.
- Avoid stacking three styles. Two is the sweet spot; three usually averages out into mush.
- End with a single negative clause (e.g. "no text, no logos") rather than a long blacklist.

If you want, I can turn this into a one-page cheat sheet you can paste at the top of every prompt.`;

export const MOCK_SESSIONS: Record<string, MockSession> = {
  h1: {
    title: "Grok Video Prompt Methods Compared",
    subtitle: "A side-by-side look at four prompting styles for Grok-era video models.",
    messages: [
      {
        id: "g-u1",
        role: "user",
        content:
          "Compare the main prompting methods for Grok video generation — which one works best for short product films?",
      },
      { id: "g-a1", role: "assistant", content: grokIntro },
      {
        id: "g-u2",
        role: "user",
        content:
          "Can you show me the same idea (a barista pouring a latte) written in each of those four styles?",
      },
      { id: "g-a2", role: "assistant", content: grokExample },
      {
        id: "g-u3",
        role: "user",
        content:
          "Got it. Does the order of clauses inside the prompt actually matter for Grok?",
      },
      { id: "g-a3", role: "assistant", content: grokFollowupAnswer },
    ],
  },
};
