// controllers/questionsController.js
const technologyModel = require('../models/technologyModel');
const questionModel = require('../models/questionModel');

const getQuestionCounts = async (req, res) => {
    try {
        const technologies = await technologyModel.getAllTechnologies();

        const questionCounts = await Promise.all(
            technologies.map(async (tech) => {
                const countRes = await questionModel.getAllQuestions();
                const count = countRes.filter(q => q.tech_id === tech.tech_id).length; // Count questions for the specific tech
                return { tech_id: tech.tech_id, tech_name: tech.tech_name, question_count: count };
            })
        );

        res.json(questionCounts);
    } catch (error) {
        console.error('Error fetching question counts:', error);
        res.status(500).json({ error: 'Error fetching question counts' });
    }
};

module.exports = {
    getQuestionCounts,
};
