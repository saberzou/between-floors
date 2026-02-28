// Vocabulary data for Between Floors
const VOCAB = {
    story1: {
        title: "Welcome Home",
        words: [
            {
                word: "haul",
                type: "verb",
                pronunciation: "/hɔːl/",
                level: "C1",
                definition: "To pull or drag with effort; to transport something heavy",
                inStory: "Maya hauls the last box into the lobby.",
                examples: [
                    "They had to haul the furniture up three flights of stairs.",
                    "The fishermen hauled in their nets at dawn."
                ],
                synonyms: ["drag", "lug", "pull", "transport"],
                collocations: ["haul something up/down", "haul away", "long haul (over a long period)"]
            },
            {
                word: "conciliatory",
                type: "adjective",
                pronunciation: "/kənˈsɪl.i.ə.tɔːr.i/",
                level: "C2",
                definition: "Intended to make someone less angry or hostile; soothing",
                inStory: "Warm. Almost conciliatory.",
                examples: [
                    "His conciliatory tone helped defuse the tense situation.",
                    "She made a conciliatory gesture to end the argument."
                ],
                synonyms: ["appeasing", "placating", "pacifying", "soothing"],
                related: ["conciliate (verb)", "conciliation (noun)"]
            },
            {
                word: "attentive",
                type: "adjective",
                pronunciation: "/əˈten.tɪv/",
                level: "B2–C1",
                definition: "Paying close attention; watchful and considerate",
                inStory: "A very attentive landlord.",
                examples: [
                    "The attentive waiter noticed our empty glasses immediately.",
                    "She was attentive to every detail of the project."
                ],
                synonyms: ["observant", "alert", "mindful", "vigilant"]
            },
            {
                word: "prudent",
                type: "adjective",
                pronunciation: "/ˈpruː.dənt/",
                level: "C1",
                definition: "Acting with careful thought; wise and sensible",
                inStory: "It would be… prudent.",
                examples: [
                    "It's prudent to save money for emergencies.",
                    "A prudent investor diversifies their portfolio."
                ],
                synonyms: ["wise", "sensible", "judicious", "cautious"]
            },
            {
                word: "vigilant",
                type: "adjective",
                pronunciation: "/ˈvɪdʒ.ɪ.lənt/",
                level: "C1",
                definition: "Keeping careful watch for danger or difficulties",
                inStory: "I'll keep vigilant.",
                examples: [
                    "Security guards must remain vigilant at all times.",
                    "Parents need to be vigilant about online safety."
                ],
                synonyms: ["watchful", "alert", "attentive", "observant"]
            }
        ],
        quiz: [
            {
                context: "Maya <strong>hauls</strong> the last box into the lobby.",
                question: "What does \"haul\" mean?",
                options: [
                    "To throw away",
                    "To pull or drag with effort",
                    "To open carefully",
                    "To organize neatly"
                ],
                correct: 1
            },
            {
                context: "His tone was almost <strong>conciliatory</strong>.",
                question: "Which situation would call for a conciliatory approach?",
                options: [
                    "Celebrating a victory",
                    "Making an angry customer feel better",
                    "Teaching a new skill",
                    "Planning a party"
                ],
                correct: 1
            },
            {
                context: "A very <strong>attentive</strong> landlord.",
                question: "Choose the sentence that uses \"attentive\" correctly:",
                options: [
                    "The doctor was attentive to every symptom the patient described.",
                    "She became more attentive after drinking three cups of coffee.",
                    "The attentive deadline forced us to work faster.",
                    "He gave an attentive presentation about climate change."
                ],
                correct: 0
            },
            {
                context: "It would be… <strong>prudent</strong>.",
                question: "What is the opposite of prudent?",
                options: [
                    "Reckless",
                    "Careful",
                    "Thoughtful",
                    "Wise"
                ],
                correct: 0
            },
            {
                context: "I'll keep <strong>vigilant</strong>.",
                question: "In which situation would being \"vigilant\" be MOST important?",
                options: [
                    "A lifeguard watching swimmers at a busy beach",
                    "A chef preparing ingredients for tonight's menu",
                    "A teacher grading homework assignments",
                    "A musician practicing scales on the piano"
                ],
                correct: 0
            }
        ]
    },

    story2: {
        title: "The 6 AM Shift",
        words: [
            {
                word: "meander",
                type: "verb",
                pronunciation: "/miˈæn.dər/",
                level: "C1",
                definition: "To follow a winding course; to wander without urgency",
                inStory: "Their conversation meanders through comfortable silences and small confessions.",
                examples: [
                    "The river meanders through the valley before reaching the sea.",
                    "We meandered through the old streets, stopping wherever looked interesting."
                ],
                synonyms: ["wander", "drift", "ramble", "stroll"]
            },
            {
                word: "wistful",
                type: "adjective",
                pronunciation: "/ˈwɪst.fəl/",
                level: "C1",
                definition: "Having a feeling of vague or regretful longing",
                inStory: "He has that wistful look again — the one he gets when he talks about his wife.",
                examples: [
                    "She gave a wistful smile as she looked at the old photographs.",
                    "There was something wistful in the way he talked about his childhood home."
                ],
                synonyms: ["longing", "yearning", "nostalgic", "pensive"]
            },
            {
                word: "reticent",
                type: "adjective",
                pronunciation: "/ˈret.ɪ.sənt/",
                level: "C1",
                definition: "Not revealing one's thoughts or feelings readily; reserved",
                inStory: "Maria isn't reticent by nature, but mornings are her quiet hours.",
                examples: [
                    "He's usually reticent about his personal life at work.",
                    "The witness was reticent, answering questions with the fewest words possible."
                ],
                synonyms: ["reserved", "taciturn", "guarded", "tight-lipped"]
            },
            {
                word: "endearing",
                type: "adjective",
                pronunciation: "/ɪnˈdɪr.ɪŋ/",
                level: "C1",
                definition: "Inspiring affection or warm approval",
                inStory: "There's something endearing about a man who lists his cat as an emergency contact.",
                examples: [
                    "Her endearing habit of laughing at her own jokes made everyone smile.",
                    "The puppy's clumsy attempts to climb the stairs were endearing."
                ],
                synonyms: ["charming", "lovable", "adorable", "appealing"]
            },
            {
                word: "tenacity",
                type: "noun",
                pronunciation: "/təˈnæs.ɪ.ti/",
                level: "C1",
                definition: "The quality of holding firmly to something; persistence and determination",
                inStory: "The tenacity it takes to start a 6 AM shift with a smile — Maria has that in abundance.",
                examples: [
                    "Her tenacity in pursuing the project impressed everyone on the team.",
                    "It takes real tenacity to learn a new language as an adult."
                ],
                synonyms: ["persistence", "determination", "resolve", "grit"]
            }
        ],
        quiz: [
            {
                context: "Their conversation <strong>meanders</strong> through comfortable silences.",
                question: "What does \"meander\" suggest about the conversation?",
                options: [
                    "It's tense and difficult",
                    "It wanders naturally without rushing",
                    "It's strictly focused on one topic",
                    "It's ending abruptly"
                ],
                correct: 1
            },
            {
                context: "He has that <strong>wistful</strong> look again.",
                question: "A wistful expression most likely shows someone who is:",
                options: [
                    "Angry about a recent argument",
                    "Confused by something unexpected",
                    "Gently longing for something in the past",
                    "Excited about future plans"
                ],
                correct: 2
            },
            {
                context: "Maria isn't <strong>reticent</strong> by nature.",
                question: "Someone who is reticent would most likely:",
                options: [
                    "Talk openly about their feelings to anyone",
                    "Keep their thoughts and feelings to themselves",
                    "Interrupt others in conversation",
                    "Be the first to volunteer opinions"
                ],
                correct: 1
            },
            {
                context: "There's something <strong>endearing</strong> about him.",
                question: "Which is the best example of something endearing?",
                options: [
                    "A child carefully wrapping a gift with too much tape",
                    "A manager sending a stern email to the team",
                    "A car alarm going off at 3 AM",
                    "A politician giving a rehearsed speech"
                ],
                correct: 0
            },
            {
                context: "The <strong>tenacity</strong> it takes to start every shift with a smile.",
                question: "Tenacity is most important when:",
                options: [
                    "Everything is going smoothly",
                    "You need to relax after a long day",
                    "You face obstacles but keep going anyway",
                    "You want to make a quick decision"
                ],
                correct: 2
            }
        ]
    }
};
