export interface Standard {
  code: string;
  description: string;
}

export const CCSS_WRITING_STANDARDS: Record<string, Standard[]> = {
  K: [
    // Writing Standards
    { code: 'W.K.1', description: 'Use a combination of drawing, dictating, and writing to compose opinion pieces that tell the reader the topic or book and state an opinion or preference.' },
    { code: 'W.K.2', description: 'Use a combination of drawing, dictating, and writing to compose informative/explanatory texts that name the topic and supply information.' },
    { code: 'W.K.3', description: 'Use a combination of drawing, dictating, and writing to narrate a single event or loosely linked events, tell about the events in order, and provide a reaction.' },
    { code: 'W.K.5', description: 'With guidance and support from adults, respond to questions and suggestions from peers and add details to strengthen writing.' },
    { code: 'W.K.6', description: 'With guidance and support from adults, explore a variety of digital tools to produce and publish writing.' },
    // Language Standards
    { code: 'L.K.1', description: 'Demonstrate command of the conventions of standard English grammar: print many upper- and lowercase letters; use frequently occurring nouns and verbs; form regular plural nouns orally; use question words; use the most frequently occurring prepositions.' },
    { code: 'L.K.2', description: 'Demonstrate command of conventions: capitalize the first word in a sentence and the pronoun I; recognize and name end punctuation; write a letter or letters for most consonant and short-vowel sounds; spell simple words phonetically.' },
    { code: 'L.K.4', description: 'Determine or clarify the meaning of unknown and multiple-meaning words and phrases based on kindergarten reading and content.' },
    { code: 'L.K.6', description: 'Use words and phrases acquired through conversations, reading, and being read to, and responding to texts.' },
  ],

  '1': [
    { code: 'W.1.1', description: 'Write opinion pieces that introduce the topic or book, state an opinion, supply a reason, and provide a sense of closure.' },
    { code: 'W.1.2', description: 'Write informative/explanatory texts that name the topic, supply some facts, and provide a sense of closure.' },
    { code: 'W.1.3', description: 'Write narratives that recount two or more appropriately sequenced events, include details, use temporal words, and provide a sense of closure.' },
    { code: 'W.1.5', description: 'With guidance and support from adults, focus on a topic, respond to questions and suggestions from peers, and add details to strengthen writing.' },
    { code: 'W.1.6', description: 'With guidance and support from adults, use a variety of digital tools to produce and publish writing.' },
    { code: 'L.1.1', description: 'Demonstrate command of conventions: print all upper- and lowercase letters; use common, proper, and possessive nouns; use singular and plural nouns with matching verbs; use personal, possessive, and indefinite pronouns; use verbs to convey tense; use adjectives; use conjunctions; use determiners; use frequently occurring prepositions; produce and expand sentences.' },
    { code: 'L.1.2', description: 'Demonstrate command of conventions: capitalize dates and names; use end punctuation; use commas in dates and lists; use conventional spelling for words with common spelling patterns; spell untaught words phonetically.' },
    { code: 'L.1.4', description: 'Determine or clarify the meaning of unknown and multiple-meaning words and phrases, using context clues, affixes, and reference materials.' },
    { code: 'L.1.6', description: 'Use words and phrases acquired through conversations, reading, and being read to, and responding to texts, including words that express feelings and ideas.' },
  ],

  '2': [
    { code: 'W.2.1', description: 'Write opinion pieces that introduce the topic or book, state an opinion, supply reasons, use linking words (because, and, also), and provide a concluding statement.' },
    { code: 'W.2.2', description: 'Write informative/explanatory texts that introduce the topic, use facts and definitions, and provide a concluding statement.' },
    { code: 'W.2.3', description: 'Write narratives that recount a well-elaborated event or sequence, include details, use temporal words, and provide a sense of closure.' },
    { code: 'W.2.5', description: 'With guidance and support from adults and peers, focus on a topic and strengthen writing by revising and editing.' },
    { code: 'W.2.6', description: 'With guidance and support from adults, use a variety of digital tools to produce and publish writing.' },
    { code: 'L.2.1', description: 'Demonstrate command of conventions: use collective nouns; form and use frequently occurring irregular plural nouns; use reflexive pronouns; form and use the past tense of frequently occurring irregular verbs; use adjectives and adverbs; produce, expand, and rearrange complete sentences.' },
    { code: 'L.2.2', description: 'Demonstrate command of conventions: capitalize holidays, product names, and geographic names; use commas in greetings and closings; use an apostrophe to form contractions and possessives; generalize learned spelling patterns; consult reference materials for spelling.' },
    { code: 'L.2.3', description: 'Use knowledge of language and its conventions when writing: compare formal and informal uses of English.' },
    { code: 'L.2.4', description: 'Determine or clarify the meaning of unknown and multiple-meaning words and phrases using context clues, affixes, and reference materials.' },
    { code: 'L.2.6', description: 'Use words and phrases acquired through conversations, reading, and being read to, and responding to texts, including adjectives and adverbs.' },
  ],

  '3': [
    { code: 'W.3.1', description: 'Write opinion pieces that introduce the topic, state an opinion, supply reasons supported by facts and details, use linking words (because, therefore, since, for example), and provide a concluding statement.' },
    { code: 'W.3.2', description: 'Write informative/explanatory texts that introduce the topic, use facts, definitions, and details, use linking words (also, another, and, more, but), and provide a concluding statement.' },
    { code: 'W.3.3', description: 'Write narratives that establish a situation and narrator/characters, use dialogue and description, use temporal words and phrases, and provide a sense of closure.' },
    { code: 'W.3.4', description: 'With guidance and support from adults, produce writing in which development and organization are appropriate to task and purpose.' },
    { code: 'W.3.5', description: 'With guidance and support from peers and adults, develop and strengthen writing by planning, revising, and editing.' },
    { code: 'W.3.6', description: 'With guidance and support from adults, use technology to produce and publish writing as well as interact and collaborate with others.' },
    { code: 'L.3.1', description: 'Demonstrate command of conventions: explain function of nouns, pronouns, verbs, adjectives, adverbs; form and use regular and irregular plural nouns; use abstract nouns; form and use regular and irregular verbs; form and use simple verb tenses; ensure subject-verb and pronoun-antecedent agreement; form and use comparative and superlative adjectives and adverbs; use coordinating and subordinating conjunctions; produce simple, compound, and complex sentences.' },
    { code: 'L.3.2', description: 'Demonstrate command of conventions: capitalize appropriate words in titles; use commas in addresses, compound sentences, and after introductory phrases; use apostrophes in contractions and possessives; generalize learned spelling patterns; consult reference materials for spelling.' },
    { code: 'L.3.3', description: 'Use knowledge of language and its conventions when writing: choose words and phrases for effect; recognize differences between spoken and written English.' },
    { code: 'L.3.4', description: 'Determine or clarify the meaning of unknown and multiple-meaning words and phrases using context clues, affixes, and reference materials.' },
    { code: 'L.3.6', description: 'Acquire and use accurately grade-appropriate conversational, general academic, and domain-specific words and phrases.' },
  ],

  '4': [
    { code: 'W.4.1', description: 'Write opinion pieces that introduce the topic, state an opinion, provide reasons supported by facts and details, link opinion and reasons using words and phrases (for instance, in order to, in addition), and provide a concluding statement.' },
    { code: 'W.4.2', description: 'Write informative/explanatory texts that introduce the topic clearly, group related information in paragraphs, include formatting, illustrations, and multimedia, use precise language, and provide a concluding statement.' },
    { code: 'W.4.3', description: 'Write narratives that orient the reader, use dialogue and description, use transitional words and phrases, use concrete words and sensory details, and provide a conclusion.' },
    { code: 'W.4.4', description: 'Produce clear and coherent writing in which development, organization, and style are appropriate to task, purpose, and audience.' },
    { code: 'W.4.5', description: 'With guidance and support, develop and strengthen writing by planning, revising, and editing, trying a new approach if needed.' },
    { code: 'W.4.6', description: 'With guidance and support, use technology to produce and publish writing and to interact and collaborate with others.' },
    { code: 'L.4.1', description: 'Demonstrate command of conventions: use relative pronouns and adverbs; form and use progressive verb tenses; use modal auxiliaries; order adjectives; form and use prepositional phrases; produce complete sentences; correct inappropriate shifts in tense; use frequently confused words correctly.' },
    { code: 'L.4.2', description: 'Demonstrate command of conventions: use correct capitalization; use commas and quotation marks to mark direct speech and quotations; use a comma before a coordinating conjunction in a compound sentence; spell grade-appropriate words correctly.' },
    { code: 'L.4.3', description: 'Use knowledge of language and its conventions: choose words and phrases for effect; recognize and explain differences between conventions of spoken and written English; differentiate contexts requiring formal and informal English.' },
    { code: 'L.4.4', description: 'Determine or clarify the meaning of unknown and multiple-meaning words and phrases using context clues, affixes, and reference materials including dictionaries.' },
    { code: 'L.4.6', description: 'Acquire and use accurately grade-appropriate general academic and domain-specific words and phrases.' },
  ],

  '5': [
    { code: 'W.5.1', description: 'Write opinion pieces that introduce the topic clearly, logically order reasons with facts and details, link opinion and reasons using words, phrases, and clauses (consequently, specifically), and provide a concluding statement.' },
    { code: 'W.5.2', description: 'Write informative/explanatory texts that introduce the topic, provide general observations, develop the topic with facts, definitions, concrete details, quotations, and examples; use linking words and phrases; use precise language; provide a concluding statement.' },
    { code: 'W.5.3', description: 'Write narratives that orient the reader, use narrative techniques (dialogue, description, pacing), use transitional words, phrases, and clauses, use concrete words and sensory language, and provide a conclusion.' },
    { code: 'W.5.4', description: 'Produce clear and coherent writing in which development, organization, and style are appropriate to task, purpose, and audience.' },
    { code: 'W.5.5', description: 'With guidance and support from peers and adults, develop and strengthen writing by planning, revising, editing, rewriting, or trying a new approach.' },
    { code: 'W.5.6', description: 'With guidance and support, use technology to produce and publish writing and to interact and collaborate with others; demonstrate sufficient command of keyboarding skills.' },
    { code: 'L.5.1', description: 'Demonstrate command of conventions: explain function of conjunctions, prepositions, and interjections; form and use perfect verb tenses; use verb tense to convey time, sequence, state, and condition; recognize and correct inappropriate shifts in verb tense; use correlative conjunctions.' },
    { code: 'L.5.2', description: 'Demonstrate command of conventions: use punctuation to separate items in a series; use a comma to separate introductory elements; use a comma to set off words in direct address; use underlining, quotation marks, or italics for titles; spell grade-appropriate words correctly.' },
    { code: 'L.5.3', description: 'Use knowledge of language and its conventions: expand, combine, and reduce sentences for meaning, interest, and style; compare and contrast varieties of English used in stories and dialogs.' },
    { code: 'L.5.4', description: 'Determine or clarify the meaning of unknown and multiple-meaning words and phrases using context clues, affixes, and reference materials.' },
    { code: 'L.5.5', description: 'Demonstrate understanding of figurative language, word relationships, and nuances in word meanings.' },
    { code: 'L.5.6', description: 'Acquire and use accurately grade-appropriate general academic and domain-specific words and phrases.' },
  ],

  '6': [
    { code: 'W.6.1', description: 'Write arguments to support claims with clear reasons and relevant evidence; introduce the claim; support with logical reasoning and evidence; use credible sources; use words and phrases to create cohesion; provide a concluding statement.' },
    { code: 'W.6.2', description: 'Write informative/explanatory texts to examine a topic; introduce a topic with a thesis; organize ideas using strategies such as definition, classification, comparison; develop topics with relevant facts, definitions, concrete details, quotations, and examples; use transitions; use precise language and domain-specific vocabulary; provide a concluding statement.' },
    { code: 'W.6.3', description: 'Write narratives to develop real or imagined experiences; engage the reader; use narrative techniques (dialogue, pacing, description); use varied transitions and sentence structures; use precise words and sensory language; provide a conclusion.' },
    { code: 'W.6.4', description: 'Produce clear and coherent writing in which development, organization, and style are appropriate to task, purpose, and audience.' },
    { code: 'W.6.5', description: 'With guidance and support from peers and adults, develop and strengthen writing by planning, revising, editing, rewriting, or trying a new approach.' },
    { code: 'W.6.6', description: 'Use technology to produce and publish writing and present relationships between information and ideas; demonstrate sufficient command of keyboarding skills.' },
    { code: 'L.6.1', description: 'Demonstrate command of conventions: ensure that pronouns are in the proper case; recognize and correct vague pronouns; recognize and correct inappropriate shifts in pronoun number and person; recognize and correct inappropriate shifts in verb voice and mood; recognize variations from standard English in own writing.' },
    { code: 'L.6.2', description: 'Demonstrate command of conventions: use punctuation (commas, parentheses, dashes) to set off nonrestrictive/parenthetical elements; spell correctly.' },
    { code: 'L.6.3', description: 'Use knowledge of language and its conventions: vary sentence patterns for meaning, reader interest, and style; maintain consistency in style and tone.' },
    { code: 'L.6.4', description: 'Determine or clarify the meaning of unknown and multiple-meaning words and phrases using context clues, affixes, and reference materials.' },
    { code: 'L.6.5', description: 'Demonstrate understanding of figurative language, word relationships, and nuances in word meanings.' },
    { code: 'L.6.6', description: 'Acquire and use accurately grade-appropriate general academic and domain-specific words and phrases.' },
  ],

  '7': [
    { code: 'W.7.1', description: 'Write arguments to support claims with clear reasons and relevant evidence; introduce a claim and distinguish it from alternate or opposing claims; support with logical reasoning and relevant evidence; use credible sources; use transitions; establish and maintain a formal style; provide a concluding statement.' },
    { code: 'W.7.2', description: 'Write informative/explanatory texts; introduce topics clearly, previewing what is to follow; organize ideas using strategies; develop topics with relevant facts, definitions, details, quotations, and examples; use appropriate transitions; use precise language and domain-specific vocabulary; establish and maintain a formal style; provide a concluding statement.' },
    { code: 'W.7.3', description: 'Write narratives; engage and orient the reader; use narrative techniques (dialogue, pacing, description, reflection); use varied transitions; use precise words and sensory language; provide a conclusion that reflects on the narrated experiences.' },
    { code: 'W.7.4', description: 'Produce clear and coherent writing in which development, organization, and style are appropriate to task, purpose, and audience.' },
    { code: 'W.7.5', description: 'With guidance and support, develop and strengthen writing by planning, revising, editing, rewriting, or trying a new approach, focusing on how well purpose and audience have been addressed.' },
    { code: 'W.7.6', description: 'Use technology to produce and publish writing and link to and cite sources; demonstrate sufficient command of keyboarding skills.' },
    { code: 'L.7.1', description: 'Demonstrate command of conventions: explain function of phrases and clauses; choose among simple, compound, complex, and compound-complex sentences to signal different relationships; place phrases and clauses within a sentence, recognizing and correcting misplaced and dangling modifiers.' },
    { code: 'L.7.2', description: 'Demonstrate command of conventions: use a comma to separate coordinate adjectives; spell correctly.' },
    { code: 'L.7.3', description: 'Use knowledge of language and its conventions: choose language that expresses ideas precisely and concisely, recognizing and eliminating wordiness and redundancy.' },
    { code: 'L.7.4', description: 'Determine or clarify the meaning of unknown and multiple-meaning words and phrases using context clues, affixes, and reference materials.' },
    { code: 'L.7.5', description: 'Demonstrate understanding of figurative language, word relationships, and nuances in word meanings.' },
    { code: 'L.7.6', description: 'Acquire and use accurately grade-appropriate general academic and domain-specific words and phrases.' },
  ],

  '8': [
    { code: 'W.8.1', description: 'Write arguments to support claims with clear reasons and relevant evidence; introduce a claim and distinguish it from alternate or opposing claims; support with logical reasoning and relevant evidence from accurate, credible sources; use transitions; establish and maintain a formal style; provide a concluding statement.' },
    { code: 'W.8.2', description: 'Write informative/explanatory texts; introduce topics clearly, previewing what is to follow; organize ideas using appropriate and varied strategies; develop topics with relevant well-chosen facts, definitions, details, quotations, and examples; use transitions; use precise language and domain-specific vocabulary; establish and maintain a formal style; provide a concluding statement.' },
    { code: 'W.8.3', description: 'Write narratives; engage and orient the reader with a problem, situation, or observation; use narrative techniques (dialogue, pacing, description, reflection, multiple plot lines); use varied transitions and sentence structures; use precise words and sensory language; provide a conclusion that follows from and reflects on the narrated experiences.' },
    { code: 'W.8.4', description: 'Produce clear and coherent writing in which development, organization, and style are appropriate to task, purpose, and audience.' },
    { code: 'W.8.5', description: 'With guidance and support, develop and strengthen writing by planning, revising, editing, rewriting, or trying a new approach, focusing on how well purpose and audience have been addressed.' },
    { code: 'W.8.6', description: 'Use technology to produce and publish writing and present the relationships between information and ideas efficiently; demonstrate sufficient command of keyboarding skills.' },
    { code: 'L.8.1', description: 'Demonstrate command of conventions: explain function of verbals (gerunds, participles, infinitives); form and use verbs in active and passive voice; form and use verbs in indicative, imperative, interrogative, conditional, and subjunctive mood; recognize and correct inappropriate shifts in verb voice and mood.' },
    { code: 'L.8.2', description: 'Demonstrate command of conventions: use punctuation (ellipsis, dash) to indicate a pause or break; use an ellipsis to indicate an omission; spell correctly.' },
    { code: 'L.8.3', description: 'Use knowledge of language and its conventions: use verbs in active and passive voice and in conditional and subjunctive mood to achieve particular effects.' },
    { code: 'L.8.4', description: 'Determine or clarify the meaning of unknown and multiple-meaning words and phrases using context clues, affixes, and reference materials.' },
    { code: 'L.8.5', description: 'Demonstrate understanding of figurative language, word relationships, and nuances in word meanings.' },
    { code: 'L.8.6', description: 'Acquire and use accurately grade-appropriate general academic and domain-specific words and phrases.' },
  ],
};
