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
    }
};
