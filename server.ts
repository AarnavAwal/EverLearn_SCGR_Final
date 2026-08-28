import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI, Type } from "@google/genai";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini client lazily
let genAIClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  if (!genAIClient && process.env.GEMINI_API_KEY) {
    try {
      genAIClient = new GoogleGenAI({
        apiKey: process.env.GEMINI_API_KEY,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          }
        }
      });
    } catch (err) {
      console.warn("Could not initialize GoogleGenAI:", err);
    }
  }
  return genAIClient;
}

// Health check
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", timestamp: Date.now() });
});

// AI Performance Summary Endpoint (For both Student and Teacher)
app.post("/api/ai/summarize-performance", async (req, res) => {
  const {
    studentName = "Aarav",
    targetAudience = "student", // 'student' | 'teacher'
    grade = "Class 9",
    section = "Section A",
    overallMastery = 78,
    streakDays = 5,
    points = 385,
    strongTopics = ["Geometry", "Statistics", "Algebra"],
    weakTopics = ["Fractions"],
    topicMasteries = { Geometry: 92, Statistics: 88, Algebra: 84, Fractions: 42 },
    recentImprovement = 12,
    assessmentScores = [
      { title: "Mid-Term Math Check", score: 85, total: 100 },
      { title: "Fractions & Decimals Quiz", score: 55, total: 100 },
      { title: "Algebraic Expressions", score: 88, total: 100 }
    ],
    deficiencies = [
      {
        topic: "Fractions",
        concept: "Adding unlike denominators",
        errorPattern: "Adds numerators and denominators straight across without LCM",
        severity: "critical"
      }
    ]
  } = req.body;

  const client = getGeminiClient();

  if (client) {
    try {
      if (targetAudience === "student") {
        const studentPrompt = `You are a supportive, insightful, and motivating middle-school math learning mentor.
Generate an encouraging, clear, and actionable Child Learning Performance Summary for ${studentName} (${grade}, ${section}).

Student Profile & Data:
- Overall Mastery: ${overallMastery}%
- Learning Streak: ${streakDays} days (${points} XP)
- Strong Topics: ${strongTopics.join(", ")} (e.g., Geometry ${topicMasteries.Geometry || 92}%, Algebra ${topicMasteries.Algebra || 84}%)
- Topics Needing Practice: ${weakTopics.join(", ")} (e.g., Fractions ${topicMasteries.Fractions || 42}%)
- Identified Learning Gap: ${deficiencies.map(d => `${d.topic}: ${d.concept} (${d.errorPattern})`).join("; ")}
- Recent Assessments: ${assessmentScores.map(a => `${a.title}: ${a.score}/${a.total}`).join(", ")}

Guidelines:
- Tone: Positive, clear, empowering, growth-mindset focused.
- Highlight concrete math strengths they excel at.
- Explain the specific math concept they need to work on in simple terms (e.g. why finding common denominators before adding fractions is like finding equal-sized pizza slices).
- Give 3 practical, step-by-step tips they can do today.
- Return ONLY valid JSON matching this schema:
{
  "greeting": "Hey Aarav! Here is your personalized learning overview 🚀",
  "overallVerdict": "You're demonstrating strong spatial and algebraic reasoning, with an exciting opportunity to conquer fractions!",
  "masteryScore": ${overallMastery},
  "keyStrengths": [
    "Geometric visualization and theorem applications (92% mastery)",
    "Solving algebraic equations with single variables (84% mastery)"
  ],
  "focusAreas": [
    "Adding & subtracting fractions with different denominators (like 1/3 + 1/4)"
  ],
  "actionableTips": [
    "Always find the Least Common Multiple (LCM) before adding fraction tops.",
    "Draw quick visual bar diagrams when unsure about fraction sizes.",
    "Do 5 minutes of targeted drill daily to maintain your active streak."
  ],
  "encouragement": "You're only 15 points away from Gold Mastery Tier. Keep up the awesome work!"
}`;

        const response = await client.models.generateContent({
          model: "gemini-3.7-flash",
          contents: studentPrompt,
          config: {
            responseMimeType: "application/json",
            temperature: 0.3,
          }
        });

        if (response.text) {
          const parsed = JSON.parse(response.text);
          return res.json({ success: true, report: parsed, audience: "student", source: "gemini" });
        }
      } else {
        // Teacher Dossier Prompt
        const teacherPrompt = `You are a Senior Pedagogical Learning Specialist and Diagnostic Math Assessor.
Generate a comprehensive, teacher-facing diagnostic performance dossier for ${studentName} (${grade}, ${section}).

Student Diagnostic Data:
- Overall Class Mastery: ${overallMastery}%
- Strong Topics: ${strongTopics.join(", ")} (Mastery: ${JSON.stringify(topicMasteries)})
- Persistent Deficiencies & Gaps: ${JSON.stringify(deficiencies)}
- Assessment Record: ${JSON.stringify(assessmentScores)}
- Learning Activity: ${streakDays} day streak, ${points} XP, ${recentImprovement}% weekly trajectory

Guidelines:
- Tone: Pedagogical, analytical, diagnostic, data-backed, and intervention-oriented.
- Break down cognitive root causes of misconceptions (e.g. over-generalization of whole-number addition rules to fractional arithmetic).
- Provide formative assessment analysis and clear instructional recommendations for classroom and 1-on-1 remediation.
- Return ONLY valid JSON matching this schema:
{
  "executiveSummary": "Aarav exhibits high conceptual grasp in visual Geometry (92%) and structural Algebra (84%), but demonstrates a persistent procedural roadblock in fractional arithmetic (42%).",
  "cognitiveMisconceptions": [
    "Over-generalizes whole number addition: direct summation of numerators and denominators (e.g., 1/3 + 1/4 = 2/7) indicating an ungrounded part-whole model.",
    "Under-utilizes equivalent fraction conversions before executing addition/subtraction operators."
  ],
  "formativeAnalysis": "Completed 4 of 5 scheduled assessments with an average score of 76%. High consistency on visual geometry items, significant drop on fractional computation items.",
  "recommendedInterventions": [
    "Deploy targeted visual manipulative drills using fraction strips or area bar models to reinforce common denominators.",
    "Assign 5-minute daily micro-remediation drills focusing strictly on finding Least Common Denominators (LCD).",
    "Pair with peer explanation exercises where student explains 'why 1/2 + 1/3 cannot be 2/5'."
  ],
  "readinessStatus": "Ready for high-level Algebra with targeted 1-week fraction arithmetic scaffolding.",
  "nextMilestone": "Achieve 80%+ on Fractional Operations Remediation Check"
}`;

        const response = await client.models.generateContent({
          model: "gemini-3.7-flash",
          contents: teacherPrompt,
          config: {
            responseMimeType: "application/json",
            temperature: 0.3,
          }
        });

        if (response.text) {
          const parsed = JSON.parse(response.text);
          return res.json({ success: true, report: parsed, audience: "teacher", source: "gemini" });
        }
      }
    } catch (err) {
      console.warn("Gemini summarization error, falling back to rich heuristic summary:", err);
    }
  }

  // Fallback heuristic summaries
  if (targetAudience === "student") {
    return res.json({
      success: true,
      audience: "student",
      source: "fallback",
      report: {
        greeting: `Hey ${studentName}! Here is your personalized performance report 🌟`,
        overallVerdict: `You are performing strongly in ${strongTopics.join(" and ")} with an overall ${overallMastery}% mastery score.`,
        masteryScore: overallMastery,
        keyStrengths: [
          `Superb performance in ${strongTopics[0] || 'Geometry'} (${topicMasteries.Geometry || 92}% mastery)`,
          `Strong understanding of ${strongTopics[1] || 'Algebra'} foundational equations (${topicMasteries.Algebra || 84}% mastery)`
        ],
        focusAreas: [
          `Mastering ${weakTopics[0] || 'Fractions'}—specifically adding and subtracting fractions with unlike denominators.`
        ],
        actionableTips: [
          "Convert fractions to common denominators before adding or subtracting.",
          "Check answers with quick mental approximations (e.g. 1/2 + 1/3 must be less than 1).",
          "Complete 1 targeted practice set each day to solidify learning."
        ],
        encouragement: "Great learners grow by tackling their tough topics. You are making real progress every day!"
      }
    });
  } else {
    return res.json({
      success: true,
      audience: "teacher",
      source: "fallback",
      report: {
        executiveSummary: `${studentName} demonstrates strong spatial and algebraic competencies (${topicMasteries.Geometry || 92}% in Geometry, ${topicMasteries.Algebra || 84}% in Algebra), with an isolated critical deficiency in fractional arithmetic (${topicMasteries.Fractions || 42}%).`,
        cognitiveMisconceptions: [
          "Direct summation error: adds numerators and denominators straight across (e.g., a/b + c/d = (a+c)/(b+d)).",
          "Difficulty visualizing fractional quantities with unlike denominators without concrete scaffolding."
        ],
        formativeAnalysis: `Completed 4 of 5 term assessments (80% completion rate) with a median score of 77%. Demonstrated fast response times on geometric proofs and delayed response on rational arithmetic.`,
        recommendedInterventions: [
          "Provide visual area model representation for common denominators.",
          "Assign adaptive remediation drills targeting LCM conversion before arithmetic.",
          "Check in during small-group rotations on fractional word problem translation."
        ],
        readinessStatus: "High potential for advanced math once fractional procedural fluency is achieved.",
        nextMilestone: "Achieve 80%+ on Fractions Remediation Drill"
      }
    });
  }
});

// AI Question Generator for Struggling Topics Endpoint
app.post("/api/ai/generate-struggling-questions", async (req, res) => {
  const {
    topic = "Fractions",
    strugglingConcepts = "Adding fractions with different denominators",
    grade = "Class 9",
    count = 5,
    difficulty = "adaptive", // 'remedial' | 'adaptive' | 'mastery'
  } = req.body;

  const client = getGeminiClient();

  if (client) {
    try {
      const prompt = `You are an expert STEM math educator designing precision diagnostic & practice questions.
Generate ${count} dynamic multiple-choice practice questions specifically tailored to help a student who is currently struggling with:
Topic: ${topic}
Struggling Concept / Misconception: ${strugglingConcepts}
Grade Level: ${grade}
Target Mode: ${difficulty}

Rules for Questions:
1. The questions MUST directly test and remediate the specified struggling concept.
2. Provide 4 well-constructed options (A, B, C, D) where incorrect options represent REAL cognitive misconceptions that struggling students commonly make (e.g. adding denominators directly, dropping negative signs, forgetting to multiply both sides).
3. Include a clear, helpful explanation for the correct answer and why the distractors are wrong.
4. Include a gentle hint that prompts conceptual thinking without giving the answer away directly.
5. Return ONLY a valid JSON array of objects with the exact schema:
[
  {
    "id": "q1",
    "question": "What is 2/5 + 1/3?",
    "options": ["3/8", "11/15", "3/15", "2/15"],
    "correctIndex": 1,
    "explanation": "Find LCD of 5 and 3 which is 15. 2/5 = 6/15 and 1/3 = 5/15. 6/15 + 5/15 = 11/15. (3/8 is the error of adding tops and bottoms).",
    "hint": "Find a common denominator that both 5 and 3 divide into evenly."
  }
]`;

      const response = await client.models.generateContent({
        model: "gemini-3.7-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          temperature: 0.5,
        }
      });

      if (response.text) {
        const questions = JSON.parse(response.text);
        if (Array.isArray(questions) && questions.length > 0) {
          return res.json({
            success: true,
            questions: questions.map((q, idx) => ({
              ...q,
              id: q.id || `gen-${Date.now()}-${idx + 1}`
            })),
            source: "gemini",
            topic
          });
        }
      }
    } catch (err) {
      console.warn("Gemini question generation error, falling back to curated bank:", err);
    }
  }

  // Curated diverse question banks by topic
  const questionBanks: Record<string, any[]> = {
    Fractions: [
      {
        id: `q-frac-1-${Date.now()}`,
        question: "Calculate: 1/4 + 2/3 = ?",
        options: ["3/7", "11/12", "3/12", "8/12"],
        correctIndex: 1,
        explanation: "LCD of 4 and 3 is 12. 1/4 = 3/12 and 2/3 = 8/12. 3/12 + 8/12 = 11/12.",
        hint: "Multiply 1/4 by 3/3 and 2/3 by 4/4 to get denominator 12."
      },
      {
        id: `q-frac-2-${Date.now()}`,
        question: "What is 3/5 - 1/2?",
        options: ["2/3", "1/10", "2/10", "4/10"],
        correctIndex: 1,
        explanation: "LCD is 10. 3/5 = 6/10 and 1/2 = 5/10. 6/10 - 5/10 = 1/10.",
        hint: "Convert both fractions to have denominator 10."
      },
      {
        id: `q-frac-3-${Date.now()}`,
        question: "Which step is correct when solving 1/6 + 3/4?",
        options: [
          "Add 1+3 to get 4, and 6+4 to get 10 (4/10)",
          "Convert to 2/12 + 9/12 to get 11/12",
          "Multiply 1/6 by 3/4 to get 3/24",
          "Subtract 6 from 4 to get -2"
        ],
        correctIndex: 1,
        explanation: "Finding LCD 12 gives 2/12 + 9/12 = 11/12. Adding straight across gives incorrect 4/10.",
        hint: "Look for the step that finds a shared common denominator."
      },
      {
        id: `q-frac-4-${Date.now()}`,
        question: "Solve: 2/7 + 3/14 = ?",
        options: ["5/21", "7/14 (or 1/2)", "5/14", "6/14"],
        correctIndex: 1,
        explanation: "2/7 = 4/14. 4/14 + 3/14 = 7/14 = 1/2.",
        hint: "Notice that 14 is a multiple of 7, so you only need to change the first fraction."
      },
      {
        id: `q-frac-5-${Date.now()}`,
        question: "A student wrote: 2/3 + 1/4 = 3/7. What was their mistake?",
        options: [
          "They added the numerators (2+1) and denominators (3+4) directly without finding a common denominator",
          "They should have subtracted instead of adding",
          "They forgot to divide by 2",
          "They converted 2/3 incorrectly to 4/6"
        ],
        correctIndex: 0,
        explanation: "Fractions cannot be added by simply combining tops and bottoms. 2/3 + 1/4 = 8/12 + 3/12 = 11/12.",
        hint: "Look at the numbers: 2+1=3 and 3+4=7."
      }
    ],
    Algebra: [
      {
        id: `q-alg-1-${Date.now()}`,
        question: "Solve for x: 3x - 7 = 14",
        options: ["x = 7", "x = 21", "x = 3", "x = 6"],
        correctIndex: 0,
        explanation: "Add 7 to both sides: 3x = 21. Then divide by 3: x = 7.",
        hint: "First isolate 3x by adding 7 to 14."
      },
      {
        id: `q-alg-2-${Date.now()}`,
        question: "Simplify: -2(3x - 4)",
        options: ["-6x - 8", "-6x + 8", "6x - 8", "-5x + 2"],
        correctIndex: 1,
        explanation: "Distribute -2: (-2 * 3x) + (-2 * -4) = -6x + 8. A negative times a negative equals a positive.",
        hint: "Pay close attention to (-2) multiplied by (-4)."
      },
      {
        id: `q-alg-3-${Date.now()}`,
        question: "If 2(x + 5) = 22, what is x?",
        options: ["x = 6", "x = 11", "x = 16", "x = 7"],
        correctIndex: 0,
        explanation: "Divide both sides by 2: x + 5 = 11. Subtract 5: x = 6.",
        hint: "Divide by 2 first or expand 2x + 10 = 22."
      },
      {
        id: `q-alg-4-${Date.now()}`,
        question: "Combine like terms: 5x + 3y - 2x + 7y",
        options: ["3x + 10y", "13xy", "7x + 10y", "3x - 4y"],
        correctIndex: 0,
        explanation: "Group x terms: 5x - 2x = 3x. Group y terms: 3y + 7y = 10y. Result: 3x + 10y.",
        hint: "Combine the 'x' terms together, and the 'y' terms together separately."
      },
      {
        id: `q-alg-5-${Date.now()}`,
        question: "Solve for y: y/4 + 6 = 11",
        options: ["y = 20", "y = 17", "y = 5", "y = 44"],
        correctIndex: 0,
        explanation: "Subtract 6: y/4 = 5. Multiply both sides by 4: y = 20.",
        hint: "Subtract 6 from 11 first, then multiply by 4."
      }
    ],
    Geometry: [
      {
        id: `q-geo-1-${Date.now()}`,
        question: "In a right triangle, the legs are 6 cm and 8 cm. What is the hypotenuse?",
        options: ["10 cm", "14 cm", "100 cm", "12 cm"],
        correctIndex: 0,
        explanation: "By Pythagorean theorem: 6^2 + 8^2 = 36 + 64 = 100. Sqrt(100) = 10 cm.",
        hint: "Use a^2 + b^2 = c^2."
      },
      {
        id: `q-geo-2-${Date.now()}`,
        question: "What is the sum of interior angles in a hexagon (6-sided polygon)?",
        options: ["720°", "540°", "360°", "1080°"],
        correctIndex: 0,
        explanation: "Formula: (n - 2) * 180°. For n = 6: (6 - 2) * 180° = 4 * 180° = 720°.",
        hint: "Use the polygon interior angle formula (n - 2) * 180°."
      }
    ]
  };

  const selectedList = questionBanks[topic] || questionBanks["Fractions"];
  res.json({
    success: true,
    questions: selectedList,
    source: "curated",
    topic
  });
});

// AI Targeted Practice Generator Endpoint (Legacy & Enhanced)
app.post("/api/ai/generate-practice", async (req, res) => {
  const { topic = "Fractions", gap = "Adding unlike fractions", grade = "Class 9", count = 5 } = req.body;
  
  const client = getGeminiClient();
  if (client) {
    try {
      const prompt = `You are an expert middle-school math educator. Generate ${count} targeted multiple-choice practice questions to directly remediate this specific student learning gap:
Topic: ${topic}
Target Learning Gap: ${gap}
Target Grade: ${grade}

Guidelines:
- Each question must directly target the misconception.
- Provide 4 clear options (A, B, C, D) with realistic distractor answers based on student common errors.
- Include a clear, concise step-by-step explanation (max 2 sentences).
- Return ONLY valid JSON array with objects matching:
[
  {
    "id": "q1",
    "question": "What is 1/3 + 1/4?",
    "options": ["2/7", "7/12", "5/12", "1/7"],
    "correctIndex": 1,
    "explanation": "Find the LCD 12: 4/12 + 3/12 = 7/12. (2/7 is the common mistake of adding tops and bottoms).",
    "hint": "Remember to find a common denominator before adding numerators."
  }
]`;

      const response = await client.models.generateContent({
        model: "gemini-3.7-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          temperature: 0.4,
        }
      });

      if (response.text) {
        const questions = JSON.parse(response.text);
        if (Array.isArray(questions) && questions.length > 0) {
          return res.json({ success: true, questions, source: "gemini" });
        }
      }
    } catch (err) {
      console.warn("Gemini generation error, falling back to curated questions:", err);
    }
  }

  // Fallback curated high quality questions
  const fallbackFractions = [
    {
      id: "q1",
      question: "Calculate: 1/3 + 1/6 = ?",
      options: ["2/9", "3/6 (or 1/2)", "2/6", "1/9"],
      correctIndex: 1,
      explanation: "Convert 1/3 to 2/6. Then 2/6 + 1/6 = 3/6 = 1/2. Do not add 1+1 and 3+6.",
      hint: "Convert 1/3 so both fractions have a denominator of 6."
    },
    {
      id: "q2",
      question: "What is 2/5 + 1/10?",
      options: ["3/15", "5/10 (or 1/2)", "3/10", "2/15"],
      correctIndex: 1,
      explanation: "Convert 2/5 to 4/10. Then 4/10 + 1/10 = 5/10 = 1/2.",
      hint: "Find the least common denominator of 5 and 10, which is 10."
    },
    {
      id: "q3",
      question: "What is the common mistake in: 1/2 + 2/3 = 3/5?",
      options: [
        "Added numerators and denominators directly",
        "Multiplied denominators instead of adding",
        "Forgot to simplify the final fraction",
        "Divided instead of multiplied"
      ],
      correctIndex: 0,
      explanation: "1/2 + 2/3 = 3/6 + 4/6 = 7/6. Adding tops (1+2=3) and bottoms (2+3=5) is incorrect!",
      hint: "Look closely at 1+2=3 and 2+3=5."
    },
    {
      id: "q4",
      question: "Solve: 3/4 - 1/8 = ?",
      options: ["2/4", "5/8", "2/8", "4/8"],
      correctIndex: 1,
      explanation: "3/4 = 6/8. Then 6/8 - 1/8 = 5/8.",
      hint: "Convert 3/4 to an equivalent fraction with 8 as denominator."
    },
    {
      id: "q5",
      question: "Which of the following is equivalent to 2/3 + 1/4?",
      options: ["8/12 + 3/12", "2/7", "3/12", "6/12 + 2/12"],
      correctIndex: 0,
      explanation: "LCD of 3 and 4 is 12. 2/3 = 8/12 and 1/4 = 3/12, giving 11/12.",
      hint: "Multiply 2/3 by 4/4 and 1/4 by 3/3."
    }
  ];

  return res.json({ success: true, questions: fallbackFractions, source: "curated" });
});

// AI Learning Gap Deep Diagnosis Endpoint
app.post("/api/ai/diagnose-gap", async (req, res) => {
  const { topic = "Fractions", avgScore = 42, affectedStudents = 12 } = req.body;
  const client = getGeminiClient();

  if (client) {
    try {
      const prompt = `Provide a concise 2-point teacher learning gap analysis for ${topic} with ${avgScore}% mastery and ${affectedStudents} struggling students. Return JSON with { "detectedGap": string, "recommendedAction": string, "keyMisconception": string } keeping text minimal and punchy.`;
      const response = await client.models.generateContent({
        model: "gemini-3.7-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          temperature: 0.3,
        }
      });
      if (response.text) {
        const result = JSON.parse(response.text);
        return res.json({ success: true, diagnosis: result });
      }
    } catch (err) {
      console.warn("Gemini diagnosis error:", err);
    }
  }

  res.json({
    success: true,
    diagnosis: {
      detectedGap: "Adding unlike fractions without common denominators",
      recommendedAction: "Review LCM finding and equivalent fractions visual model",
      keyMisconception: "Students add numerators and denominators straight across"
    }
  });
});

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Everlearn server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
